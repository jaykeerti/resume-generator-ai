export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Header Skeleton */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="h-8 w-48 animate-pulse bg-zinc-200 dark:bg-zinc-700 rounded"></div>
            <div className="h-10 w-10 animate-pulse bg-zinc-200 dark:bg-zinc-700 rounded-full"></div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Tier Status Skeleton */}
        <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="h-6 w-32 animate-pulse bg-zinc-200 dark:bg-zinc-700 rounded mb-2"></div>
          <div className="h-4 w-48 animate-pulse bg-zinc-200 dark:bg-zinc-700 rounded"></div>
        </div>

        {/* CTA Buttons Skeleton */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="h-16 animate-pulse bg-zinc-200 dark:bg-zinc-700 rounded-lg"></div>
          <div className="h-16 animate-pulse bg-zinc-200 dark:bg-zinc-700 rounded-lg"></div>
        </div>

        {/* Resumes List Skeleton */}
        <div>
          <div className="h-6 w-32 animate-pulse bg-zinc-200 dark:bg-zinc-700 rounded mb-4"></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="h-6 w-3/4 animate-pulse bg-zinc-200 dark:bg-zinc-700 rounded mb-2"></div>
                <div className="h-4 w-1/2 animate-pulse bg-zinc-200 dark:bg-zinc-700 rounded mb-4"></div>
                <div className="flex gap-2">
                  <div className="flex-1 h-10 animate-pulse bg-zinc-200 dark:bg-zinc-700 rounded-lg"></div>
                  <div className="flex-1 h-10 animate-pulse bg-zinc-200 dark:bg-zinc-700 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
