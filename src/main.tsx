import React from "react"
import ReactDOM from "react-dom/client"
import { ChakraProvider, createSystem, defaultConfig, defineConfig} from "@chakra-ui/react"
import App from "./App.tsx"

const config = defineConfig({
  theme: {
    
    tokens: {
      colors: {
        backgroundPrimary: { value: "#30364F" },
        backgroundSecondary: { value: "#ACBAC4" },
        backgroundSecondaryMedium: { value: "#95a2ab" },
        backgroundSecondaryDark: { value: "#909ca4" },
        textPrimary: { value: "#fffdf5" },
        textSecondary: { value: "#d2d2bf" },
      },
      fonts: {
        title: { value: "montserrat, sans-serif" },
        body: { value: "montserrat, sans-serif" },
      },
    },
    
  },
})



export const system = createSystem(defaultConfig, config)

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider value={system}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
)

