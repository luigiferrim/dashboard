export default function LoadingHistorico() {
  return (
    <div className="p-8 space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="h-8 w-64 bg-muted rounded" />

      {/* Filters skeleton */}
      <div className="flex gap-4">
        <div className="h-10 flex-1 bg-muted rounded" />
        <div className="h-10 w-48 bg-muted rounded" />
      </div>

      {/* List skeleton */}
      <div className="space-y-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg border border-border">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-muted rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-3/4 bg-muted rounded" />
                <div className="h-4 w-1/2 bg-muted rounded" />
              </div>
              <div className="h-6 w-20 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
