import {Box, Heading, Input, Image, Button} from '@chakra-ui/react'
import {useEffect, useState} from "react"
import {motion} from "framer-motion"
import {useNavigate, useSearchParams} from "react-router-dom"

const MotionHeading = motion(Heading)
const MotionButton = motion(Button)

export default function Play() {
  const [params] = useSearchParams() 
  const difficulty = params.get("difficulty") || "unknown"
  const [currentIndex, setCurrentIndex] = useState(0)

  const [images, setImages] = useState<string[]>([])
  const navigate = useNavigate()
  
  useEffect(() => { 
    fetch("https://dog.ceo/api/breeds/image/random/5") 
      .then(res => res.json()) 
      .then(data => setImages(data.message)) 
  }, [])

  const [timeLeft, setTimeLeft] = useState(10)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCurrentIndex(i => {
            const next = i + 1
            if (next < images.length) {
              return next
            } else {
              navigate("/summary?difficulty=easy")
              return i 
            }
          })

          return 10
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [images, navigate])



  return <Box minH="100vh" w="100%" position="relative" textAlign="center" p={4} bg="backgroundPrimary" color="textPrimary" overflow="hidden">
    <Box position="relative" textAlign="center" w="100%" p={4}>
      <MotionHeading mb={4} fontFamily="title" color="textPrimary" fontSize="2xl"
      animate={{
        scale: [1, 1.05, 1], 
        color: ["#fff", "#ddd", "#fff"], 
      }} 
      transition={{ 
        duration: 1, 
        repeat: Infinity, 
        ease: "easeInOut", 
      }}>Time Left: {timeLeft}s</MotionHeading>
    </Box>
    
    <Box position="relative" textAlign="center" w="100%" p={4}>
      <Image src={images[currentIndex]} boxSize="300px" objectFit="cover" borderRadius="md" mx="auto"/>

      <Box position="relative" textAlign="center" w="100%" p={4}>
        <MotionHeading mb={4} fontFamily="title" color="textPrimary" fontSize="2xl"
        animate={{
          y: [0, -2, 0],
          color: ["#fff", "#ddd", "#fff"], 
        }} 
        transition={{ 
          duration: 1, 
          repeat: Infinity, 
          ease: "easeInOut", 
        }}>G_RM_N S_E_HE_D</MotionHeading>
      </Box>
    
      <Box display="flex" justifyContent="center" alignItems="center" gap={4} mt={4}>
        <Input placeholder="Enter dog breed name" variant="subtle" w="40%"/>
        <MotionButton bg="backgroundSecondaryDark" color="textPrimary" fontFamily="body"
        onClick={() => navigate("/summary")}
        whileHover={{
        scale: 1.12,
        transition: { duration: 0 },
        }}>Submit</MotionButton>
      </Box>

    </Box>
      
  </Box>
}
