import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    provider?: string;
  }

  interface Session {
    user: {
      id: string;
      provider?: string;
    } & DefaultSession["user"];
  }
}
