import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore.js";

function Register() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleRegister = async (e) => {
  e.preventDefault();

  if (
    !formData.name ||
    !formData.email ||
    !formData.password ||
    !formData.confirmPassword
  ) {
    setError("Please fill all fields.");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  const result = await register({
    name: formData.name,
    email: formData.email,
    password: formData.password,
  });

  if (!result.success) {
    setError(result.message);
    return;
  }

  navigate("/");
};

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-xl border bg-white p-8">
        <h1 className="text-3xl font-bold">Register</h1>

        <p className="mt-2 text-gray-600">
          Create your Smart Commerce account.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleRegister} className="mt-6 space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
          />

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

          <input
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
          />

          <button className="w-full rounded-lg bg-black px-4 py-3 text-white hover:bg-gray-800">
            Register
          </button>
        </form>

        <p className="mt-5 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-black">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Register;