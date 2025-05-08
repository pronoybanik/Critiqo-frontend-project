
"use server"
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const createPayment = async (data: any) => {
  console.log("payment index", data)
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await cookies()).get("accessToken")?.value || "",
    },
    body: JSON.stringify(data),
  });
  revalidateTag("PAYMENT");
  return res.json();
};