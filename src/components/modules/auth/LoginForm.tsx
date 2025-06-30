"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { 
  Eye, 
  EyeOff, 
  Github, 
  Facebook, 
  Mail, 
  Lock, 
  User, 
  Shield, 
  Sparkles,
  ArrowRight,
  Check
} from "lucide-react";
import { loginUser } from "@/services/AuthService";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";

interface LoginForm {
  email: string;
  password: string;
}

// Demo credentials
const DEMO_CREDENTIALS = {
  user: {
    email: "user@gmail.com",
    password: "password23"
  },
  admin: {
    email: "admin@gmail.com",
    password: "password23"
  }
};

export default function Login() {
  const { setIsLoading } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<'user' | 'admin' | null>(null);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear demo selection if user starts typing
    if (selectedDemo) {
      setSelectedDemo(null);
    }
  };

  const handleDemoLogin = (type: 'user' | 'admin') => {
    setSelectedDemo(type);
    setFormData({
      email: DEMO_CREDENTIALS[type].email,
      password: DEMO_CREDENTIALS[type].password
    });
    
    // Show a subtle toast notification
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} credentials loaded!`, {
      duration: 2000
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(formData);
      if (res?.success) {
        toast.success(res.message || "Login successful!");
        setTimeout(() => {
          router.push("/");
          setIsLoading(true);
        }, 1000);
      } else {
        toast.error(res.message || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: "GitHub" | "Facebook") => {
    console.log(`Logging in with ${provider}`);
    toast.info(`${provider} login coming soon!`);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-400/20 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="relative w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-gray-700 shadow-sm mb-6">
              <Sparkles className="w-4 h-4 mr-2 text-blue-600" />
              Welcome Back
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
              Sign In to Your{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Account
              </span>
            </h1>
            <p className="text-lg text-gray-600">
              Continue your amazing journey with us
            </p>
          </div>

          {/* Demo Login Buttons */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">
              Quick Demo Access
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDemoLogin('user')}
                className={`group relative flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-all duration-300 ${
                  selectedDemo === 'user'
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  selectedDemo === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200'
                }`}>
                  <User className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-900 text-sm">User Login</p>
                  <p className="text-xs text-gray-500">Standard Access</p>
                </div>
                {selectedDemo === 'user' && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>

              <button
                onClick={() => handleDemoLogin('admin')}
                className={`group relative flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-all duration-300 ${
                  selectedDemo === 'admin'
                    ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  selectedDemo === 'admin'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                    : 'bg-purple-100 text-purple-600 group-hover:bg-purple-200'
                }`}>
                  <Shield className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-900 text-sm">Admin Login</p>
                  <p className="text-xs text-gray-500">Full Access</p>
                </div>
                {selectedDemo === 'admin' && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Social Login */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleSocialLogin("GitHub")}
              className="group relative flex-1 flex justify-center items-center gap-2 py-3 px-4 border-2 border-gray-200 rounded-xl shadow-sm bg-white/80 backdrop-blur-sm text-sm font-medium text-gray-700 hover:border-gray-300 hover:bg-white hover:shadow-md transition-all duration-300"
            >
              <Github className="h-5 w-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-300" />
              <span>GitHub</span>
            </button>

            <button
              onClick={() => handleSocialLogin("Facebook")}
              className="group relative flex-1 flex justify-center items-center gap-2 py-3 px-4 border-2 border-gray-200 rounded-xl shadow-sm bg-white/80 backdrop-blur-sm text-sm font-medium text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
            >
              <Facebook className="h-5 w-5 text-blue-600" />
              <span>Facebook</span>
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-500 rounded-full">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`block w-full pl-12 pr-4 py-4 border-2 rounded-xl bg-white/80 backdrop-blur-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                    selectedDemo ? 'border-green-300 bg-green-50/50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className={`block w-full pl-12 pr-12 py-4 border-2 rounded-xl bg-white/80 backdrop-blur-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                    selectedDemo ? 'border-green-300 bg-green-50/50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-4"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                )}
              </button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Dont have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Enhanced Decoration */}
      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tl from-white/10 to-transparent rounded-full blur-3xl"></div>

        <div className="relative h-full flex flex-col justify-center items-center text-white">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-6">
                Start Your Journey{" "}
                <span className="block text-3xl text-blue-200">With Us</span>
              </h2>
              <p className="text-lg opacity-90 mb-8">
                Access all features and enjoy a personalized experience tailored
                just for you. Join thousands of satisfied users today.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20">
                <div className="flex items-start space-x-4">
                  <div className="bg-white/20 rounded-full p-2">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Secure & Fast</h3>
                    <p className="text-white/80 mt-1">
                      Your data is always protected with our advanced security
                      features and encryption.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20">
                <div className="flex items-start space-x-4">
                  <div className="bg-white/20 rounded-full p-2">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Premium Experience</h3>
                    <p className="text-white/80 mt-1">
                      Enjoy a seamless and intuitive interface designed for
                      optimal user experience.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20">
                <div className="flex items-start space-x-4">
                  <div className="bg-white/20 rounded-full p-2">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">24/7 Support</h3>
                    <p className="text-white/80 mt-1">
                      Our dedicated support team is always here to help you
                      succeed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-white/80 text-sm">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-white/80 text-sm">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">4.9★</div>
                <div className="text-white/80 text-sm">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}