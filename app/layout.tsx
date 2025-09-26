import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

const roboto = Roboto({
    subsets: ["latin"],
    weight: ["400", "500", "700"],
    variable: "--font-roboto",
    display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
    title: "NoteHub",
    description: "Your personal space for notes",
    metadataBase: new URL(siteUrl),
    openGraph: {
        title: "NoteHub",
        description: "Your personal space for notes",
        url: siteUrl,
        images: ["/notehub-og-meta.webp"],
        siteName: "NoteHub",
        type: "website",
    },
};

export default function RootLayout({
    children,
    modal,
}: Readonly<{
    children: React.ReactNode;
    modal: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={roboto.variable}>
                <TanStackProvider>
                    {/* 2. Оборачиваем всё в AuthProvider */}
                    <AuthProvider>
                        <Header />
                        <main style={{ flex: 1 }}>{children}</main>
                        {modal}
                        <Footer />
                    </AuthProvider>
                </TanStackProvider>
            </body>
        </html>
    );
}
