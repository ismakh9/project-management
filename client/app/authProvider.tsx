import React, { useState, useContext, useEffect } from "react";
import { useGetUsersQuery } from "@/state/api";
import bcrypt from "bcryptjs";
import { FaEnvelope, FaLock, FaSignOutAlt, FaUser } from "react-icons/fa";

// Create a context to manage user authentication state
const AuthContext = React.createContext<any>(null);

const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: users } = useGetUsersQuery(); // Fetch users from your backend

  useEffect(() => {
    // Optionally, check for an existing session (e.g., JWT token in localStorage)
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Find the user by email
      const foundUser = users?.find((user) => user.email === email);
      
      if (!foundUser) {
        throw new Error("User not found.");
      }

      // Compare the entered password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, foundUser.passwordHash);
      
      if (!isPasswordValid) {
        throw new Error("Invalid password.");
      }

      // If the password is valid, set the user and store it in localStorage
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser)); // Save user session
      console.log("Login successful!");
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

// Custom Hook to access authentication context
const useAuth = () => useContext(AuthContext);

interface LoginFormProps {
  handlePasswordReset: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ handlePasswordReset, handleSignup }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      // Attempt login with entered email and password
      await login(email, password);
      setError(""); // Clear error if login is successful
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
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
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
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
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Login
          </button>
          <div className="flex flex-col text-center mt-4 space-y-2">
          <button
              onClick={handleSignup}
              className="text-blue-500 hover:text-blue-700"
            >
              SIGN UP
            </button>
            <button
              onClick={handlePasswordReset} // Trigger reset password form
              className="text-blue-500 hover:text-blue-700"
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserProfile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <h1>Please log in to view your profile</h1>;
  }

  return (
    <div className="flex items-center space-x-2">
      <FaUser className="text-gray-700 dark:text-gray-300 text-2xl mr-3" />
      <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{user.username}</h1>
      <button onClick={logout} className="bg-blue-400 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500">
        Logout
      </button>
    </div>
  );
};

export { AuthProvider, useAuth, LoginForm, UserProfile };
