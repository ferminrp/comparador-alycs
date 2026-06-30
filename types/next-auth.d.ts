import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username?: string;
      followersCount?: number;
    } & DefaultSession["user"];
  }

  interface User {
    username?: string;
    followersCount?: number;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    username?: string;
    followersCount?: number;
  }
}

declare module "@auth/core/types" {
  interface Session {
    user: {
      id: string;
      username?: string;
      followersCount?: number;
    } & DefaultSession["user"];
  }

  interface User {
    username?: string;
    followersCount?: number;
  }
}
