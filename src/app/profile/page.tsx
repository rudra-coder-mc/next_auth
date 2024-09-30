"use client";

import axios, { AxiosError } from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null); // Store user ID
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Logout function
  const logout = async () => {
    try {
      await axios.get("/api/user/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (e: unknown) {
      const error = e as AxiosError;
      console.error(error.message);
      toast.error("Logout failed. Please try again.");
    }
  };

  // Get user details function
  const getUserDetails = async () => {
    setLoading(true); // Set loading state to true
    setError(null); // Reset error state

    try {
      const res = await axios.get("/api/user/me");
      console.log(res.data);
      setUserId(res.data.data._id); // Set user ID from response
    } catch (e: unknown) {
      const error = e as AxiosError;
      console.error(error.message);
      setError("Failed to fetch user details. Please try again."); // Set error message
      toast.error(error.message);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Automatically fetch user details on component mount
  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile</h1>
      <hr />
      <p>Profile page</p>

      <h2 className="p-1 rounded bg-green-500">
        {loading ? (
          "Loading..."
        ) : userId ? (
          <Link href={`/profile/${userId}`}>{userId}</Link>
        ) : (
          "Nothing"
        )}
      </h2>

      {error && <p className="text-red-500">{error}</p>}

      <hr />
      <button
        onClick={logout}
        className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>

      <button
        onClick={getUserDetails}
        className="bg-green-800 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Get User Details
      </button>
    </div>
  );
}
