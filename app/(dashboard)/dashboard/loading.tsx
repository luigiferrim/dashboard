export default function LoadingDashboard() {
  return (
    <div className="p-8 space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div>
        <div className="h-8 w-48 bg-muted rounded mb-2" />
        <div className="h-5 w-96 bg-muted rounded" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg border border-border space-y-3">
            <div className="h-5 w-32 bg-muted rounded" />
            <div className="h-8 w-24 bg-muted rounded" />
            <div className="h-4 w-20 bg-muted rounded" />
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
