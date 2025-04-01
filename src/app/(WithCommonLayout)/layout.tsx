'use client'
// import type { Metadata } from "next";
// import { Inter } from 'next/font/google';
import "../globals.css";
// import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
// import Providers from '@/lib/Providers/Providers';

import { Toaster } from "sonner";
import { useSession } from "next-auth/react";
import Loading from "../loading";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Smart Notice Board",
//   description: "Smart Notice Board",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


   const { data: session, status } = useSession();

   
     if (status === "loading") return <Loading></Loading>;
     if (!session) return <p>Access Denied</p>;
  return (
    <div>
      
      <Toaster position="top-center" />
      {children}
    </div>
  );
}
