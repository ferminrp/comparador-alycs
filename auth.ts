import NextAuth from "next-auth";
import Twitter, { type TwitterProfile } from "next-auth/providers/twitter";

type TwitterUserData = TwitterProfile["data"] & {
  public_metrics?: {
    followers_count?: number;
  };
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Twitter({
      clientId: process.env.AUTH_TWITTER_ID,
      clientSecret: process.env.AUTH_TWITTER_SECRET,
      userinfo:
        "https://api.x.com/2/users/me?user.fields=profile_image_url,public_metrics",
      profile({ data }) {
        const user = data as TwitterUserData;
        return {
          id: user.id,
          name: user.name,
          email: user.email ?? null,
          image: user.profile_image_url,
          username: user.username,
          followersCount: user.public_metrics?.followers_count,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        token.followersCount = user.followersCount;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.username = token.username;
        session.user.followersCount = token.followersCount;
      }
      return session;
    },
  },
  trustHost: true,
});
