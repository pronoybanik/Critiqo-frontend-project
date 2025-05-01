"use client";
import openion1 from "../../assets/logo/opinion7.png";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,

    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { logout } from "@/services/AuthService";
// import { useUser } from "@/context/UserContext";
import { usePathname, useRouter } from "next/navigation";

import Image from "next/image";
import { protectedRoutes } from "@/app/contants";

export default function Navbar() {
    // const { user, setIsLoading } = useUser();
    const pathname = usePathname();
    const router = useRouter();
    // console.log(user)

    const handleLogOut = () => {
        // logout();
        // setIsLoading(true);
        if (protectedRoutes.some((route) => pathname.match(route))) {
            router.push("/");
        }
    };


    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/reviews", label: "All Reviews" },
        { href: "/about", label: "About Us" },
        { href: "/contactus", label: "Contact" },
        { href: "/blog", label: "Blog" },
        { href: "/login", label: "login" },
        { href: "/register", label: "register" },

    ];
    const user = {
        email: 'samratuap52@gmail.com',
        role: 'Admin'
    }
    return (
        <header className="border-b bg-[#d7d7d7]  w-full sticky top-0 z-10">
            <div className="container   flex justify-between items-center mx-auto h-16 px-5">
                <Link href="/">
                    <h1 className="text-2xl py-4 font-black flex items-center">

                        <Image
                            src={openion1}
                            alt="etutor"
                            width={180}
                            height={42}
                            className="py-2"
                        />


                    </h1>
                </Link>
                <div className="hidden md:flex space-x-6">
                    {navLinks.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`${pathname === href
                                ? "text-[#C24340] font-bold"
                                : "text-gray-700 hover:text-6eal-700"
                                }`}
                        >
                            {label}
                        </Link>
                    ))}

                </div>
                <nav className="flex gap-2">



                    {user?.email ? (
                        <>

                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>User</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem>
                                        <Link href={`/${user?.role}/dashboard`}>Dashboard</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>

                                        <div className=" md:hidden ">
                                            {navLinks.map(({ href, label }) => (
                                                <DropdownMenuItem key={href}>

                                                    <Link

                                                        href={href}
                                                        className={`${pathname === href
                                                            ? "text-[#139460] font-bold"
                                                            : "text-gray-700 hover:text-6eal-700"
                                                            }`}
                                                    >
                                                        {label}
                                                    </Link>
                                                </DropdownMenuItem>
                                            ))}

                                        </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="bg-[#139460] cursor-pointer"
                                        onClick={handleLogOut}
                                    >
                                        <LogOut />
                                        <span>Log Out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <Link href="/login">
                            <Button className="rounded-full" variant="outline">
                                Login
                            </Button>
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}