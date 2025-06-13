import { Link } from "react-router-dom";
import { BackButton } from "@/components/ui/BackButton";

export const About = () => {
  return (
    <div className="p-4 pt-8 flex flex-col space-y-8">
      <div className="w-full flex justify-start">
        <BackButton variant="text" />
      </div>
      
      <div className="w-full">
        <h2 className="text-3xl tracking-tight mb-4">About</h2>
        <p className="text-muted-foreground mb-8">
          I am a developer with a multidisciplinary background focused on leveraging data and design to make complex information easier to understand and use.
        </p>
      </div>
      
      <div className="w-full">
        <p className="text-muted-foreground mb-4">
          Originally trained as an <Link to="/work/ir-arquitectura" className="underline decoration-1 underline-offset-4 hover:text-foreground hover:no-underline transition-colors">architect</Link>, I was early on interested in the intersection of design and technology. In an industry that is still very much analogue, I saw the need for technology to help us understand and use data better. This itch led me through my path into software engineering, where I learned to code and build software.
        </p>
        <p className="text-muted-foreground mb-4">
          I joined <Link to="/work/tesla" className="underline decoration-1 underline-offset-4 hover:text-foreground hover:no-underline transition-colors">Tesla</Link> in 2022 to help them digitalize their engineering processes. I developed applications that made complex manufacturing data accessible and actionable, working on automation systems for state-of-the-art processes.
        </p>
        <p className="text-muted-foreground mb-4">
          My latest work woke me up to the importance of data and its role in our lives, and how it can be used to make better decisions, all of which led me to focus on <Link to="/projects" className="underline decoration-1 underline-offset-4 hover:text-foreground hover:no-underline transition-colors">data analytics</Link> and machine learning.
        </p>
        <p className="text-muted-foreground mb-4">
          I am exploring what this unique combination of construction thinking, software development, and data analysis can solve. I find deep satisfaction in building applications that reveal patterns and insights people couldn't see before. I like problems that sit at intersections, where technical complexity meets human needs, where data becomes understanding, where good design makes hard things simple.
        </p>
      </div>
    </div>
  )
}
