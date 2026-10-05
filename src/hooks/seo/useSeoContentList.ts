"use client";

import { useEffect, useState } from "react";
import { getSeoContentList } from "@/lib/seo/api";
import type { SeoContentSummary } from "@/types/seo";

export const useSeoContentList = () => {
  const [items, setItems] = useState<SeoContentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getSeoContentList()
      .then((result) => {
        if (!isMounted) return;
        if (result.ok) {
          setItems(result.data);
        } else {
          setError(result.message);
        }
      })
      .catch((reason: unknown) => {
        if (isMounted) {
          setError(
            reason instanceof Error
              ? reason.message
              : "Unable to load SEO content.",
          );
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { items, isLoading, error };
};
