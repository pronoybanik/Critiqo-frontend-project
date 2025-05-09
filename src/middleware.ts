

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "./services/AuthService";

type Role = keyof typeof roleBasedPrivateRoutes;

const authRoutes = ["/login", "/register"];

const roleBasedPrivateRoutes = {
    ADMIN: [
        /^\/admin$/,
        /^\/admin\/user$/,
        /^\/admin\/reviews$/,
        /^\/admin\/createcategory$/,
        /^\/profile$/,
    ],
    GUEST: [
        /^\/guest$/,
        /^\/guest\/myreviews$/,
        /^\/guest\/mypurchases$/,
        /^\/profile$/,
    ]
};

export const middleware = async (request: NextRequest) => {
    const { pathname } = request.nextUrl;

    // Get the current user
    const userInfo = await getCurrentUser();

    // Public routes: Allow access without login
    if (!userInfo) {
        if (authRoutes.includes(pathname)) {
            return NextResponse.next();
        } else {
            // Redirect unauthenticated users to login
            return NextResponse.redirect(
                new URL(`/login?redirectPath=${pathname}`, request.url)
            );
        }
    }

    // Role-based access control
    if (userInfo.role && roleBasedPrivateRoutes[userInfo.role as Role]) {
        const allowedRoutes = roleBasedPrivateRoutes[userInfo.role as Role];

        // Check if the route matches any allowed route for the role
        if (allowedRoutes.some((route) => route.test(pathname))) {
            return NextResponse.next();
        }
    }

    // If no match, redirect unauthorized users to a 403 or home page
    return NextResponse.redirect(new URL("/", request.url));
};

// export const config = {
//     matcher: ["/login", "/admin/:path*"],
// };

export const config = {
    matcher: ["/login", "/register", "/admin/:path*", "/guest/:path*", "/guest", "/profile"],
};
