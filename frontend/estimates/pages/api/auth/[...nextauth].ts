import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: String(process.env.GITHUB_ID),
      clientSecret: String(process.env.GITHUB_SECRET),
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    
    signOut: "/test",
  },
});
