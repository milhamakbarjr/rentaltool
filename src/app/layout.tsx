import type { Metadata, Viewport } from "next";
import { RouteProvider } from "@/providers/router-provider";
import { Theme } from "@/providers/theme";
import { Providers } from "@/components/providers";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { getUserLocale } from '@/i18n/locale';
import { Toaster } from 'sonner';
import "@/styles/globals.css";
import { cx } from "@/utils/cx";

export const metadata: Metadata = {
    title: "RentalTool — Rental Management System",
    description: "Mobile-first rental management system for tracking rentals, customers, and inventory",
};

export const viewport: Viewport = {
    themeColor: "#7f56d9",
    colorScheme: "light dark",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const locale = await getUserLocale();
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={cx("font-sans bg-primary antialiased")}>
                <NextIntlClientProvider messages={messages} locale={locale}>
                    <Providers>
                        <RouteProvider>
                            <Theme>{children}</Theme>
                        </RouteProvider>
                    </Providers>
                    <Toaster position="top-right" />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
