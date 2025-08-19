import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface User {
    id: string;
    email: string;
}

export default function UsersPage() {
    const { user, loading: authLoading } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Only fetch if auth is loaded and user is logged in
        if (authLoading || !user) return;

        const fetchUsers = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("/api/user/list", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || "Failed to fetch users");
                }

                const data = await res.json();
                setUsers(data.users);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [user, authLoading]);

    if (authLoading) return <p>Loading...</p>;
    if (!user) return <p>Please log in to view users.</p>;
    if (loading) return <p>Loading users...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Users List</h1>
            <ul>
                {users.map((u) => (
                    <li key={u.id}>{u.email}</li>
                ))}
            </ul>
        </div>
    );
}