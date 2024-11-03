// pages/register.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import { signUpWithEmail } from "../lib/auth";
import Link from "next/link";

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(""); // Reset error message

    try {
      await signUpWithEmail(formData.email, formData.password);
      router.push("/login"); // Redirect on success
    } catch (error) {
      setErrorMessage(error.message); // Set error message for display
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Start managing your tasks today
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                         placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                         dark:bg-gray-800 dark:focus:ring-indigo-400"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                         placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                         dark:bg-gray-800 dark:focus:ring-indigo-400"
                placeholder="Create a password"
              />
            </div>
          </div>

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium 
                       rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 
                       focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors duration-200"
            >
              {isLoading ? "Creating..." : "Create Account"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link 
              href="/login" 
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 
                       dark:hover:text-indigo-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
