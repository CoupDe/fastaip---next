import NextAuth, { AuthOptions } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import VkProvider from "next-auth/providers/vk";
export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: String(process.env.GITHUB_ID),
      clientSecret: String(process.env.GITHUB_SECRET),
    }),
    VkProvider({
      clientId: String(process.env.VK_CLIENT_ID),
      clientSecret: String(process.env.VK_CLIENT_SECRET),
    }),
  ],

  secret: String(process.env.NEXTAUTH_SECRET),
};
export default NextAuth(authOptions);
