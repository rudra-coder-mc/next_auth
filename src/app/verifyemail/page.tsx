"use client";

import axios, { AxiosError } from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { CustomErrorResponse } from "../signup/page";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // For loading state

  const verifyUserEmail = async () => {
    try {
      const res = await axios.post("/api/user/verifyemail", { token });
      console.log(res);

      setVerified(true);
      toast.success("Email verified successfully!");
    } catch (e: unknown) {
      const error = e as AxiosError<CustomErrorResponse>;
      console.log(error?.response?.data?.error);

      setError(error.response?.data?.error || "Verification failed.");
      toast.error("Verification failed.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (token) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl mb-4">Verify Email</h1>

      {/* Display loading state */}
      {loading && <h2 className="text-xl">Verifying...</h2>}

      {/* Display verification token (for debugging purposes) */}
      <h2 className="p-2 bg-orange-500 text-black mb-4">
        {token ? `Token: ${token}` : "No token found"}
      </h2>

      {/* Display success message */}
      {verified && !loading && (
        <div>
          <h2 className="text-2xl text-green-600 mb-4">Email Verified</h2>
          <Link href="/login">
            <p className="text-blue-500 underline">Go to Login</p>
          </Link>
        </div>
      )}

      {/* Display error message */}
      {error && !loading && (
        <div>
          <h2 className="text-2xl bg-red-500 text-white p-2">Error: {error}</h2>
        </div>
      )}
    </div>
  );
}
