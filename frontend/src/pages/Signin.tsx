import { useState, useCallback, useMemo } from "react"
import { useAuthStore } from "../store/useAuthStore"
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function SigninPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { signin, isLoggingIn } = useAuthStore();
  const navigate = useNavigate();

  const validateForm = useCallback(() => {
    if (!email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(email)) return toast.error("Invalid email format");
    if (!password) return toast.error("Password is required");
    if (password.length < 6) return toast.error("Password must contain at least 6 characters");
    return true;
  }, [email, password]);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) {
      const response = await signin({ email, password });
      if (response) {
        navigate('/dashboard');
        console.log("Logged in successfully");
      }
    }
  }, [validateForm, signin, email, password, navigate]);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handleSignupClick = useCallback(() => {
    navigate("/signup");
  }, [navigate]);

  const formContent = useMemo(() => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
      >
        Sign In
      </button>
    </form>
  ), [email, password, handleSubmit, handleEmailChange, handlePasswordChange]);

  // Memoize the loading spinner component
  const loadingSpinner = useMemo(() => (
    <div className="flex justify-center items-center absolute inset-0">
      <Loader2 size={40} className="animate-spin"/>
    </div>
  ), []);

  // Memoize the signup section
  const signupSection = useMemo(() => (
    <p className="mt-4 text-center text-sm text-gray-600">
      Create an account?{" "}
      <button
        onClick={handleSignupClick}
        className="font-medium text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-700"
      >
        Sign up
      </button>
    </p>
  ), [handleSignupClick]);

  if (isLoggingIn) {
    return loadingSpinner;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
        {formContent}
        {signupSection}
      </div>
    </div>
  )
}

