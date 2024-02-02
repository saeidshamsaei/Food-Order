import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // New state for admin sign up/login

  let navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (isSignUp) {
        // Handle signup logic
        const endpoint = isAdmin
          ? "https://food-order-ochre.vercel.app/api/admin-register" // Example admin register endpoint
          : "https://food-order-ochre.vercel.app/api/register"; // Default register endpoint

        const req = await axios.post(endpoint, {
          firstName,
          lastName,
          email,
          password,
        });
        if (req.data.token) {
          const { token } = req.data;
          localStorage.setItem("token", token);
          console.log("sign up token", token);
          console.log("User registered successfully", token);
        }

        navigate(isAdmin ? "/adminpanel" : "/home");
      } else {
        // Handle login logic
        const endpoint = isAdmin
          ? "https://food-order-ochre.vercel.app/api/admin-login" // Example admin login endpoint
          : "https://food-order-ochre.vercel.app/api/login"; // Default login endpoint

        const response = await axios.post(endpoint, {
          email,
          password,
        });

        // Check if the response contains a token
        if (response.data.token) {
          const { token } = response.data;
          localStorage.setItem("token", token);
          console.log("User logged in successfully. Token:", token);
          navigate(isAdmin ? "/adminpanel" : "/home");

          // Save the token in your application state or local storage for future requests
        } else {
          console.error("Token not found in the login response");
        }
      }
    } catch (error) {
      console.error("Authentication error: i");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md">
        {isSignUp && (
          <>
            <div className="mb-4">
              <label
                htmlFor="firstName"
                className="block text-gray-600 text-sm font-medium mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="lastName"
                className="block text-gray-600 text-sm font-medium mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </>
        )}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-600 text-sm font-medium mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-600 text-sm font-medium mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
            required
          />
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Admin
            </label>
            <input
              type="checkbox"
              id="isAdmin"
              checked={isAdmin}
              onChange={() => setIsAdmin((prev) => !prev)}
              className="mr-1"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-indigo-500 text-white py-2 px-4 rounded focus:outline-none hover:bg-indigo-600"
        >
          {isSignUp ? "Sign Up" : "Login"}
        </button>
        <p className="text-gray-600 mt-2">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <span
            className="text-indigo-500 cursor-pointer ml-1"
            onClick={() => setIsSignUp((prev) => !prev)}
          >
            {isSignUp ? "Login" : "Sign Up"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default AdminLogin;
