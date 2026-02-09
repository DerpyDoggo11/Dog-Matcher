import {Box, Button, Heading, HStack, Image, Slider} from '@chakra-ui/react'
import {motion} from "framer-motion"
import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"

const MotionHeading = motion(Heading)
const MotionButton = motion(Button)


export default function Home() {
    const [images, setImages] = useState<string[]>([]);
    const [imageCount, setImageCount] = useState(5);
    
    useEffect(() => { 
      fetch("https://dog.ceo/api/breeds/image/random/6") 
        .then(res => res.json())
        .then(data => setImages(data.message)) 
    }, []);

    const navigate = useNavigate();

    const handleNavigate = (difficulty: string) => {
      navigate(`/play?difficulty=${difficulty}&imageCount=${imageCount}`)
    }

    return <Box minH="100vh" w="100%" position="relative" textAlign="center" mt={0} p={4} bg="backgroundPrimary" color="textPrimary" overflow="hidden">
          
      <Box position="absolute" top={0} left={0} w="100%" h="100%" display="flex" justifyContent="space-between" pointerEvents="none" zIndex={0} p={4}>

        <Box display="flex" flexDirection="column" gap={4}>
          {images.slice(0, 3).map((src, i) => (
            <Image key={i} src={src} boxSize="150px" objectFit="cover" borderRadius="md" opacity={0.25} />
          ))}
        </Box>
        <Box display="flex" flexDirection="column" gap={4}>
          {images.slice(3, 6).map((src, i) => (
            <Image key={i} src={src} boxSize="150px" objectFit="cover" borderRadius="md" opacity={0.25} />
            ))}
        </Box>
      </Box>



      <Box position="relative" textAlign="center" w="100%" mt={4} p={4}>
        <MotionHeading mb={4} fontFamily="title" color="textPrimary" fontSize="4xl"
        animate={{
          scale: [1, 1.05, 1], 
          color: ["#fff", "#ddd", "#fff"], 
        }} 
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut", 
        }}>Dog Matcher</MotionHeading>
      </Box>

      <Box position="relative" mt={4} p={4} display="flex" flexDirection="column" alignItems="center">
        <Box position="relative" mt={4} p={4}>

          <Box position="relative" w="100%" p={2} >
            <MotionButton bg="backgroundSecondary" color="textPrimary" fontFamily="body"
            onClick={() => handleNavigate("easy")}
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
            }}>Easy Difficulty</MotionButton>
          </Box>

          <Box position="relative" w="100%" p={2}>
            <MotionButton bg="backgroundSecondaryMedium" color="textPrimary" fontFamily="body"
            onClick={() => handleNavigate("medium")}
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
              transition: { duration: 0},
            }}>Medium Difficulty</MotionButton>
          </Box>

          <Box position="relative" w="100%" p={2}>
            <MotionButton bg="backgroundSecondaryDark" color="textPrimary" fontFamily="body"
            onClick={() => handleNavigate("hard")}
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
            }}>Hard Difficulty</MotionButton>
          </Box>
        </Box>
          
        <Box>
          <Slider.Root maxW="sm" size="sm" defaultValue={[5]} min={5} max={20} step={5} onValueChange={(details) => setImageCount(details.value[0])}>
            <HStack justify="space-between" mb={1}>
              <Slider.Label fontSize="sm">Number of images:</Slider.Label>
              <Slider.ValueText fontSize="sm" fontWeight="semibold" px={2} py={0.5} borderRadius="md"/>
            </HStack>
            <Slider.Control h={1.5} borderRadius="full">
              <Slider.Track>
                <Slider.Range/>
              </Slider.Track>
              <Slider.Thumbs rounded="l1"/>
            </Slider.Control>
            <HStack justify="space-between" mt={1} fontSize="xs" color="gray.500">
              <Box>5</Box>
              <Box>10</Box>
              <Box>15</Box>
              <Box>20</Box>
            </HStack>
          </Slider.Root>
        </Box>
      </Box>
    </Box>
}
