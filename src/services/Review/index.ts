

"use server"

import { Comment } from "@/types/review";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

//get all review


export const featuredReview = async (page?: string, limit?: string,) => {
  console.log(page, limit)
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/reviews/featured?page=${page}&limit=${limit}`,
      {
        next: {
          tags: ["REVIEW"],
        },
      }
    );
    const data = await res.json();
    return data;
  } catch (error: any) {
    return Error(error.message);
  }
};

export const getSingleReviewById = async (reviewId: string) => {
  console.log("review", reviewId)
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/reviews/${reviewId}`,
      {
        next: {
          tags: ["REVIEW"],
        },
      }
    );
    const data = await res.json();
    console.log(data)
    return data;
  } catch (error: any) {
    return Error(error.message);
  }
};
export const deleteReview = async (reviewId: string): Promise<any> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/reviews/${reviewId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    );
    revalidateTag("REVIEW");
    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

export const addComment = async (data: Partial<Comment>) => {
  console.log("with data:", data);

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await cookies()).get("accessToken")?.value || "",
    },
    body: JSON.stringify(data),
  });
  revalidateTag("REVIEW");
  return res.json();
};

export const addVotes = async (data: any) => {
  console.log("with data 76:", data);

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/votes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await cookies()).get("accessToken")?.value || "",
    },
    body: JSON.stringify(data),
  });
  revalidateTag("REVIEW");
  return res.json();
};

export const createReview = async (data: any) => {
  console.log("with data 76:", data);

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await cookies()).get("accessToken")?.value || "",
    },
    body: JSON.stringify(data),
  });
  revalidateTag("REVIEW");
  return res.json();
};

export const getAllReviewAdmin = async () => {
  try {
    const accessToken = (await cookies()).get("accessToken")?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/admin/reviews`, {
      headers: {
        Authorization: `${accessToken}`,
      },
      next: {
        tags: ["REVIEW"],
      },
    });

    const data = await res.json();
    return data;
  } catch (error: any) {
    return Error(error.message);
  }
};