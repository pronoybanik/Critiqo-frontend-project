/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const getAllReviewAdmin = async () => {
    try {
        const accessToken = (await cookies()).get("accessToken")?.value;

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/admin/reviews`, {
            headers: {
                Authorization: `${accessToken}`,
            },
            next: {
                tags: ["ADMINREVIEW"],
            },
        });

        const data = await res.json();
        return data;
    } catch (error: any) {
        return Error(error.message);
    }
};

export const getAllUserReviews = async (id: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/reviews/user/${id}`, {
            next: {
                tags: ["USERREVIEW"],
            },
        });

        const data = await res.json();
        return data;
    } catch (error: any) {
        return Error(error.message);
    }
};

export const reviewUpdateByAdmin = async (id: string, data: any) => {
    try {
        const accessToken = (await cookies()).get("accessToken")?.value;

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/admin/reviews/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: accessToken!,
            },
            body: JSON.stringify(data),
        });

        const result = await res.json();

        revalidateTag("ADMINREVIEW");
        revalidateTag("USERREVIEW");

        return result;
    } catch (error: any) {
        return Error(error.message);
    }
};

export const deleteReview = async (reviewId: string): Promise<any> => {
    try {
        const accessToken = (await cookies()).get("accessToken")?.value;

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/reviews/${reviewId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: accessToken!,
                },
            }
        );

        const result = await res.json();

        revalidateTag("REVIEW");

        return result;
    } catch (error: any) {
        return Error(error.message);
    }
};


