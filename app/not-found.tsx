import { FileQuestion } from "lucide-react"
import Link from "next/link"
import { SporgatesLogoText } from "@/components/sporgates/sporgates-logo-text"

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-8">
            <Link href="/" className="inline-flex shrink-0" aria-label="Sporgates home">
                <SporgatesLogoText heightClass="h-8" />
            </Link>
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                <FileQuestion className="h-10 w-10 text-primary" />
            </div>
            <div className="text-center">
                <h1 className="text-4xl font-bold text-foreground">404</h1>
                <p className="mt-1 text-lg font-medium text-foreground">Page Not Found</p>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
            </div>
            <Link
                href="/"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
                Go Home
            </Link>
        </div>
    )
}
