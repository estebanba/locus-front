import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// Define the paths for both states
const paths = {
  hamburger: [
    "M4 6h16", // Top line
    "M4 12h16", // Middle line
    "M4 18h16", // Bottom line
  ],
  logo: [
    "M4 12L12 4L20 12", // Top V shape
    "M4 12L12 20L20 12", // Bottom V shape
    "M12 4L12 20", // Center vertical line
  ],
}

export function AnimatedMenuLogo({
  isOpen,
  className,
  onClick,
  ...props
}: React.ComponentProps<"div"> & {
  isOpen: boolean
  onClick?: () => void
}) {
  return (
    <div 
      className={cn("relative h-6 w-6 cursor-pointer", className)} 
      onClick={onClick}
      {...props}
    >
      <motion.svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute inset-0"
      >
        {/* Top line */}
        <motion.path
          initial={{ d: paths.hamburger[0] }}
          animate={{ 
            d: isOpen ? paths.logo[0] : paths.hamburger[0],
            transition: { duration: 0.4, ease: "easeInOut" }
          }}
        />
        {/* Middle line */}
        <motion.path
          initial={{ d: paths.hamburger[1] }}
          animate={{ 
            d: isOpen ? paths.logo[2] : paths.hamburger[1],
            opacity: 1,
            transition: { duration: 0.4, ease: "easeInOut" }
          }}
        />
        {/* Bottom line */}
        <motion.path
          initial={{ d: paths.hamburger[2] }}
          animate={{ 
            d: isOpen ? paths.logo[1] : paths.hamburger[2],
            transition: { duration: 0.4, ease: "easeInOut" }
          }}
        />
      </motion.svg>
    </div>
  )
} 