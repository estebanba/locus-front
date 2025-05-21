

export const Home = () => {
  return (
    <div className="flex flex-col lg:flex-row flex-1">
          {/* Main content */}
          <div className="flex-1 p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
            <div className="mt-4 min-h-[50vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
          </div>
          

    </div>
  )
}
