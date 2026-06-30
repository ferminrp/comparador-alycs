"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function AuthButton({ className = "" }: { className?: string }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <span
        className={`inline-block h-9 w-28 animate-pulse rounded-lg bg-zinc-100 ${className}`}
        aria-hidden="true"
      />
    );
  }

  if (session?.user) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {session.user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.user.image}
            alt=""
            className="h-7 w-7 rounded-full"
          />
        ) : null}
        <span className="hidden max-w-[120px] truncate text-sm text-zinc-600 sm:inline">
          {session.user.name}
        </span>
        <button
          type="button"
          onClick={() => signOut()}
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          Salir
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => signIn("twitter")}
      className={`inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-4 w-4 fill-current"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
      Ingresar con X
    </button>
  );
}
