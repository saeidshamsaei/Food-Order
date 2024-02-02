import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import backgroundImageDesktop from "../img/fullmode.jpg";

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

const Login = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  let navigate = useNavigate();

  const saveUserInfoToLocalStorage = (token: string) => {
    const user: User = {
      firstName,
      lastName,
      email,
    };

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (isSignUp) {
        // Handle signup logic
        const response = await axios.post(
          "https://food-order-api-eight.vercel.app/api/register",
          {
            firstName,
            lastName,
            email,
            password,
          }
        );
        console.log(response.data);
        console.log(response.data.token);

        if (response.data.token) {
          const { token } = response.data;
          localStorage.setItem("token", token);
          saveUserInfoToLocalStorage(token);
          console.log("Before navigation");
          navigate("/home");
        }
        else{
           console.error("Registration failed:", response.data.message);
        }
      } else {
        // Handle login logic
        const response = await axios.post(
          "https://food-order-api-eight.vercel.app/api/login",
          {
            firstName,
            lastName,
            email,
            password,
          }
        );
        // Check if the response contains a token
        if (response.data.token) {
          const { token } = response.data;
          localStorage.setItem("token", token);
          saveUserInfoToLocalStorage(token);
          navigate("/home");
        } else {
          console.error("Token not found in the login response");
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  return (
    <div
      className="flex items-center justify-center "
      style={{
        backgroundImage: `url(${backgroundImageDesktop})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        height: "100%",
        position: "fixed",
      }}
    >
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
        </div>
        <button
          type="submit"
          className="bg-indigo-500 text-white py-2 px-4 rounded focus:outline-none hover:bg-indigo-600"
        >
          {isSignUp ? "Sign Up" : "Login"}
        </button>
        <p className="text-gray-600 mt-2">
          {isSignUp
            ? "Already have an account? after submitting click on"
            : "Don't have an account?"}
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

export default Login;
