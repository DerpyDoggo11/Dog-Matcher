import { Box, Button, Heading, Image } from '@chakra-ui/react'

function App() {
  return (
    <Box p={8}>
      <Heading mb={4}>Dog Breed Recognizer</Heading>

      <Button colorScheme="teal">Upload Photo</Button>

      <Image
        src="https://place-puppy.com/300x300"
        alt="dog"
        mt={6}
        borderRadius="lg"
      />
    </Box>
  )
}

export default App
