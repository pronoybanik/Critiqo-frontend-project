/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { jwtDecode } from "jwt-decode";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const registerUser = async (userData: FormData) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/user/create-guest`, {
      method: "POST",
      body: userData,
    });

    const result = await res.json();
    return result;
  } catch (error: any) {
    return Error(error);
  }
};



export const loginUser = async (userData: any) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await res.json();

    if (result.success) {
      (await cookies()).set("accessToken", result?.data?.accessToken);
      // (await cookies()).set("refreshToken", result?.data?.refreshToken);
    }

    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const getCurrentUser = async () => {
  const accessToken = (await cookies()).get("accessToken")?.value
  let decodeData = null;

  if (accessToken) {
    decodeData = await jwtDecode(accessToken);
    return decodeData;
  } else {
    return null;
  }
};


export const getMyProfile = async () => {
  try {
    const accessToken = (await cookies()).get("accessToken")?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/user/me`, {
      headers: {
        Authorization: `${accessToken}`,
       
      },
      next: {
        tags: ["Profile"],
      },
    });

    const data = await res.json();
    return data;
  } catch (error: any) {
    return Error(error.message);
  }
};


export const updateProfile = async (formData: FormData) => {
  try {
    const accessToken = (await cookies()).get("accessToken")?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/user/update-my-profile`, {
      method: "PATCH",
      headers: {
        Authorization: `${accessToken}`,
      },
      body: formData,
    })

    revalidateTag("Profile");
    const result = await res.json();
    return result;
  } catch (error: any) {
    return Error(error)
  }
};




export const logout = async () => {
  (await cookies()).delete("accessToken");
};


