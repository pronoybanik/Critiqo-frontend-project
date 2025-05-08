/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"
import { cookies } from "next/headers";


export const VoteSubmit = async (data: any) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/votes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: (await cookies()).get("accessToken")?.value || "",
        },
        body: JSON.stringify(data),
    });
    return res.json();
};