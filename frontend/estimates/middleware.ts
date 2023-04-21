import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";
export { default } from "next-auth/middleware";
export const config = { matcher: ["/"] };
