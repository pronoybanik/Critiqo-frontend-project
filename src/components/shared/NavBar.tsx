"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, X, ChevronDown, User, Settings, Search } from "lucide-react";

import logo from "../../assets/logo/1-removebg-preview (2).png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PrimaryButton from "./PrimayButton";
import SecondaryButton from "./SecondaryButton";
import { protectedRoutes } from "@/app/contants";
import { useUser } from "@/context/UserContext";
import { getMyProfile, logout } from "@/services/AuthService";
import { IProfile } from "@/types/profile";

export default function Navbar() {
  const { user, setIsLoading } = useUser();
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [userData, setUserData] = useState<IProfile | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogOut = () => {
    logout();
    setIsLoading(true);
    if (protectedRoutes.some((route) => pathname.match(route))) {
      router.push("/");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getMyProfile();
      setUserData(userData?.data);
    };

    fetchUser();

    // Add scroll event listener
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/reviews", label: "All Reviews" },
    { href: "/about", label: "About Us" },
    { href: "/contactus", label: "Contact" },
    { href: "/blog", label: "Blog" },
  ];

  const megaMenuLinks = [
    {
      title: "Fashion",
      icon: "👕",
      links: [
        { href: "/", label: "Clothing" },
        { href: "/", label: "Shoes" },
        { href: "/", label: "Accessories" },
        { href: "/", label: "Jewelry" },
        { href: "/", label: "Watches" },
        { href: "/", label: "Bags & Purses" },
      ]
    },
    {
      title: "Electronics",
      icon: "📱",
      links: [
        { href: "/", label: "Smartphones" },
        { href: "/", label: "Laptops" },
        { href: "/", label: "Tablets" },
        { href: "/", label: "Audio" },
        { href: "/", label: "Gaming" },
        { href: "/", label: "Cameras" },
      ]
    },
    {
      title: "Home & Living",
      icon: "🏠",
      links: [
        { href: "/", label: "Furniture" },
        { href: "/", label: "Home Decor" },
        { href: "/", label: "Kitchen" },
        { href: "/", label: "Bedding" },
        { href: "/", label: "Lighting" },
        { href: "/", label: "Appliances" },
      ]
    },
    {
      title: "Kitchen Accessories",
      icon: "🍽️",
      links: [
        { href: "/", label: "Sinks" },
        { href: "/", label: "Shelfs" },
        { href: "/", label: "Knifes" },
        { href: "/", label: "Chopping boards" },
        { href: "/", label: "Lighting" },
        { href: "/", label: "Appliances" },
      ]
    }
  ];

  return (
    <section
      className={`w-full sticky top-0 z-50 transition-all duration-500 backdrop-blur-md ${
        isScrolled
          ? "bg-white/90 border-gray-100 py-2"
          : "bg-gradient-to-r from-blue-50/80 via-white/80 to-purple-50/80 py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative h-8 w-24 md:w-28 transform group-hover:scale-105 transition-all duration-300">
              <Image
                src={logo}
                alt="etutor"
                className="transition-all duration-300 hover:opacity-80"
              />
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg -z-10"></div>
            </div>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <nav className="relative">
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 group ${
                    pathname === href
                      ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
                      : "text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:shadow-md"
                  }`}
                >
                  {label}
                  {/* Animated underline */}
                  <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-300 ${pathname === href ? 'w-1/2' : 'w-0 group-hover:w-1/2'}`}></span>
                </Link>
              ))}

              {/* Enhanced Shop megamenu */}
              <div
                className="relative"
                onMouseEnter={() => setMegaMenuOpen(true)}
                onMouseLeave={() => setMegaMenuOpen(false)}
              >
                <button
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-1 group ${
                    megaMenuOpen
                      ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
                      : "text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:shadow-md"
                  }`}
                >
                  <span>Shop</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${megaMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Enhanced mega menu with animations */}
                <div
                  className={`absolute left-0 mt-3 w-[600px] transform transition-all duration-500 ease-out z-50
                    ${megaMenuOpen ? 'opacity-100 scale-100 visible translate-y-0' : 'opacity-0 scale-95 invisible -translate-y-4'}
                    bg-white/95 backdrop-blur-lg shadow-2xl rounded-2xl overflow-hidden border border-gray-100`}
                >
                  {/* Header with gradient */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                    <h3 className="text-white font-semibold text-lg">Shop Categories</h3>
                    <p className="text-blue-100 text-sm">Discover amazing products in every category</p>
                  </div>

                  {/* Enhanced grid layout */}
                  <div className="grid grid-cols-2 gap-6 p-6">
                    {megaMenuLinks.map((column, idx) => (
                      <div key={idx} className="space-y-4 group/column">
                        <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                          <span className="text-xl">{column.icon}</span>
                          <h3 className="text-lg font-semibold text-gray-800 group-hover/column:text-blue-600 transition-colors duration-300">
                            {column.title}
                          </h3>
                        </div>
                        <ul className="space-y-2">
                          {column.links.map((link, linkIdx) => (
                            <li key={linkIdx}>
                              <Link
                                href={link.href}
                                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 block py-2 px-3 rounded-lg group/link"
                              >
                                <span className="group-hover/link:translate-x-1 transition-transform duration-200 inline-block">
                                  {link.label}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Enhanced footer */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4">
                    <Link
                      href="/"
                      className="inline-flex items-center space-x-2 text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200 group"
                    >
                      <span>Browse all products</span>
                      <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Enhanced Right Section */}
          <div className="flex items-center gap-3">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all duration-300 group"
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </button>

            {/* Auth Section */}
            {user?.email ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none group">
                  <div className="flex items-center gap-3 p-2 rounded-full border-2 border-transparent hover:border-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300">
                    <Avatar className="h-9 w-9 ring-2 ring-offset-2 ring-gradient-to-r ring-from-blue-500 ring-to-purple-500 transition-all duration-300 group-hover:ring-4">
                      <AvatarImage src={userData?.profilePhoto || "https://github.com/shadcn.png"} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                        {user?.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                        {user?.email?.split('@')[0]}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {user?.role}
                      </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 mt-2 p-2 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-100 animate-in zoom-in-90 duration-300">
                  {/* User info header */}
                  <div className="px-3 py-2 mb-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.email}
                    </p>
                    <p className="text-xs text-blue-600 capitalize font-medium">
                      {user?.role} Account
                    </p>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-100" />

                  <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <Link href={`/${user?.role.toLocaleLowerCase()}`} className="flex-1 font-medium text-gray-700 group-hover:text-blue-700">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <Settings className="w-4 h-4 text-white" />
                    </div>
                    <Link href="/profile" className="flex-1 font-medium text-gray-700 group-hover:text-green-700">
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-gray-100" />

                  <DropdownMenuItem
                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-300 group"
                    onClick={handleLogOut}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <LogOut className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <PrimaryButton className="text-sm px-6 py-2 rounded-full shadow-lg hover:shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300">
                    Sign In
                  </PrimaryButton>
                </Link>
                <Link href="/register" className="hidden sm:block">
                  <SecondaryButton className="text-sm px-6 py-2 rounded-full border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transform hover:scale-105 transition-all duration-300">
                    Sign Up
                  </SecondaryButton>
                </Link>
              </div>
            )}

            {/* Enhanced Mobile menu button */}
            <button
              className="inline-flex md:hidden items-center justify-center w-10 h-10 rounded-full text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 focus:outline-none transition-all duration-300 transform hover:scale-110"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="relative">
                <Menu className={`w-5 h-5 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
                <X className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation Drawer */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="mt-4 pt-4 pb-4 border-t border-gray-100 bg-white/80 backdrop-blur-lg rounded-2xl">
            <nav className="flex flex-col space-y-2">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-3 rounded-xl transition-all duration-300 flex items-center space-x-3 group ${
                    pathname === href
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="transform group-hover:translate-x-1 transition-transform duration-200">
                    {label}
                  </span>
                </Link>
              ))}
              {!user?.email && (
                <Link
                  href="/register"
                  className="sm:hidden block px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 rounded-xl transition-all duration-300 group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="transform group-hover:translate-x-1 transition-transform duration-200">
                    Sign Up
                  </span>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}