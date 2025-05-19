export default async function handler(req, res) {
  const API_KEY = "8EH3QCKn++aUd4SGWabbE4nb667AvXjfYhR55rQbvBE=";
  try {
    const response = await fetch("https://api.cron-job.org/jobs", {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch cron jobs" });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
