export default function LoadingFinanceiro() {
  return (
    <div className="p-8 space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="h-8 w-64 bg-muted rounded" />

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg border border-border space-y-3">
            <div className="h-5 w-32 bg-muted rounded" />
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="h-4 w-24 bg-muted rounded" />
          </div>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-border">
          <div className="h-64 bg-muted rounded" />
        </div>
        <div className="bg-white p-6 rounded-lg border border-border">
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    </div>
  )
}
