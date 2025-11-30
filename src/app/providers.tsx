"use client";

import { SocketProvider } from "@/providers/socket-provider";
import { QueryProvider } from "@/providers/query-provider";
import { SessionProvider } from "next-auth/react";
import React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <SocketProvider>
          {children}
        </SocketProvider>
      </QueryProvider>
    </SessionProvider>
  );
}