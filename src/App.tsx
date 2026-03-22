import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SimulationBoot } from './components/SimulationBoot/SimulationBoot'
import { ToastStack } from './components/ToastStack/ToastStack'
import { DistrictPage } from './pages/DistrictPage/DistrictPage'
import { Home } from './pages/Home/Home'
import { MapPage } from './pages/MapPage/MapPage'

export default function App() {
  return (
    <BrowserRouter>
      <SimulationBoot />
      <ToastStack />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/district/:id" element={<DistrictPage />} />
      </Routes>
    </BrowserRouter>
  )
}
