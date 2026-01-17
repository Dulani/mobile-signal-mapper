import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { AppLogo } from '@/components/app-logo';
import { BarChart, MapPin, Info } from 'lucide-react';
import Link from 'next/link';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { AuthButton } from '@/components/auth-button';
import { DebugAuth } from '@/components/debug-auth';
import { APP_VERSION } from '@/lib/version';

export const metadata: Metadata = {
  title: 'SignalMapper',
  description: 'Map and analyze cell signal strength anywhere.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#1F1A24" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin=""/>
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <SidebarProvider>
            <Sidebar>
              <SidebarHeader>
                <AppLogo />
              </SidebarHeader>
              <SidebarContent>
                  <SidebarMenu>
                      <SidebarMenuItem>
                          <SidebarMenuButton asChild>
                              <Link href="/">
                                  <MapPin />
                                  Log Signal
                              </Link>
                          </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                          <SidebarMenuButton asChild>
                              <Link href="/dashboard">
                                  <BarChart />
                                  Heatmap
                              </Link>
                          </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                          <SidebarMenuButton asChild>
                              <Link href="/about">
                                  <Info />
                                  About
                              </Link>
                          </SidebarMenuButton>
                      </SidebarMenuItem>
                  </SidebarMenu>
              </SidebarContent>
            </Sidebar>
            <SidebarInset>
              <header className="flex h-14 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <SidebarTrigger className="md:hidden" />
                  <div className="flex-1">
                      <h1 title={`Version: ${APP_VERSION}`} className="text-lg font-semibold md:text-xl font-headline cursor-help w-fit">SignalMapper</h1>
                  </div>
                  <AuthButton />
              </header>
              <main className="flex-1 overflow-auto">{children}</main>
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
          <DebugAuth />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
