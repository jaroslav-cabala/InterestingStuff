export type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
};

const USERS: User[] = [
  { id: 1, name: "Anna Novak", email: "anna@example.com", role: "admin" },
  { id: 2, name: "Ben Miller", email: "ben@example.com", role: "editor" },
  { id: 3, name: "Clara Smith", email: "clara@example.com", role: "viewer" },
  { id: 4, name: "David Brown", email: "david@example.com", role: "editor" },
  { id: 5, name: "Eva Green", email: "eva@example.com", role: "viewer" },
];

export async function searchUsers(query: string): Promise<User[]> {
  const delay = query.length === 1 ? 700 : 150;
  await new Promise((resolve) => setTimeout(resolve, delay));

  return USERS.filter((user) =>
    user.name.toLowerCase().includes(query.toLowerCase()),
  );
}
