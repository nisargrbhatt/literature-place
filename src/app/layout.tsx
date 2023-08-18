import AuthContextProvider from "@/context/AuthContext";
import "./globals.css";
import type { Metadata } from "next";
import ThemeContextProvider from "@/context/ThemeContext";
import Layout from "@/components/Layout/Layout";

export const metadata: Metadata = {
  title: "Literature Place",
  description: "Literature Place is place for ",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <head>
      <link
        href="logo_light.png"
        rel="icon"
        media="(prefers-color-scheme: light)"
      />
      <link
        href="logo_dark.png"
        rel="icon"
        media="(prefers-color-scheme: dark)"
      />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet"
      />
    </head>
    <body>
      <ThemeContextProvider>
        <AuthContextProvider>
          <Layout>{children}</Layout>
        </AuthContextProvider>
      </ThemeContextProvider>
    </body>
  </html>
);

export default RootLayout;
