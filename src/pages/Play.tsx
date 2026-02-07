import {Box, Heading, Input, Image, Button} from '@chakra-ui/react'
import {useEffect, useRef, useState} from "react"
import {motion} from "framer-motion"
import {useNavigate, useSearchParams} from "react-router-dom"

const MotionHeading = motion(Heading)
const MotionButton = motion(Button)

const normalizeBreedString: Record<string, string> = {
  "germanshepherd": "german shepherd",
  "stbernard": "saint bernard",
  "mexicanhairless": "mexican hairless dog",
  "africanwilddog": "african wild dog",
  "bernese mountain": "bernese mountain dog",
  "shepherd australian": "australian shepherd",
};


function extractBreed(url: string) {
  const parts = url.split("/breeds/")[1].split("/");
  const raw = parts[0]; // e.g. "bernese-mountain"

  let breed = raw;

  if (raw.includes("-")) {
    const [main, sub] = raw.split("-");
    breed = `${sub} ${main}`;
  }

  const key = raw.toLowerCase();
  if (normalizeBreedString[key]) {
    return normalizeBreedString[key];
  }

  return breed
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function normalize(text: string) {
  return text.toLowerCase().trim();
}

function getObfuscatedBreedName(currentBreed: string) {
  return currentBreed.replace(/[a-zA-Z]/g, "_");
}


function revealNextHint(currentBreed: string, hintedBreedName: string) {
  const indices = [];
  for (let i = 0; i < hintedBreedName.length; i++) {
    if (hintedBreedName[i] === "_") {
      indices.push(i);
    }
  }
  if (indices.length === 0) return hintedBreedName; 

  const randomIndex = indices[Math.floor(Math.random() * indices.length)];
  hintedBreedName = hintedBreedName.substring(0, randomIndex) + currentBreed[randomIndex] + hintedBreedName.substring(randomIndex + 1);
  return hintedBreedName;
}

export default function Play() {
  const [params] = useSearchParams() 
  const difficulty = params.get("difficulty") || "unknown"

  let timePerImage = 30
  let hintFrequency = 35
  if (difficulty == "medium") {
    timePerImage = 20
    hintFrequency = 25
  } else if (difficulty == "hard") {
    timePerImage = 10
    hintFrequency = 15
  }

  const [images, setImages] = useState<string[]>([])
  const navigate = useNavigate()
  
  useEffect(() => { 
    console.log('Fetching images')
    fetch("https://dog.ceo/api/breeds/image/random/5") 
      .then(res => res.json()) 
      .then(data => setImages(data.message)) 
  }, [])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [guess, setGuess] = useState("");

  const currentBreed = images[currentIndex] ? extractBreed(images[currentIndex]) : "";
  const [hintedBreedName, setHintedBreedName] = useState("");

  const revealInterval = Math.ceil(hintFrequency / currentBreed.length);


  useEffect(() => {
    console.log("New breed:", currentBreed)
    setHintedBreedName(getObfuscatedBreedName(currentBreed));
  }, [currentBreed]);

  
  const [timeLeft, setTimeLeft] = useState(timePerImage)
  const [shakeWrongAnswer, setShakeWrongAnswer] = useState(false);
  const [shakeCorrectAnswer, setShakeCorrectAnswer] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const isMountedRef = useRef(false);
  const lastRevealRef = useRef<number | null>(null);
  const isTransitioningRef = useRef(false);


  function nextPage() {
    if (isTransitioningRef.current) return
    isTransitioningRef.current = true
    setHintedBreedName(currentBreed)
    setTimeout(() => {
        if (currentIndex + 1 < images.length) {
          setCurrentIndex(i => i + 1)
          setGuess("")
          setTimeLeft(timePerImage)
          lastRevealRef.current = null
        } else {
          navigate(`/summary?difficulty=${difficulty}`)
        }
        isTransitioningRef.current = false;
      }, 2000);
  }
  
  function handleSubmit(forceWrong = false) {
    const correct = normalize(currentBreed) === normalize(guess)
    if (correct && !forceWrong) {
      setShakeCorrectAnswer(true);
      setTimeout(() => setShakeCorrectAnswer(false), 1000);
      nextPage()
    } else {
      setShakeWrongAnswer(true);
      setTimeout(() => setShakeWrongAnswer(false), 1000);
    }
  }

  useEffect(() => {
    if (!isMountedRef.current) { 
      isMountedRef.current = true 
      return
    }

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (isTransitioningRef.current) {
          return prev;
        }
        
        if (prev <= 1) {
          handleSubmit(true)
          // setCurrentIndex(i => {
          //   const next = i + 1
          //   if (next < images.length) {
          //     return next
          //   } else {
          //     navigate(`/summary?difficulty=${difficulty}`)
          //     return i 
          //   }
          // })
          return timePerImage
        }
        
        if (prev % revealInterval === 0) {
          if (lastRevealRef.current !== prev) {
            lastRevealRef.current = prev;
            setHintedBreedName(prev => {
              if (!currentBreed || prev.length !== currentBreed.length) {
                return prev;
              }
              return revealNextHint(currentBreed, prev);
            });
          }
        }

        return prev - 1
      })
    }, 1000)
    return () => {
      if (intervalRef.current) { 
        clearInterval(intervalRef.current)
        intervalRef.current = null
      } 
    }
  }, [revealInterval, currentBreed, timePerImage])
  


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
      <Image src={images[currentIndex]} boxSize="300px" objectFit="contain" borderRadius="md" mx="auto"/>

      <Box position="relative" textAlign="center" w="100%" p={4}>
        <MotionHeading mb={4} fontFamily="title" color="textPrimary" fontSize="2xl"
        animate={shakeWrongAnswer ? "wrong" : shakeCorrectAnswer ? "correct" : "normal"}
        variants={{
          normal: {
            y: [0, -2, 0],
            color: ["#fff", "#ddd", "#fff"], 
            transition: { duration: 0.2}
          },
          wrong: {
            x: [-5, 5, -5, 5, 0],
            color: ["#ff4d4d", "#ff1a1a", "#ff4d4d"],
            transition: { 
              duration: 0.4,
              ease: "easeInOut" 
            }
          },
          correct: {
            x: [-3, 3, -3, 3, 0],
            color: ["#7cff4d", "#7cff4d", "#7cff4d"],
            transition: { 
              duration: 0.4,
              ease: "easeInOut" 
            }
          }
        }}>{hintedBreedName}</MotionHeading>
      </Box>
    
      <Box display="flex" justifyContent="center" alignItems="center" gap={4} mt={4}>
        <Input placeholder="Enter dog breed name" variant="subtle" w="40%" value={guess} onChange={(e) => setGuess(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { handleSubmit(); } }}/>
        <MotionButton bg="backgroundSecondaryDark" color="textPrimary" fontFamily="body"
        onClick={() => handleSubmit()}
        whileHover={{
        scale: 1.12,
        transition: { duration: 0 },
        }}>Submit</MotionButton>
      </Box>

    </Box>
      
  </Box>
}
