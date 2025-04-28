
"use client";

import { Box, CssBaseline } from "@mui/material";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: "80vh",
            bgcolor: "background.default",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 2, sm: 4 },
          }}
          className="bg-gray-100"
        >
          {children}
        </Box>
      </body>
    </html>
  );
}
