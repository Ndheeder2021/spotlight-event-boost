// Analytics helper function to read project analytics
export default async function readProjectAnalytics(
  startDate: string,
  endDate: string,
  granularity: "hourly" | "daily"
) {
  try {
    // Validate date format: allow YYYY-MM-DD or RFC3339 datetime
    const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;
    const rfc3339Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
    const validStart = dateOnlyRegex.test(startDate) || rfc3339Regex.test(startDate);
    const validEnd = dateOnlyRegex.test(endDate) || rfc3339Regex.test(endDate);
    if (!validStart || !validEnd) {
      throw new Error(`Invalid date format. Expected YYYY-MM-DD or RFC3339, got: ${startDate} to ${endDate}`);
    }

    const url = `/.lovable/api/analytics?startdate=${encodeURIComponent(startDate)}&enddate=${encodeURIComponent(endDate)}&granularity=${granularity}`;
    console.log("Fetching analytics from:", url);

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Analytics API error:", errorText);
      throw new Error(`Failed to fetch analytics: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Unexpected analytics response content-type:", contentType, text.slice(0, 200));
      throw new Error("Kunde inte läsa statistik: servern returnerade oväntat svar. Försök igen senare.");
    }

    const data = await response.json();
    console.log("Analytics data received:", data);
    return data;
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw error;
  }
}
