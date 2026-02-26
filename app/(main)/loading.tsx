/** Route-level loading: use skeleton to match list pages and avoid spinner + page skeleton double-loading. */
export default function MainLoading() {
    return (
        <div className="space-y-6 pb-20 lg:pb-0">
            <div className="h-8 w-48 rounded bg-muted animate-pulse" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card">
                        <div className="h-40 bg-muted animate-pulse" />
                        <div className="space-y-3 p-4">
                            <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                            <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
                            <div className="h-3 w-2/3 rounded bg-muted animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
