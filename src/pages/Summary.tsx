import {Box, Button, Heading} from '@chakra-ui/react'
import {motion} from "framer-motion"
import {useNavigate, useSearchParams} from "react-router-dom"

const MotionHeading = motion(Heading)
const MotionButton = motion(Button)

export default function Summary() {

    const navigate = useNavigate()
    
    return <Box minH="100vh" w="100%" position="relative" textAlign="center" mt={0} p={4} bg="backgroundPrimary" color="textPrimary" overflow="hidden">


        <Box position="relative" textAlign="center" w="100%" mt={4} p={4}>
            <MotionHeading mb={4} fontFamily="title" color="textPrimary" fontSize="4xl"
            animate={{
                scale: [1, 1.05, 1], 
                color: ["#fff", "#ddd", "#fff"], 
            }} 
            transition={{ 
                duration: 5, 
                repeat: Infinity, 
                ease: "easeInOut", 
            }}>Summary:</MotionHeading>
        </Box>
        <Box position="relative" w="100%" p={2}>
            <MotionButton bg="backgroundSecondaryDark" color="textPrimary" fontFamily="body"
            onClick={() => navigate("/")}
            animate={{
            scale: [1, 1.03, 1],
            opacity: [1, 0.95, 1],
            }}
            transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            }}
            whileHover={{
            scale: 1.12,
            transition: { duration: 0 },
            }}>Back</MotionButton>
        </Box>

    </Box>
}