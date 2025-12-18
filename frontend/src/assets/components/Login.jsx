import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ImSpinner } from "react-icons/im";

const Login = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // ✅ useMutation hook
  const mutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      return res.data; // axios me .data milta hai response me
    },
    onSuccess: (data) => {
      console.log("✅Login success", data);
      setSuccess(true);

      const authtoken = data.token;
      const username = data.name;
      const userId = data.userId;
      localStorage.setItem("authtoken", authtoken);
      localStorage.setItem("username", username);
      localStorage.setItem("userId", userId);
      
      onLoginSuccess();
      setTimeout(() => {
        
        navigate("/dashboard/income");
       
      }, 800);
    },
    onError: (error) => {
      console.error(
        "❌ Login error",
        error.response?.data?.message || error.message
      );
      setSuccess(false);
    },
  });

  // handling mutation function
  const handleLogin = () => {
    mutation.mutate({ email, password });
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-[#1f0117] rounded-xl shadow-lg w-[90%] max-w-md p-6">
        <h2 className="text-2xl font-bold text-center text-[#B33791]">Login</h2>

        {/* for email  */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mt-4 p-2 border rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* for password */}
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-4 p-2 border rounded"
          />
          <span
            className="absolute right-3 top-8 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <FaEyeSlash color="#B33791" />
            ) : (
              <FaEye color="#B33791" />
            )}
          </span>
        </div>

        {/* button for login */}
        <button
          className="w-full bg-[#B33791] text-white py-2 rounded hover:bg-[#B33791] mt-2.5"
          onClick={handleLogin}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <ImSpinner className="animate-spin  ml-28 md:ml-50" />
          ) : (
            "Login"
          )}
        </button>
        {mutation.isError && (
          <p className="text-red-500 text-sm mt-2">{mutation.error.message}</p>
        )}
        {success && <p className="text-green-600 mt-2 ">Login successful!</p>}

        {/* cancel button */}
        <button
          onClick={onClose}
          className="w-full mt-2 text-sm text-[#B33791] hover:underline"
        >
          Cancel
        </button>
        <p className="ml-10  bg-gradient-to-r from-[#B33791] to-white bg-clip-text text-transparent ">
          Dont't have an account?{" "}
          <Link className="text-[#B33791]" to="/register">
            Signup here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
