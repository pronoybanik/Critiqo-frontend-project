"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  Github,
  Facebook,
  Upload,
  X,
  User,
  Mail,
  Lock,
  CircleUserRound,
} from "lucide-react";
import { registerUser } from "@/services/AuthService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import PrimaryButton from "@/components/shared/PrimayButton";

interface FormFields {
  name: string;
  email: string;
  password: string;
  contactNumber: string;
  file: File | null;
}

export default function Register() {
  const [formData, setFormData] = useState<FormFields>({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    file: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreview(null);
    setFormData((prev) => ({ ...prev, file: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: FormEvent) => {
    setLoading(true);
    e.preventDefault();
    const data = new FormData();

    const payload = {
      password: formData.password,
      guest: {
        name: formData.name,
        email: formData.email,
        contactNumber: formData.contactNumber,
      },
    };

    data.append("data", JSON.stringify(payload));
    if (formData.file) {
      data.append("file", formData.file);
    }

    try {
      const res = await registerUser(data);
      if (res?.success) {
        setLoading(false);
        toast.success(res.message || "Registration successful!");
        router.push("/login");
        // Optionally reset form
      } else {
        toast.error(res.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Registering with ${provider}`);
    // Add OAuth logic if needed
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left Side - Decoration */}
      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 p-12">
        <div className="h-full flex flex-col justify-center items-center text-white">
          <div className="w-full max-w-md">
            <h2 className="text-4xl font-bold mb-6">Join our community</h2>
            <p className="text-lg opacity-90 mb-8">
              Create an account to access premium features and connect with
              other users.
            </p>
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl">
                <div className="flex items-start space-x-4">
                  <div className="bg-white/20 rounded-full p-2">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">100% Private</h3>
                    <p className="text-white/80 mt-1">
                      Your information is secure and will never be shared with
                      third parties.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl">
                <div className="flex items-start space-x-4">
                  <div className="bg-white/20 rounded-full p-2">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Lightning Fast</h3>
                    <p className="text-white/80 mt-1">
                      Experience the fastest platform with optimized
                      performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Create Account
            </h1>
            <p className="mt-3 text-gray-500">Join us to start your journey</p>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleSocialLogin("GitHub")}
              className="group relative flex-1 flex justify-center items-center gap-2 py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
            >
              <Github className="h-5 w-5 text-gray-600" />
              <span>GitHub</span>
            </button>

            <button
              onClick={() => handleSocialLogin("Facebook")}
              className="group relative flex-1 flex justify-center items-center gap-2 py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
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
              <span className="px-4 bg-white text-gray-500">
                Or register with email
              </span>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CircleUserRound className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="contactNumber"
                  name="contactNumber"
                  type="number"
                  autoComplete="contactNumber"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                  placeholder="Contact Number"
                  value={formData.contactNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Profile Picture
                </label>
                <div className="flex items-center justify-between">
                  {preview ? (
                    <div className="relative h-20 w-20">
                      <Image
                        width={100}
                        height={100}
                        src={preview}
                        alt="Profile preview"
                        className="h-20 w-20 rounded-full object-cover border-4 border-indigo-100"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white shadow-md hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="profile-image"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {preview ? "Change Photo" : "Upload Photo"}
                    </label>
                    <input
                      id="profile-image"
                      name="profile-image"
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="sr-only"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <PrimaryButton type="submit">
                {loading ? "Submiteing..." : "Create Account"}
              </PrimaryButton>
            </div>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
