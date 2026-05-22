import Logo from "../../assets/1777297540099.png";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { authService } from '../../lib/api';

const Login = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await authService.login(form.email, form.password);
    
      
      // ✅ Save token
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("org", JSON.stringify(res.organization))
      localStorage.setItem("orgCurrency", res.organization.currencyCode);
      localStorage.setItem("orgCurrencySymbol", res.organization.currencySymbol);
      localStorage.setItem("username", res.user.name);
      localStorage.setItem("token", res.accessToken);
      localStorage.setItem("permissions", JSON.stringify(res.user.permissions));
      
        console.log(res.accessToken);
        console.log(res.user);
        console.log(res);
      // 🔁 Redirect
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={Logo} alt="ZucoHR" className="h-12" />
        </div>

        <h2 className="text-2xl font-semibold text-center mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}
            <label className="text-sm">Email</label>

            <input
            name="email"
              type="email"
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your email"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm">Password</label>
            <input
            name="password"
              type="password"
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your password"
              onChange={handleChange}
            />
          </div>

          <button 
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <a href="/signup" className="text-purple-600 font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;