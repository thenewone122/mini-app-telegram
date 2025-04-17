"use client"

import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { MobileNavigation } from "@/components/homgepage/mobile-navigation"
import { Loading } from "@/components/loading/loading"

export default function LoadingDemoPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [overlayLoading, setOverlayLoading] = useState(false)

  const simulateLoading = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  const simulateOverlayLoading = () => {
    setOverlayLoading(true)
    setTimeout(() => {
      setOverlayLoading(false)
    }, 3000)
  }

  return (
    <main className="flex min-h-screen flex-col pb-16 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-foreground">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Back</span>
            </Link>
            <h1 className="text-lg font-bold">Loading Components</h1>
            <div className="w-5"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="container py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Spinner Loaders */}
          <Card>
            <CardHeader>
              <CardTitle>Spinner Loaders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-6 justify-around">
                <Loading type="spinner" size="sm" text="Small" />
                <Loading type="spinner" size="md" text="Medium" />
                <Loading type="spinner" size="lg" text="Large" />
                <Loading type="spinner" size="xl" text="Extra Large" />
              </div>
              <Button onClick={simulateLoading} className="w-full">
                Show Fullscreen Spinner (3s)
              </Button>
            </CardContent>
          </Card>

          {/* Chess Piece Loaders */}
          <Card>
            <CardHeader>
              <CardTitle>Chess Piece Loaders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-6 justify-around">
                <Loading type="pieces" size="sm" text="Small" />
                <Loading type="pieces" size="md" text="Medium" />
                <Loading type="pieces" size="lg" text="Large" />
              </div>
              <Button onClick={simulateOverlayLoading} className="w-full">
                Show Overlay Loader (3s)
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Board Loader */}
        <Card>
          <CardHeader>
            <CardTitle>Chess Board Loader</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6 justify-around">
              <Loading type="board" size="sm" text="Small Board" />
              <Loading type="board" size="md" text="Medium Board" />
              <Loading type="board" size="lg" text="Large Board" />
            </div>
          </CardContent>
        </Card>

        {/* Minimal Loader */}
        <Card>
          <CardHeader>
            <CardTitle>Minimal Loader</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6 justify-around">
              <Loading type="minimal" text="Loading data..." />
            </div>
          </CardContent>
        </Card>

        {/* Usage Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Examples</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Card className="bg-secondary/50">
                <CardContent className="h-40 flex items-center justify-center">
                  <p className="text-muted-foreground">Card content with overlay loader</p>
                </CardContent>
              </Card>
              {overlayLoading && <Loading type="pieces" overlay />}
            </div>

            <div className="text-sm space-y-2">
              <p className="font-medium">Import and use in your components:</p>
              <pre className="bg-secondary p-3 rounded-md overflow-x-auto">
                <code>{`import { Loading } from "@/components/loading"

// Basic usage
<Loading />

// With options
<Loading 
  type="spinner" // "spinner" | "pieces" | "board" | "minimal"
  size="md" // "sm" | "md" | "lg" | "xl"
  text="Loading games..." 
/>

// Fullscreen overlay
<Loading fullScreen />

// Component overlay
<div className="relative">
  <YourComponent />
  {isLoading && <Loading overlay />}
</div>`}</code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoading && <Loading fullScreen text="Loading..." />}

      <MobileNavigation />
    </main>
  )
}
