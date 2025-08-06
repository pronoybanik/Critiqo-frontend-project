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
  Phone,
  Camera,
  Shield,
  Zap,
  Check,
  Sparkles,
  ArrowRight,
  Users,
  Star,
} from "lucide-react";
import { registerUser } from "@/services/AuthService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import UploadToCloudinary from "@/components/shared/UploadToCloudinary";

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
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      toast.success("Profile picture uploaded successfully!");
    } else {
      toast.error("Please select a valid image file.");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setPreview(null);
    setFormData((prev) => ({ ...prev, file: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.info("Profile picture removed");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let profilePhoto: string | null = null;

    if (formData.file) {
      profilePhoto = await UploadToCloudinary(formData.file);
      if (!profilePhoto) {
        setLoading(false);
        return;
      }
    }

    const payload = {
      password: formData.password,
      guest: {
        name: formData.name,
        email: formData.email,
        contactNumber: formData.contactNumber,
        profilePhoto,
      },
    };

    try {
      const res = await registerUser(payload); // assumes JSON payload
      if (res?.success) {
        toast.success(res.message || "Registration successful!");
        router.push("/login");
      } else {
        toast.error(res.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} registration coming soon!`);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Left Side - Enhanced Decoration */}
      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tl from-white/10 to-transparent rounded-full blur-3xl"></div>

        <div className="relative h-full flex flex-col justify-center items-center text-white">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-6">
                Join Our Amazing{" "}
                <span className="block text-3xl text-blue-200">Community</span>
              </h2>
              <p className="text-lg opacity-90 mb-8">
                Create an account to access premium features and connect with
                thousands of other users worldwide.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="bg-white/20 rounded-full p-2">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">100% Secure</h3>
                    <p className="text-white/80 mt-1">
                      Your information is protected with bank-level encryption
                      and will never be shared.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="bg-white/20 rounded-full p-2">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Lightning Fast</h3>
                    <p className="text-white/80 mt-1">
                      Experience blazing fast performance with our optimized
                      platform architecture.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="bg-white/20 rounded-full p-2">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Active Community</h3>
                    <p className="text-white/80 mt-1">
                      Connect with like-minded individuals and share your
                      experiences.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-white/80 text-sm">Happy Users</div>
              </div>
              <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                <div className="text-2xl font-bold flex items-center justify-center">
                  4.9
                  <Star className="w-4 h-4 ml-1 fill-current" />
                </div>
                <div className="text-white/80 text-sm">User Rating</div>
              </div>
              <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-white/80 text-sm">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Enhanced Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-400/20 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="relative w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-gray-700 shadow-sm mb-6">
              <Sparkles className="w-4 h-4 mr-2 text-blue-600" />
              Join Us Today
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
              Create Your{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Account
              </span>
            </h1>
            <p className="text-lg text-gray-600">
              Start your amazing journey with us today
            </p>
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
                Or register with email
              </span>
            </div>
          </div>

          {/* Registration Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Profile Picture Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Profile Picture
                </label>
                <div className="flex items-center justify-center">
                  <div
                    className={`relative group ${
                      dragActive ? "scale-105" : ""
                    } transition-transform duration-200`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    {preview ? (
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
                          <Image
                            width={96}
                            height={96}
                            src={preview}
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 rounded-full p-2 text-white shadow-lg hover:bg-red-600 transition-all duration-300 hover:scale-110"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Camera className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="profile-image"
                        className={`cursor-pointer w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center border-3 border-dashed transition-all duration-300 hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 hover:scale-105 ${
                          dragActive
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300"
                        }`}
                      >
                        <Upload className="h-6 w-6 text-gray-400 mb-1" />
                        <span className="text-xs text-gray-500 font-medium">
                          Upload
                        </span>
                      </label>
                    )}
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
                <p className="text-xs text-gray-500 text-center">
                  Drag & drop or click to upload your profile picture
                </p>
              </div>

              {/* Form Fields */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

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
                  className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="contactNumber"
                  name="contactNumber"
                  type="tel"
                  autoComplete="tel"
                  required
                  className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                  placeholder="Contact Number"
                  value={formData.contactNumber}
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
                  autoComplete="new-password"
                  required
                  className="block w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
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

            {/* Terms and Conditions */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-800">
                    By creating an account, you agree to our{" "}
                    <Link
                      href="/terms"
                      className="font-medium underline hover:text-blue-600"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="font-medium underline hover:text-blue-600"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
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
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                )}
              </button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
