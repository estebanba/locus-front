

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
          
          {/* Right sidebar - matches left sidebar width */}
          {/* <div className="w-full lg:w-64 p-4">
            <div className="rounded-xl bg-muted/0 h-full">
              <h3 className="font-semibold mb-4 ">Info</h3>
              <div className="space-y-4">
                <div className="h-20 rounded-lg bg-muted/50" />
                <div className="h-20 rounded-lg bg-muted/50" />
                <div className="h-20 rounded-lg bg-muted/50" />
              </div>
            </div>
          </div> */}
    </div>
  )
}
