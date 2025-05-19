import { getUser } from '../../lib/users';

export default async function handler(req, res) {
  const { email, password } = req.headers;
  const user = getUser(email, password);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const apiKey = user.apiKey;

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };

  const baseUrl = 'https://api.cron-job.org/jobs';

  if (req.method === 'GET') {
    const result = await fetch(baseUrl, { headers });
    const data = await result.json();
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const result = await fetch(baseUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body),
    });
    const data = await result.json();
    return res.status(200).json(data);
  }

  if (req.method === 'DELETE') {
    const { jobId } = req.body;
    const result = await fetch(`${baseUrl}/${jobId}`, {
      method: 'DELETE',
      headers,
    });
    return res.status(200).json({ success: result.ok });
  }

  if (req.method === 'PUT') {
    const { jobId, updates } = req.body;
    const result = await fetch(`${baseUrl}/${jobId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    });
    const data = await result.json();
    return res.status(200).json(data);
  }

  res.status(405).end();
}
