"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { CustomErrorResponse } from "../signup/page";

// Define types for user object (optional, if needed)
interface User {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  // Basic validation: ensure both email and password are filled
  const validateInput = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(user.email);
    const isPasswordValid = user.password.length > 0;

    if (!isEmailValid) {
      toast.error("Invalid email format.");
      return false;
    }
    if (!isPasswordValid) {
      toast.error("Password cannot be empty.");
      return false;
    }
    return true;
  };

  const onLogin = async () => {
    if (!validateInput()) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/user/login", user);
      console.log("Login success", response.data);
      toast.success("Login successful!");
      router.push("/profile");
    } catch (e) {
      const error = e as AxiosError<CustomErrorResponse>;
      console.error("Login failed", error.message);
      toast.error(
        error?.response?.data?.error || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Check if both email and password are filled to enable the button
  useEffect(() => {
    if (user.email && user.password) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>{loading ? "Processing..." : "Login"}</h1>
      <hr />

      <label htmlFor="email">Email</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="email"
        type="email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="Email"
        disabled={loading}
      />

      <label htmlFor="password">Password</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="password"
        type="password"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        placeholder="Password"
        disabled={loading}
      />

      <button
        onClick={onLogin}
        disabled={buttonDisabled || loading}
        className={`p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 ${
          buttonDisabled || loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <Link href="/signup" className="text-blue-500">
        Visit Signup page
      </Link>
    </div>
  );
}
