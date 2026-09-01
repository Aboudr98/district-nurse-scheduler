"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/me");
        if (response.ok) {
          router.push("/dashboard");
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error checking session:", error);
        router.push("/login");
      }
    };

    checkSession();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="text-gray-600">Loading...</p>
    </div>
  );
}