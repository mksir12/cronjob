// Temporary user store
const users = {
  'demo@example.com': {
    password: '123456',
    apiKey: '8EH3QCKn++aUd4SGWabbE4nb667AvXjfYhR55rQbvBE=',
  },
};

export function getUser(email, password) {
  const user = users[email];
  if (user && user.password === password) return user;
  return null;
}
