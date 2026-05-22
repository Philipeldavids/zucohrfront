import Logo from '../../assets/1777297540099.png';
import { authService } from "../../lib/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Signup = () => {
  


  const navigate = useNavigate();

  const [form, setForm] = useState({
    organizationname: "",
    name: "",
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
      await authService.register(form.email, form.password, form.name, form.organizationname);

      // redirect to login after signup
      navigate("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Signup failed");
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
          Create Account
        </h2>
         {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <form onSubmit ={ handleSubmit }className="space-y-4">
              <div>
            <label className="text-sm">Company Name</label>
            <input
            name="organizationname"
              type="text"
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="ABC Company"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-sm">Full Name</label>
            <input
            name="name"
              type="text"
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="John Doe"
              onChange={handleChange}
            />
          </div>

          <div>
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
              placeholder="Create password"
              onChange={handleChange}
            />
          </div>

          <button disabled={loading} className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition">
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-purple-600 font-medium">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;