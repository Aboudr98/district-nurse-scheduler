"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user for header:", error);
      }
    };

    fetchUser();
  }, [pathName]);

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
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap justify-between items-center gap-2">
      {/* Full name on larger screens, shortened on small screens to avoid wrapping */}
      <Link href="/dashboard" className="text-base sm:text-lg font-semibold text-gray-900 whitespace-nowrap">
        <span className="hidden sm:inline">District Nurse Scheduler</span>
        <span className="sm:hidden">DNS</span>
      </Link>

      {user && (
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
            {user.name} ({user.role})
          </span>
          <button
            onClick={handleLogout}
            className="text-xs sm:text-sm text-blue-600 hover:underline whitespace-nowrap"
          >
            Log out
          </button>
        </div>
      )}
    </header>
  );
}