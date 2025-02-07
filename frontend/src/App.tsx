import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import ShareLinkNote from "./pages/ShareLinkNote";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Toaster } from "react-hot-toast";
function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  },[]);

  if(isCheckingAuth) {
    return <div className="flex justify-center items-center absolute inset-0">  
      <Loader2 size={40}  className="animate-spin" />
    </div>
  }

  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={authUser ? <Dashboard /> : <Navigate to="/signin" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/dashboard" element={authUser ? <Dashboard /> : <Navigate to='/signin' />} />
        <Route path="/note/:shareLink" element={<ShareLinkNote/>}/>
      </Routes>
      <Toaster/>
      </BrowserRouter>
    </div>
  )
}

export default App;
