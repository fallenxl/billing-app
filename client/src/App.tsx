import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Home } from "./pages/home/Home"
import { Auth } from "./pages/auth/Auth"
import { AuthGuard } from "./guards/auth/AuthGuard"
import { SelectAsset } from "./pages/select-asset/SelectAsset"
function App() {

  return (
    <>  
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/auth" element={<Auth/>} />
          <Route element={<AuthGuard/>}>
            <Route path="/dashboard" element={<Home/>} />
            <Route path="/select" element={<SelectAsset/>} />
            <Route path="/settings" element={<Home/>} />
          
          </Route>
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </Router>

    </>
  )
}

export default App
