import { ColorModeProvider } from './components/ui/color-mode'

import { Routes, Route } from "react-router-dom"
import Home from './pages/Home'
import Play from './pages/Play'
import Summary from './pages/Summary'

function App() {
  return (
    <ColorModeProvider forcedTheme="dark">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<Play />} />
        <Route path="/summary" element={<Summary />} />
      </Routes>
    </ColorModeProvider>
  )
}

export default App
