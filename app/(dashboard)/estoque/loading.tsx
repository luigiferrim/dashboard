export default function LoadingEstoque() {
  return (
    <div className="p-8 space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-64 bg-muted rounded" />
        <div className="h-10 w-40 bg-muted rounded" />
      </div>

      {/* Search skeleton */}
      <div className="h-10 w-96 bg-muted rounded" />

      {/* Table skeleton */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-6 flex-1 bg-muted rounded" />
              <div className="h-6 w-24 bg-muted rounded" />
              <div className="h-6 w-32 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
