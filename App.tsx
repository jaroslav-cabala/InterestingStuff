import { useEffect, useState } from "react";
import { searchUsers, type User } from "./api";

export function App() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [visibleUsers, setVisibleUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number>();
  const [selectedUser, setSelectedUser] = useState<User>();
  const [favorites, setFavorites] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setVisibleUsers(
      users.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase()),
      ),
    );
  }, [users]);

  useEffect(() => {
    setLoading(true);

    searchUsers(query)
      .then((result) => {
        setUsers(result);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [query]);

  function handleSelect(id: number) {
    setSelectedUserId(id);
    setSelectedUser(users.find((user) => user.id === id)!);
  }

  function toggleFavorite(user: User) {
    const existing = favorites.find((favorite) => favorite.id === user.id);

    if (existing) {
      favorites.splice(favorites.indexOf(existing), 1);
      setFavorites(favorites);
    } else {
      favorites.push(user);
      setFavorites(favorites);
    }
  }

  function handleInputChange(event: any) {
    setQuery(event.target.value);
  }

  const selectedName =
    selectedUserId === undefined
      ? "Nobody selected"
      : users.find((user) => user.id === selectedUserId)!.name;

  return (
    <main>
      <h1>User directory</h1>

      <label>
        Search
        <input value={query} onChange={handleInputChange} />
      </label>

      {loading && <p>Loading...</p>}

      <section className="layout">
        <div>
          <h2>Users</h2>

          {visibleUsers.map((user, index) => (
            <div
              key={index}
              className={
                user.id === selectedUserId ? "user selected" : "user"
              }
              onClick={() => handleSelect(user.id)}
            >
              <strong>{user.name}</strong>
              <span>{user.email}</span>
              <span>{user.role}</span>

              <button
                onClick={() => toggleFavorite(user)}
              >
                {favorites.includes(user) ? "★" : "☆"}
              </button>
            </div>
          ))}
        </div>

        <aside>
          <h2>Selection</h2>
          <p>{selectedName}</p>

          {selectedUser && (
            <>
              <p>{selectedUser.email}</p>
              <button
                onClick={() => {
                  selectedUser.role = "admin";
                  setSelectedUser(selectedUser);
                }}
              >
                Make admin
              </button>
            </>
          )}

          <h2>Favorites ({favorites.length})</h2>
          {favorites.map((favorite) => (
            <p key={favorite.id}>{favorite.name}</p>
          ))}
        </aside>
      </section>
    </main>
  );
}
