import { Box, Button, Heading} from '@chakra-ui/react'
import { ColorModeProvider } from './components/ui/color-mode'
import { motion } from "framer-motion"

const MotionHeading = motion(Heading)

function App() {
  return (
    <ColorModeProvider forcedTheme="dark">
      <Box minH="100vh" w="100%" position="relative" textAlign="center" mt={0} p={4} bg="backgroundPrimary" color="textPrimary">
        
        <Box position="relative" textAlign="center" w="100%" mt={4} p={4}>
          <MotionHeading mb={4} fontFamily="title" color="textPrimary" 
          animate={{ 
            //y: [0, -8, 0, 8, 0],
            scale: [1, 1.05, 1], 
            color: ["#fff", "#ddd", "#fff"], 
          }} 
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut", 
          }}>Dog Matcher</MotionHeading>
        </Box>

        <Box position="relative" mt={4} p={4}>

          <Box position="relative" w="100%" p={2}>
            <Button bg="backgroundSecondary" color="textPrimary" fontFamily="body">Easy Difficulty</Button>
          </Box>
          <Box position="relative" w="100%" p={2}>
            <Button bg="backgroundSecondaryMedium" color="textPrimary" fontFamily="body">Medium Difficulty</Button>
          </Box>
          <Box position="relative" w="100%" p={2}>
            <Button  bg="backgroundSecondaryDark" color="textPrimary" fontFamily="body">Hard Difficulty</Button>
          </Box>
        
        </Box>

      </Box>
    </ColorModeProvider>
  )
}

export default App
