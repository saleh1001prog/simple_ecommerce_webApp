import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Layout from "@/components/layout";
import Cart from "@/components/Cart";



export const metadata: Metadata = {
  title: "saleh dz",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <Layout>
        <Header/>
        <hr/>
        <Cart/>
        {children}
        <Footer/>
        </Layout>
      </body>
    </html>
  );
}
