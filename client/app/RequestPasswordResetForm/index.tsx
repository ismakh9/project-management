import React, { useState } from "react";
import { useGetPasswordMutation } from "@/state/api"; // Import the mutation hook
import ResetPasswordForm from "../ResetPasswordForm";

const RequestPasswordResetForm = () => {
  const [email, setEmail] = useState(""); // Use state for email input
  const [message, setMessage] = useState(""); // State to hold success/error message
  const [resetToken, setResetToken] = useState<string | null>(null); // Store the reset token
  const [getPassword, { isLoading, error }] = useGetPasswordMutation(); // Get the mutation hook

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await getPassword({ email }); // Trigger the password reset with the email
      setMessage(response.data.message); // Set the success message from response
      setResetToken(response.data.resetToken); // Store the reset token when received
    } catch (error: any) {
      setMessage("Please provide a valid email address. The entered email may not exist in our system."); // Clearer error message
    }
  };

  return (
    <div className="w-full flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        {resetToken ? (
          <ResetPasswordForm resetToken={resetToken} /> // Show ResetPasswordForm if token is available
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Request Password Reset
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Handle email input change
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {isLoading ? "Sending..." : "Request Password Reset"}
              </button>
            </form>
            {message && (
              <p className={`mt-4 text-center ${error ? "text-red-600" : "text-green-600"}`}>
                {message}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RequestPasswordResetForm;
