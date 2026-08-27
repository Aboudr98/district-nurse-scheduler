"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  // Holds the currently logged-in user's info (staffID, name, role),
  // or null if no one is logged in / not yet loaded.
  const [user, setUser] = useState(null);
  const router = useRouter();

  // On mount, ask the server who's logged in (if anyone), same pattern
  // as the dashboard page. This runs independently on every page that
  // includes <Header />, since the header has no way to receive this
  // information from a parent page directly.
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          // Not logged in (401) — this is expected on the login page,
          // so we don't treat it as an error, just leave user as null.
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user for header:", error);
      }
    };

    fetchUser();
  }, []);

  // Calls the logout route to clear the session cookie, then sends
  // the user back to the login page and resets local state.
  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      {/* App name/branding — always visible, links back to the dashboard */}
      <Link href="/dashboard" className="text-lg font-semibold text-gray-900">
        District Nurse Scheduler
      </Link>

      {/* Only show user info + logout if someone is actually logged in.
          On the login page (or before the fetch resolves), user is null,
          so this whole block simply doesn't render. */}
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {user.name} ({user.role})
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-blue-600 hover:underline"
          >
            Log out
          </button>
        </div>
      )}
    </header>
  );
}