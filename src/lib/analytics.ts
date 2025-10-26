// Analytics helper function to read project analytics
export default async function readProjectAnalytics(
  startDate: string,
  endDate: string,
  granularity: "hourly" | "daily"
) {
  try {
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      throw new Error(`Invalid date format. Expected YYYY-MM-DD, got: ${startDate} to ${endDate}`);
    }

    const url = `/.lovable/api/analytics?startdate=${startDate}&enddate=${endDate}&granularity=${granularity}`;
    console.log("Fetching analytics from:", url);

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Analytics API error:", errorText);
      throw new Error(`Failed to fetch analytics: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Analytics data received:", data);
    return data;
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw error;
  }
}
