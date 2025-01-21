import React, { useState } from "react";
import { useGetResetPasswordMutation } from "@/state/api"; // Import the mutation hook

const ResetPasswordForm = ({ resetToken }: { resetToken: string }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Track confirm password
  const [message, setMessage] = useState("");

  const [getResetPassword, { isLoading, error }] = useGetResetPasswordMutation();
  const token = resetToken;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!newPassword || !confirmPassword || !token) {
      setMessage("Please fill out all fields.");
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await getResetPassword({ token, newPassword }); // Use the mutation hook
      setMessage(response.data.message || "Password reset successfully.");
    } catch (error: any) {
      setMessage("An error occurred while resetting the password.");
    }
  };

  const handleBackToLogin = () => {
    window.location.reload(); // Refresh the page
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Reset Password
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="newPassword"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} // Update confirm password state
            placeholder="Confirm password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
      {message && (
        <p
          className={`mt-4 text-center ${
            message.includes("successfully") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
      {error && (
        <p className="mt-4 text-center text-red-600">Error: {error.message}</p>
      )}
      <button
        onClick={handleBackToLogin}
        className="w-full mt-4 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        Back to Login
      </button>
    </>
  );
};

export default ResetPasswordForm;
