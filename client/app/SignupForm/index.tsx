import React, { useState } from "react";
import { useCreateUserMutation } from "@/state/api";

interface SignupFormProps {
  handleBackToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ handleBackToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState(""); // Added username field
  const [profilePictureUrl, setProfilePictureUrl] = useState(""); // Optional profile picture URL
  const [teamId, setTeamId] = useState(""); // Optional team ID
  const [error, setError] = useState("");

  const [createUser, { isLoading }] = useCreateUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userData = {
        cognitoId: crypto.randomUUID(), // Generating a unique ID
        username,
        email,
        password,
        profilePictureUrl: profilePictureUrl || "default.png", // Use default if not provided
        teamId: teamId ? parseInt(teamId, 10) : null, // Parse team ID if provided
      };

      const result = await createUser(userData).unwrap();
      setError("");
      alert("User created successfully! Please log in.");
      handleBackToLogin(); // Redirect to login screen
    } catch (err: any) {
      setError(err?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="w-full flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="profilePictureUrl" className="block text-gray-700 mb-2">
              Profile Picture URL (optional)
            </label>
            <input
              type="text"
              id="profilePictureUrl"
              placeholder="Enter profile picture URL"
              value={profilePictureUrl}
              onChange={(e) => setProfilePictureUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="teamId" className="block text-gray-700 mb-2">
              Team ID (optional)
            </label>
            <input
              type="text"
              id="teamId"
              placeholder="Enter your team ID"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white py-2 rounded-lg ${
              isLoading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
            } focus:outline-none focus:ring-2 focus:ring-blue-400`}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={handleBackToLogin}
              className="text-blue-500 hover:text-blue-700"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;