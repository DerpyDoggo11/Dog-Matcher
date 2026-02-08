import {Box, Button, Heading, Image, Carousel, IconButton} from '@chakra-ui/react'
import {useState} from "react"
import {motion} from "framer-motion"
import {useNavigate, useLocation} from "react-router-dom"
import { LuChevronLeft, LuChevronRight } from "react-icons/lu"


const MotionHeading = motion(Heading)
const MotionButton = motion(Button)

type HistoryEntry = {
  image: string
  correctBreed: string
  guesses: string[]
  isCorrect: boolean
  timeUntilCorrect: number
};


export default function Summary() {

    const navigate = useNavigate()
    const { state } = useLocation(); 
    const history: HistoryEntry[] = state?.history || [];
    const [currentPage, setPage] = useState(0)
     
    
    
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

        <Carousel.Root slideCount={history.length} gap="4" autoplay={{ delay: 5000 }}>
            <Carousel.Control justifyContent="center" gap="4">
                <Carousel.PrevTrigger asChild>
                    <IconButton size="xs" variant="ghost"> 
                        <LuChevronLeft/>
                    </IconButton>
                </Carousel.PrevTrigger>
                
                <Carousel.ItemGroup w="30%">
                    {history.map((entry: HistoryEntry, index: number) => (
                        <Carousel.Item key={index} index={index}>
                            <Heading size="md" mt={2} color={entry.isCorrect ? "green.300" : "red.300"}>
                                {entry.correctBreed}
                            </Heading>
                            <Image src={entry.image} boxSize="200px" objectFit="contain" borderRadius="md" mx="auto"/>
                            <Box mt={2}>
                                {entry.guesses.length === 0 ? (
                                    <Box color="gray.400" fontStyle="italic">No guesses</Box>) 
                                : (
                                    <Box>
                                        <Heading size="sm">Your guesses:</Heading>
                                        {entry.guesses.map((guess: string, index: number) => (
                                            <Box key={index} color={ guess.toLowerCase() === entry.correctBreed.toLowerCase() ? "green.300" : "red.300"}>
                                                {guess}
                                            </Box>
                                        ))}
                                        <Heading size="sm" mt={2}>Solved in {entry.timeUntilCorrect} seconds</Heading>
                                    </Box>
                                )}
                            </Box>

                        </Carousel.Item>
                    ))}
                </Carousel.ItemGroup>

                <Carousel.NextTrigger asChild>
                    <IconButton size="xs" variant="outline"> 
                        <LuChevronRight/>
                    </IconButton>
                </Carousel.NextTrigger>

            </Carousel.Control>

            <Carousel.IndicatorGroup>
                {history.map((item: HistoryEntry, index: number) =>(
                    <Carousel.Indicator key={index} index={index} unstyled _current={{
                        outline: "2px solid currentColor",
                        outlineOffset: "2px",
                    }}>
                        <Image w="20" src={item.image} objectFit="contain"/>
                    </Carousel.Indicator>
                ))}
            </Carousel.IndicatorGroup>
        </Carousel.Root>


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