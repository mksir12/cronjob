import { getUser } from '../../lib/users';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    const user = getUser(email, password);
    if (user) {
      return res.status(200).json({ success: true });
    }
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.status(405).end();
}
