import abstract_logo from '../assets/abstract_logo.svg'
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

export const Start = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      {/* Clickable logo with animation */}
      <motion.div 
        className="w-64 h-64 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/home')}
      >
        <img 
          src={abstract_logo} 
          alt="Abstract Logo" 
          className="w-full h-full object-contain"
        />
      </motion.div>
      
      {/* Clickable title */}
      <Button 
        variant="ghost" 
        className="text-4xl font-bold hover:bg-transparent"
        onClick={() => navigate('/home')}
      >
        Esteban Basili
      </Button>
      
      {/* Clickable subtitle */}
      <Button 
        variant="ghost" 
        className="text-xl text-muted-foreground hover:bg-transparent"
        onClick={() => navigate('/home')}
      >
        Welcome to my site
      </Button>

      {/* Enter button */}
      <Button 
        className="mt-8"
        onClick={() => navigate('/home')}
      >
        Enter
      </Button>
    </div>
  )
}
