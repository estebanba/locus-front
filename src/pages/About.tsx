export const About = () => {
  return (
    <div className="container mx-auto p-4 pt-8 flex flex-col items-end space-y-8">
      {/* Text Content Block - Styled like Work page */}
      <div className="w-full max-w-2xl"> 
        {/* Updated H1 styling */}
        <h2 className="text-3xl tracking-tight mb-4">Esteban Basili</h2>
        {/* Updated P styling */}
        <p className="text-lg text-muted-foreground mb-4">
          I am a developer with a multidisciplinary background focused on leveraging data and design to make complex information easier to understand and use.
        </p>
        <p className="text-lg text-muted-foreground mb-4">
          Originally trained as an architect, I was early on interested in the intersection of design and technology.
        </p>
        <p className="text-lg text-muted-foreground mb-4">
          In an industry that is still very much analog, I saw the need for technology to help us understand and use data better.
        </p>
        <p className="text-lg text-muted-foreground mb-4">
          I joined Tesla in 2022, where I worked on the development of engineering applications.
        </p>
        <p className="text-lg text-muted-foreground mb-4">
          My latest work woke me up to the importance of data and its role in our lives, and how it can be used to make better decisions, all of which took me into the world of data analytics and data science
        </p>
      </div>
      {/* Removed placeholder div and grid structure */} 
      
      {/* Commented-out sidebar remains untouched */}
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
