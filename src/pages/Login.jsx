import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { motion } from "framer-motion";

function Login() {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // CAPTCHA STATES
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(
        Math.floor(Math.random() * chars.length)
      );
    }
    setCaptcha(result);
    setCaptchaInput("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (captchaInput !== captcha) {
      setError("Captcha incorrect. Please try again.");
      generateCaptcha();
      return;
    }

    const result = login(email.trim(), password.trim());

    if (result.error) {
      setError(result.error);
      generateCaptcha();
      return;
    }

    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 
                    bg-gradient-to-br from-indigo-100/40 to-purple-100/40 
                    dark:from-gray-900 dark:to-gray-800">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center 
                            rounded-2xl bg-gradient-to-br 
                            from-indigo-600 to-purple-600 shadow-lg">
              <Shield className="h-9 w-9 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold bg-gradient-to-r 
                         from-indigo-600 to-purple-600 
                         bg-clip-text text-transparent">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-2">
            Sign in to your CertiVault account
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl 
                        shadow-2xl p-8 border border-gray-200 
                        dark:border-gray-700">

          {error && (
            <p className="text-red-500 text-sm mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-indigo-500"
            />

            {/* PASSWORD */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-indigo-500"
            />

            {/* RANDOM STRING CAPTCHA */}
            <div>
              <label className="block mb-2 font-medium">
                Enter the text below
              </label>

              <div className="flex items-center gap-3 mb-3">
                <div className="px-4 py-2 bg-gray-200 rounded-lg 
                                font-mono tracking-widest 
                                text-lg select-none 
                                rotate-1 skew-x-6">
                  {captcha}
                </div>

                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="px-3 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  ↻
                </button>
              </div>

              <input
                type="text"
                value={captchaInput}
                onChange={(e) =>
                  setCaptchaInput(e.target.value)
                }
                placeholder="Enter captcha"
                required
                className="w-full p-3 rounded-xl border"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-semibold
                         bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              Sign In
            </button>

          </form>

          <p className="mt-6 text-sm text-center text-gray-500">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 font-semibold"
            >
              Register
            </Link>
          </p>

        </div>

      </motion.div>
    </div>
  );
}

export default Login;