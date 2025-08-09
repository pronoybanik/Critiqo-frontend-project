/* eslint-disable @typescript-eslint/no-explicit-any */

"use server"

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";



//get all review
export const getAllReview = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/reviews`,
      {
        cache: 'force-cache',
        next: {
          revalidate: 120,
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


// export const getAllReview = async (page?: string, limit?: string, query?: { [key: string]: string | string[] | undefined }) => {
//   try {
//     const params = new URLSearchParams();
//     if (query?.price) {
//       params.append("minPrice", "0")
//       params.append("maxPrice", query?.price.toString())
//     }
//     if (query?.brand) {
//       params.append("brands", query?.brand.toString())
//     }
//     if (query?.category) {
//       params.append("categories", query?.category.toString())
//     }
//     // if (query?.search) {
//     //   params.append("ratings", query?.rating.toString())
//     // }
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_API}/reviews`,
//       {
//         next: {
//           tags: ["REVIEW"],
//         },
//       }
//     );
//     const data = await res.json();
//     return data;
//   } catch (error: any) {
//     return Error(error.message);
//   }
// };

export const featuredReview = async (page?: string, limit?: string,) => {
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
    return data;
  } catch (error: any) {
    return Error(error.message);
  }
};


export const addComment = async (data: Partial<Comment>) => {
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

export const updateReview = async (data: any, id: string) => {

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/reviews/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await cookies()).get("accessToken")?.value || "",
    },
    body: JSON.stringify(data),
  });
  revalidateTag("REVIEW");
  return res.json();

};


export const replyComment = async (data: any) => {

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

export const deleteComment = async (replyId: string): Promise<any> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/comments/${replyId}`,
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



