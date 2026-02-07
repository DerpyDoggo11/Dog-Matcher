import {Box, Heading, Input, Image, Button} from '@chakra-ui/react'
import {useEffect, useMemo, useRef, useState} from "react"
import {motion} from "framer-motion"
import {useNavigate, useSearchParams} from "react-router-dom"

const MotionHeading = motion(Heading)
const MotionButton = motion(Button)

const normalizeBreedString: Record<string, string> = {
  "leonberg": "leonberger",
  "shiba": "shiba inu",
  "malamute": "alaskan malamute",
  "mexicanhairless": "mexican hairless dog",
  "stbernard": "saint bernard",
  "africanwilddog": "african wild dog",
  "bernese mountain": "bernese mountain dog",
  "hound blood": "blood hound",
  "hound afghan": "afghan hound",
  "hound ibizan": "ibizan hound",
  "hound plott": "plott hound",
  "hound walker": "walker hound",
  "hound basset": "basset hound",
  "collie rough": "rough collie",
  "collie border": "border collie",
  "shepherd australian": "australian shepherd",
  "shepherd german": "german shepherd",
  "swedish danish": "danish swedish farmdog",
  "retriever golden": "golden retriever",
  "retriever curly": "curly coated retriever",
  "retriever flatcoated": "flat coated retriever",
  "retriever chesapeake": "chesapeake bay retriever",
  "poodle miniature": "miniature poodle",
  "poodle toy": "toy poodle",
  "poodle standard": "standard poodle",
  "spaniel cocker": "cocker spaniel",
  "spaniel sussex": "sussex spaniel",
  "spaniel japanese": "japanese spaniel",
  "spaniel blenheim": "blenheim spaniel",
  "spaniel brittany": "brittany spaniel",
  "spaniel irish": "irish water spaniel",
  "terrier bedlington": "bedlington terrier",
  "terrier border": "border terrier",
  "terrier cairn": "cairn terrier",
  "terrier dandie": "dandie dinmont terrier",
  "terrier fox": "fox terrier",
  "terrier irish": "irish terrier",
  "terrier kerryblue": "kerry blue terrier",
  "terrier lakeland": "lakeland terrier",
  "terrier norfolk": "norfolk terrier",
  "terrier norwich": "norwich terrier",
  "terrier patterdale": "patterdale terrier",
  "terrier russell": "jack russell terrier",
  "terrier scottish": "scottish terrier",
  "terrier sealyham": "sealyham terrier",
  "terrier silky": "silky terrier",
  "terrier tibetan": "tibetan terrier",
  "terrier welsh": "welsh terrier",
  "terrier westhighland": "west highland white terrier",
  "terrier wheaten": "soft coated wheaten terrier",
  "terrier yorkshire": "yorkshire terrier",
  "setter irish": "irish setter",
  "setter english": "english setter",
  "setter gordon": "gordon setter",
  "bulldog french": "french bulldog",
  "bulldog english": "english bulldog",
  "bulldog boston": "boston terrier",
  "mountain swiss": "greater swiss mountain dog",
  "mountain appenzeller": "appenzeller mountain dog",
  "mountain bernese": "bernese mountain dog",
  "mastiff bull": "bullmastiff",
  "mastiff tibetan": "tibetan mastiff",
  "sheepdog oldenglish": "old english sheepdog",
  "sheepdog shetland": "shetland sheepdog",
  "spitz japanese": "japanese spitz",
};


function extractBreed(url: string) {
  const parts = url.split("/breeds/")[1].split("/");
  const raw = parts[0]; // e.g. "bernese-mountain"

  let breed = raw;

  if (raw.includes("-")) {
    const [main, sub] = raw.split("-");
    breed = `${sub} ${main}`;
  }

  console.log("Extracted breed:", breed)
  const key = breed.toLowerCase();
  console.log("Normalization key:", key)
  if (normalizeBreedString[key]) {
    console.log("Found normalized breed:", normalizeBreedString[key])
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

  //const currentBreed = images[currentIndex] ? extractBreed(images[currentIndex]) : "";
  const currentBreed = useMemo(() => {
    if (!images[currentIndex]) return "";
    return extractBreed(images[currentIndex]);
  }, [images, currentIndex]);

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
      setCurrentIndex(i => {
        const next = i + 1
        if (next < images.length) {
          setGuess("")
          setTimeLeft(timePerImage)
          lastRevealRef.current = null
          isTransitioningRef.current = false;
          return next
        } else {
            navigate(`/summary?difficulty=${difficulty}`)
            return i
        }})
      }, 2000)
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
        
        if (prev < 1) {
          handleSubmit(true)
          nextPage()
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
  


  return <Box minH="100vh" w="100%" position="relative" textAlign="center" bg="backgroundPrimary" color="textPrimary" overflow="hidden">
    <Box position="relative" textAlign="center" w="100%">
      <MotionHeading fontFamily="title" color="textPrimary" fontSize="2xl" p={2}
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
    
    <Box position="relative" textAlign="center" w="100%">
      <Image src={images[currentIndex]} boxSize="400px" objectFit="contain" borderRadius="md" mx="auto"/>

      <Box position="relative" textAlign="center" w="100%">
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
