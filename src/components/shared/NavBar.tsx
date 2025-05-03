"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";

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
  const [userData, setUserData] = useState<IProfile | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
  console.log("t", userData);
  

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/reviews", label: "All Reviews" },
    { href: "/about", label: "About Us" },
    { href: "/contactus", label: "Contact" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <section
      className={`w-full sticky top-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-white shadow-md py-2"
          : "bg-gradient-to-r from-blue-50 to-gray-50 py-4"
        }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-10 w-48 md:w-40">
              <Image
                
                src={ logo}
                alt="etutor"
                layout="fill"
                objectFit="contain"
                className="transition-all duration-300 hover:opacity-80"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${pathname === href
                    ? "text-purple-700 bg-blue-50"
                    : "text-gray-700 hover:text-purple-700  hover:bg-blue-50"
                  }`}
              >
                {label}
                {pathname === href && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-purple-700 rounded-full"></span>
                )}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons or User Menu */}
          <div className="flex items-center gap-2">
            {user?.email ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none group">
                  <div className="flex items-center gap-2 p-1 rounded-full border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-all duration-200">
                    <Avatar className="h-8 w-8 ring-2 ring-offset-2 ring-blue-500 transition-all duration-300 group-hover:ring-blue-400">
                      <AvatarImage src={userData?.profilePhoto || "https://github.com/shadcn.png"} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {user?.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline text-sm font-medium text-gray-700">
                      {userData?.email?.split("@")[0]}
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mt-1 p-1 bg-white rounded-lg shadow-lg border border-gray-100 animate-in zoom-in-90 duration-300">
                  <div className="px-2 py-1.5 mb-1">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.email}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role}
                    </p>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-100" />

                  <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-blue-50 transition-colors">
                    <Link
                      href={`/${user?.role.toLocaleLowerCase()}`}
                      className="flex-1"
                    >
                      Dashboard
                    </Link>

                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={`/profile`}>
                      profile
                    </Link>

                  </DropdownMenuItem>

                  <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-blue-50 transition-colors">
                    <Link href={`/profile`} className="flex-1">
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-gray-100" />

                  <DropdownMenuItem
                    className="flex items-center gap-2 p-2 rounded-md cursor-pointer bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                    onClick={handleLogOut}
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <PrimaryButton className="text-sm px-4 py-1.5 rounded-full shadow-sm transition-all duration-300 hover:shadow-md">
                    Sign in
                  </PrimaryButton>
                </Link>
                <Link href="/register" className="hidden sm:block">
                  <SecondaryButton className="text-sm px-4 py-1.5 rounded-full shadow-sm transition-all duration-300 hover:shadow-md">
                    Sign up
                  </SecondaryButton>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="inline-flex md:hidden items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 pt-2 pb-4 border-t border-gray-100 animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col space-y-1">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-2 rounded-lg transition-colors ${pathname === href
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              {!user?.email && (
                <Link
                  href="/register"
                  className="sm:hidden block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </section>
  );
}
