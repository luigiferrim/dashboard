export default function LoadingConfiguracoes() {
  return (
    <div className="p-8 space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="h-10 w-80 bg-muted rounded" />

      {/* Profile section skeleton */}
      <div className="bg-white p-8 rounded-lg border border-border space-y-6">
        <div className="h-7 w-32 bg-muted rounded" />
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="h-5 w-16 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-5 w-16 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
          </div>
        </div>
      </div>

      {/* Password section skeleton */}
      <div className="bg-white p-8 rounded-lg border border-border space-y-6">
        <div className="h-7 w-40 bg-muted rounded" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-5 w-32 bg-muted rounded" />
              <div className="h-10 bg-muted rounded" />
            </div>
          ))}
        </div>
        <div className="h-10 w-48 bg-muted rounded" />
      </div>
    </div>
  )
}
