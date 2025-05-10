/* eslint-disable @typescript-eslint/no-explicit-any */

"use server"
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const createPayment = async (data: any) => {
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

export const getPayment = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/payment/history`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await cookies()).get("accessToken")?.value || "",
    },
  });
  revalidateTag("PAYMENT");
  return res.json();
};

export const getTotalEarning = async () => {

  try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/payment/total-earning`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              Authorization: (await cookies()).get("accessToken")?.value || "",

          },
      },

      );
     
      return res.json();

  } catch (error: any) {
      return Error(error.message);
  }

};




