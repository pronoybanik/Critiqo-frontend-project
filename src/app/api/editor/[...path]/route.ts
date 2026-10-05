import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const validSchemaTypes = new Set([
  "Organization",
  "WebSite",
  "Article",
  "Review",
  "Product",
  "FAQPage",
  "BreadcrumbList",
]);

const isAllowedRequest = (
  method: string,
  segments: string[],
  schemaType: string | null,
): boolean => {
  if (
    method === "POST" &&
    segments.length === 3 &&
    segments[0] === "admin" &&
    segments[1] === "seo" &&
    segments[2] === "analyze"
  ) {
    return true;
  }

  if (
    segments[0] === "admin" &&
    segments[1] === "schema" &&
    ["blogPost", "review"].includes(segments[2] ?? "") &&
    Boolean(segments[3])
  ) {
    if (
      method === "GET" &&
      segments.length === 5 &&
      segments[4] === "generate"
    ) {
      return Boolean(schemaType && validSchemaTypes.has(schemaType));
    }
    return method === "PUT" && segments.length === 4;
  }

  if (
    segments[0] === "admin" &&
    segments[1] === "images" &&
    ["blogPost", "review"].includes(segments[2] ?? "") &&
    Boolean(segments[3])
  ) {
    return method === "GET" && segments.length === 4;
  }

  return (
    segments[0] === "admin" &&
    segments[1] === "images" &&
    Boolean(segments[2]) &&
    method === "PATCH" &&
    segments.length === 3
  );
};

const proxy = async (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) => {
  const { path } = await context.params;
  const schemaType = request.nextUrl.searchParams.get("schemaType");
  if (!isAllowedRequest(request.method, path, schemaType)) {
    return NextResponse.json(
      { success: false, message: "Unsupported editor API request." },
      { status: 404 },
    );
  }

  const accessToken = (await cookies()).get("accessToken")?.value;
  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: "Your session has expired. Please sign in again." },
      { status: 401 },
    );
  }

  const apiBase = process.env.NEXT_PUBLIC_BASE_API;
  if (!apiBase) {
    return NextResponse.json(
      { success: false, message: "The API base URL is not configured." },
      { status: 500 },
    );
  }

  const query = request.nextUrl.searchParams.toString();
  const target = `${apiBase}/${path.map(encodeURIComponent).join("/")}${
    query ? `?${query}` : ""
  }`;
  const headers = new Headers({ Authorization: accessToken });
  let body: string | undefined;
  if (request.method !== "GET") {
    headers.set("Content-Type", "application/json");
    body = await request.text();
  }

  const upstream = await fetch(target, {
    method: request.method,
    headers,
    body,
    cache: "no-store",
    signal: request.signal,
  });
  const responseBody = await upstream.text();
  return new Response(responseBody, {
    status: upstream.status,
    headers: {
      "Content-Type":
        upstream.headers.get("Content-Type") ?? "application/json",
      "Cache-Control": "no-store",
    },
  });
};

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
