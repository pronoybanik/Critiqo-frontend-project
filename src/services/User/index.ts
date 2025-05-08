/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const getAllUser = async () => {
    try {
        const accessToken = (await cookies()).get("accessToken")?.value;
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/user`, {
            next: { tags: ["USER"] },
            headers: {
                Authorization: `${accessToken}`,
            }
        })
        const result = await res.json();
        return result;
    } catch (error: any) {
        return Error(error)
    }
};

export const deleteUser = async (id: string) => {
    try {
        const accessToken = (await cookies()).get("accessToken")?.value;

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/user/soft/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `${accessToken}`,
            },
        });

        revalidateTag("USER");

        const result = await res.json();
        return result;
    } catch (error: any) {
        return { success: false, message: "Something went wrong", error };
    }
};


