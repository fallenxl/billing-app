import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Home } from "./pages/home/Home"
import { Auth } from "./pages/auth/Auth"
import { AuthGuard } from "./guards/auth/AuthGuard"
import { SelectAsset } from "./pages/select-asset/SelectAsset"
import { useEffect } from "react"
function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token')?? localStorage.getItem("jwt");
  useEffect(() => {
    if (token) {
      localStorage.setItem('jwt', JSON.stringify({ token }))
    }
  }, [])
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
