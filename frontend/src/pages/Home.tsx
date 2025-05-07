export default function Home() {
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            GeoInsights
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Visualize and analyze geographic data with powerful tools and insights.
            Create interactive maps, analyze spatial patterns, and make data-driven decisions.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/maps"
              className="btn btn-primary"
            >
              Get started
            </a>
            <a href="/data" className="text-sm font-semibold leading-6 text-gray-900">
              View data <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 