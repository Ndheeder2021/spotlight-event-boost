// Analytics helper function to read project analytics
export default async function readProjectAnalytics(
  startDate: string,
  endDate: string,
  granularity: "hourly" | "daily"
) {
  try {
    const response = await fetch(
      `/.lovable/api/analytics?startdate=${startDate}&enddate=${endDate}&granularity=${granularity}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch analytics data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw error;
  }
}
