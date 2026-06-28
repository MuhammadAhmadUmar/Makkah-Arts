import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return;
  }
  return updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};
