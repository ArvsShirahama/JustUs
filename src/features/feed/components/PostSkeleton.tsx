export function PostSkeleton() {
  return (
    <div className="border-b border-[hsl(var(--border))] pb-4 mb-4 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="h-8 w-8 rounded-full bg-[hsl(var(--muted))]" />
        <div className="h-4 w-24 rounded bg-[hsl(var(--muted))]" />
      </div>

      {/* Media skeleton */}
      <div className="aspect-square bg-[hsl(var(--muted))]" />

      {/* Actions skeleton */}
      <div className="flex items-center gap-4 px-4 pt-3">
        <div className="h-6 w-6 rounded bg-[hsl(var(--muted))]" />
        <div className="h-6 w-6 rounded bg-[hsl(var(--muted))]" />
      </div>

      {/* Text skeleton */}
      <div className="px-4 pt-2 space-y-2">
        <div className="h-4 w-32 rounded bg-[hsl(var(--muted))]" />
        <div className="h-4 w-48 rounded bg-[hsl(var(--muted))]" />
      </div>
    </div>
  )
}
