// src/components/Signup.jsx
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Login from "./Login";
import { FaEye, FaEyeSlash, FaInfoCircle } from "react-icons/fa";
import { ImSpinner } from "react-icons/im";

const Signup = ({ onClose, email }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailField, setEmailField] = useState(email); // Email state to
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState("");

  

  // Sync email prop with state when the modal opens
  useEffect(() => {
    setEmailField(email);
  }, [email]);

  // ✅ useMutation hook
  const mutation = useMutation({
    mutationFn: async ({ name, email, password }) => {
      const res = await axios.post("http://localhost:3000/auth/register", {
        name,
        email,
        password,
      });
      return res.data; // axios me .data milta hai response me
    },
    onSuccess: (data) => {
      setSuccess(true);
         setTimeout(() => {
        navigate("/dashboard");
      }, 800);

      setTimeout(() => {
        onClose();
      }, 1000);
    },
    onError: (error) => {
      console.error(
        "❌ Signup error",
        error.response?.data?.message || error.message
      );
      setSuccess(false);
    },
  });

  const fieldErrors = mutation.error?.response?.data?.errors || {};

  // function to handle mutation
  const handleSignup = () => {
    
    mutation.mutate({ name, email: emailField, password });
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-[#1f0117] rounded-xl shadow-lg w-[90%] max-w-md p-6">
        <h2 className="text-2xl font-bold text-center text-[#B33791]">
          Sign Up
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mt-4 p-2 border rounded"
        />
        {fieldErrors.name && (
          <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>
        )}




{/* for email  */}
        <input
          type="email"
          placeholder="Email"
          value={emailField} // Pre-filled email
          className="w-full mt-4 p-2 border rounded"
          onChange={(e) => setEmailField(e.target.value)}
        />
        {/* backend error  */}
        {fieldErrors.email && (
          <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
        )}
        {/* frontend error  */}
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}








{/* for password  */}
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => {
              const pwd = e.target.value;
              setPassword(pwd);

              const isStrong = /[a-zA-Z]/.test(pwd) && /[0-9]/.test(pwd);
              if (pwd.length < 8) {
                setPasswordStrength("Invalid");
              } else {
                setPasswordStrength(isStrong ? "Strong" : "Weak");
              }
            }}
            className="w-full mt-4 p-2 border rounded"
          />
          <span
            className="absolute right-3 top-8 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash color="#B33791" /> : <FaEye color="#B33791" />}
          </span>
        </div>

        {/* this is backend side error for sahi se password nhi dala  */}
        {fieldErrors.password && (
          <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
        )}

        {/* this is for frontend */}
        {passwordStrength && (
          <div className="flex items-center gap-2 mt-1">
            {passwordStrength === "Invalid" ? (
              <p className="text-red-500 text-sm flex items-center">
                <FaInfoCircle className="mr-1" /> Invalid password (Min 8 chars)
              </p>
            ) : (
              <p
                className={`text-sm ${
                  passwordStrength === "Strong"
                    ? "text-green-600"
                    : "text-yellow-500"
                }`}
              >
                {passwordStrength} password
              </p>
            )}
          </div>
        )}

        <button
          className="w-full bg-[#B33791] text-white py-2 rounded hover:bg-[#B33791] mt-2.5"
          onClick={handleSignup}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <ImSpinner className="animate-spin  ml-28 md:ml-50" />
          ) : (
            "Create Account"
          )}
        </button>

        {mutation.isError && (
          <p className="text-red-500 text-sm mt-2">{mutation.error.message}</p>
        )}
        {success && (
          <p className="text-green-600 mt-2 ">Account created successfully!</p>
        )}
        <button
          onClick={onClose}
          className="w-full mt-2 text-sm text-[#B33791] hover:underline"
        >
          Cancel
        </button>
        {/* Conditional rendering of Login/Signup */}
        {showLogin ? (
          <Login onClose={() => setShowLogin(false)} />
        ) : (
          <p className="ml-10   bg-gradient-to-r from-[#B33791] to-white bg-clip-text text-transparent text-sm md:text-sm">
            Already have an account?
            <span
              onClick={() => setShowLogin(true)}
              className="text-[#B33791] cursor-pointer ml-10 md:ml-1.5 "
            >
              Login here
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Signup;
