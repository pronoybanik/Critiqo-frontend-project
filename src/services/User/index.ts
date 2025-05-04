
"use server"

import { cookies } from "next/headers";

export const getAllUser = async () => {
    try {
        const accessToken = (await cookies()).get("accessToken")?.value;

        console.log("acces", accessToken);
        

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/user`, {
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