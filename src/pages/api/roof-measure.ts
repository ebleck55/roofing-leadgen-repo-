import type { APIRoute } from "astro";
import { GOOGLE_MAPS_API_KEY } from "astro:env/server";
import { rateLimit, clientKey } from "~/lib/rate-limit";

export const prerender = false;

/**
 * Roof measurement proxy for /roof-size-calculator.
 *
 * Calls Google's Solar API (buildingInsights) server-side so the key never
 * ships to the browser, and reduces the response to the handful of numbers
 * the page needs. Best-effort per the integrations pattern: missing key, no
 * coverage, or any upstream failure all return { available: false } — the
 * page then falls back to its draw-it-yourself mode. Never throws.
 *
 * This endpoint spends real Google quota, so it is rate-limited per IP and
 * soft-guarded to same-site referers (a deterrent, not a security boundary —
 * set quota caps on the key in the Google Cloud console too).
 */

const M2_TO_FT2 = 10.7639;

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

export const GET: APIRoute = async ({ request, url }) => {
  if (!GOOGLE_MAPS_API_KEY) return json({ available: false, reason: "unconfigured" });

  if (!rateLimit(`roof:${clientKey(request.headers)}`, { limit: 12, windowMs: 60_000 }).allowed) {
    return json({ available: false, reason: "rate_limited" }, 429);
  }

  const referer = request.headers.get("referer") ?? "";
  if (referer && !referer.includes(url.host)) {
    return json({ available: false, reason: "forbidden" }, 403);
  }

  const lat = Number(url.searchParams.get("lat"));
  const lng = Number(url.searchParams.get("lng"));
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    return json({ available: false, reason: "bad_request" }, 400);
  }

  try {
    const upstream = await fetch(
      "https://solar.googleapis.com/v1/buildingInsights:findClosest" +
        `?location.latitude=${lat}&location.longitude=${lng}` +
        `&requiredQuality=LOW&key=${GOOGLE_MAPS_API_KEY}`,
    );
    if (!upstream.ok) return json({ available: false, reason: "no_coverage" });

    const data = (await upstream.json()) as {
      imageryDate?: { year?: number; month?: number };
      solarPotential?: {
        roofSegmentStats?: {
          pitchDegrees?: number;
          stats?: { areaMeters2?: number; groundAreaMeters2?: number };
        }[];
        wholeRoofStats?: { areaMeters2?: number; groundAreaMeters2?: number };
      };
    };

    const sp = data.solarPotential;
    const segments = sp?.roofSegmentStats ?? [];
    let roofM2 = 0;
    let planM2 = 0;
    let pitchWeighted = 0;

    for (const seg of segments) {
      const pitchDeg = Number(seg.pitchDegrees ?? 0);
      const area = Number(seg.stats?.areaMeters2 ?? 0);
      const ground = Number(seg.stats?.groundAreaMeters2 ?? 0);
      // areaMeters2 is the sloped surface; reconstruct either side if missing.
      const cos = Math.cos((pitchDeg * Math.PI) / 180) || 1;
      const segRoof = area || ground / cos;
      const segPlan = ground || area * cos;
      roofM2 += segRoof;
      planM2 += segPlan;
      pitchWeighted += pitchDeg * segRoof;
    }

    if (roofM2 <= 0 && sp?.wholeRoofStats) {
      roofM2 = Number(sp.wholeRoofStats.areaMeters2 ?? 0);
      planM2 = Number(sp.wholeRoofStats.groundAreaMeters2 ?? 0) || roofM2;
    }
    if (roofM2 <= 0) return json({ available: false, reason: "no_roof" });

    const roofFt2 = roofM2 * M2_TO_FT2;
    return json({
      available: true,
      roofFt2: Math.round(roofFt2),
      planFt2: Math.round((planM2 || roofM2) * M2_TO_FT2),
      squares: Math.round((roofFt2 / 100) * 10) / 10,
      avgPitchDeg: segments.length > 0 ? Math.round(pitchWeighted / roofM2) : null,
      segments: segments.length,
      imageryDate: data.imageryDate ?? null,
    });
  } catch {
    return json({ available: false, reason: "error" });
  }
};
