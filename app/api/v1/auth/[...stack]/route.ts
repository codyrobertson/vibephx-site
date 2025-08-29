import { stackServerApp } from "@/stack";

// Stack Auth v1 API Route Handler
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Handle Stack Auth GET requests
  return new Response(JSON.stringify({ message: "Stack Auth GET handler" }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}

export async function POST(request: NextRequest) {
  // Handle Stack Auth POST requests  
  return new Response(JSON.stringify({ message: "Stack Auth POST handler" }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}