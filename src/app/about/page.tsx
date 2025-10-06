import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, BarChart, Wifi } from 'lucide-react';
import { AppLogo } from '@/components/app-logo';
import { placeholderImages } from '@/lib/placeholder-images.json';

const heroImage = placeholderImages[0];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center">
            <AppLogo />
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative h-[60vh] min-h-[500px] w-full">
            <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/10 to-transparent" />
            <div className="relative container h-full flex flex-col items-start justify-end pb-16 text-left">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl font-headline">
                Map Your World's Signal
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-foreground/80">
                Log cell signal strength anywhere you go. Visualize data on a heatmap, discover coverage patterns, and plan your routes for optimal connectivity.
                </p>
                <Button size="lg" className="mt-6" asChild>
                <Link href="/">Start Mapping Now</Link>
                </Button>
            </div>
        </section>

        <section id="features" className="container py-16 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight font-headline">
              Powerful Features for Seamless Connectivity
            </h2>
            <p className="mt-4 text-lg text-foreground/70">
              From simple data entry to insightful visualizations, SignalMapper has you covered.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary text-primary-foreground">
                  <MapPin className="h-6 w-6" />
                </div>
                <CardTitle className="pt-4 font-headline">Simple Data Logging</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Easily log signal strength with a single tap. We automatically capture your precise location, time, and network details.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary text-primary-foreground">
                  <BarChart className="h-6 w-6" />
                </div>
                <CardTitle className="pt-4 font-headline">Heatmap Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  See your signal data come to life on a heatmap. Green for strong, red for weak—instantly spot coverage hotspots and dead zones.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary text-primary-foreground">
                    <Wifi className="h-6 w-6" />
                </div>
                <CardTitle className="pt-4 font-headline">Route Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                    Record your travel routes to analyze signal consistency and find the most reliable path for staying connected on the go.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col items-center justify-center gap-4 py-8 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <AppLogo />
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built with Next.js and Firebase.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
