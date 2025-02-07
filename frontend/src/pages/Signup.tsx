import type React from "react"
import { useState, useCallback, useMemo, memo } from "react"
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FormInput = memo(({ 
  id, 
  label, 
  type, 
  value, 
  onChange, 
  className 
}: { 
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className: string;
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      required
      className={className}
    />
  </div>
));

const SubmitButton = memo(() => (
  <button
    type="submit"
    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
  >
    Sign Up
  </button>
));

const SignInLink = memo(({ onNavigate }: { onNavigate: () => void }) => (
  <p className="mt-4 text-center text-sm text-gray-600">
    Already have an account?{" "}
    <button
      onClick={onNavigate}
      className="font-medium text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-700"
    >
      Sign in
    </button>
  </p>
));

export default function SignupPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  const { signup, isSigningUp } = useAuthStore();
  const navigate = useNavigate();

  if (isSigningUp) {
    return <div className="flex justify-center items-center absolute inset-0">
      <Loader2 size={40} className="animate-spin"/>
    </div>
  }

  const validate = useCallback(() => {
    if (!username.trim()) return toast.error("Username required");
    if (username.length < 3) return toast.error("Username should contain atleast 3 charachter");
    if (!email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(email)) return toast.error("Email is not Valid");
    if (!password) return toast.error("Password is required");
    if (password.length < 6) return toast.error("Password should be atleast 6 character");

    return true;
  }, [username, email, password]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    const success = validate();
    if (success) {
      const isSuccess = await signup({ email, username, password });
      if (isSuccess) {
        toast.success("Account created successfully")
        navigate('/signin');
      }
    }
    // console.log("Signup submitted", { username, email, password })
  }, [validate, signup, email, username, password, navigate]);

  const inputClassName = useMemo(() => 
    "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black",
    []
  );

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => 
    setEmail(e.target.value), []);
  
  const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => 
    setUsername(e.target.value), []);
  
  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => 
    setPassword(e.target.value), []);

  const handleNavigateToSignin = useCallback(() => navigate("/signin"), [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            id="username"
            label="Username"
            type="text"
            value={username}
            onChange={handleUsernameChange}
            className={inputClassName}
          />
          <FormInput
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            className={inputClassName}
          />
          <FormInput
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            className={inputClassName}
          />
          <SubmitButton />
        </form>
        <SignInLink onNavigate={handleNavigateToSignin} />
      </div>
    </div>
  )
}

