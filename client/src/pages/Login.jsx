import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore.js";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const login = useAuthStore((state) => state.login);

  const redirectPath = location.state?.from || "/profile";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill all fields.");
      return;
    }

    const result = await login({
      email: formData.email,
      password: formData.password,
    });

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate(redirectPath);
  };

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-xl border bg-white p-8">
        <h1 className="text-3xl font-bold">Login</h1>

        <p className="mt-2 text-gray-600">
          Login to continue shopping.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
          />

          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
          />

          <button className="w-full rounded-lg bg-black px-4 py-3 text-white hover:bg-gray-800">
            Login
          </button>
        </form>

        <p className="mt-5 text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-medium text-black">
            Register
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Login;