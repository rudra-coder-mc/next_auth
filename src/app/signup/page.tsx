"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

// Define types for user object
interface User {
  email: string;
  password: string;
  username: string;
}
export interface CustomErrorResponse {
  error: string; // Define the expected error field as a string
  // Add other fields as needed
}

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
    username: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  // Basic email and password validation
  const validateInput = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(user.email);
    const isPasswordValid = user.password.length >= 8; // Ensure password is at least 8 characters
    const isUsernameValid = user.username.length > 0;

    if (!isEmailValid) {
      toast.error("Invalid email format.");
    } else if (!isPasswordValid) {
      toast.error("Password must be at least 8 characters long.");
    } else if (!isUsernameValid) {
      toast.error("Username is required.");
    }

    return isEmailValid && isPasswordValid && isUsernameValid;
  };

  const onSignup = async () => {
    if (!validateInput()) {
      // If validation fails, return early
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/user/signup", user);
      console.log("Signup success", response);
      toast.success("Signup successful!");
      router.push("/login");
    } catch (e) {
      const error = e as AxiosError<CustomErrorResponse>;
      console.log(error?.response?.data?.error);

      toast.error(
        error.response?.data?.error || "Signup failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>{loading ? "Processing..." : "Signup"}</h1>
      <hr />

      <label htmlFor="username">Username</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="username"
        type="text"
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
        placeholder="Username"
      />

      <label htmlFor="email">Email</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="email"
        type="email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="Email"
      />

      <label htmlFor="password">Password</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="password"
        type="password"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        placeholder="Password (min 8 characters)"
      />

      <button
        onClick={onSignup}
        disabled={loading}
        className={`p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Signing up..." : "Signup"}
      </button>

      <Link href="/login" className="text-blue-500">
        Visit login page
      </Link>
    </div>
  );
}
