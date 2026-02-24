import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";

function Register() {
  const { signup } = useContext(UserContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const result = signup(
      form.name.trim(),
      form.email.trim(),
      form.password.trim(),
      form.role
    );

    if (result.error) {
      setError(result.error);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 
                    bg-gradient-to-br from-pink-100 to-orange-100 
                    dark:from-gray-900 dark:to-gray-800">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >

        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center 
                            rounded-2xl bg-gradient-to-br 
                            from-pink-500 to-orange-500 shadow-lg">
              <UserPlus className="h-9 w-9 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold bg-gradient-to-r 
                         from-pink-500 to-orange-500 
                         bg-clip-text text-transparent">
            Create Account
          </h1>

          <p className="text-gray-500 mt-2">
            Join CertiTrack and start managing certifications
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl 
                        shadow-2xl p-8 border border-gray-200 
                        dark:border-gray-700">

          {error && (
            <p className="text-red-500 text-sm mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NAME */}
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl border 
                         focus:ring-2 focus:ring-pink-400 
                         outline-none dark:bg-gray-700 
                         dark:border-gray-600"
            />

            {/* EMAIL */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl border 
                         focus:ring-2 focus:ring-pink-400 
                         outline-none dark:bg-gray-700 
                         dark:border-gray-600"
            />

            {/* PASSWORD */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl border 
                         focus:ring-2 focus:ring-pink-400 
                         outline-none dark:bg-gray-700 
                         dark:border-gray-600"
            />

            {/* ROLE */}
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border 
                         focus:ring-2 focus:ring-pink-400 
                         outline-none dark:bg-gray-700 
                         dark:border-gray-600"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-semibold
                         bg-gradient-to-r from-pink-500 to-orange-500
                         hover:opacity-90 transition"
            >
              Create Account
            </button>

          </form>

          <p className="mt-6 text-sm text-center text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-orange-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>

        </div>

      </motion.div>
    </div>
  );
}

export default Register;