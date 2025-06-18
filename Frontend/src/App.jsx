import {
  Routes,
   Route,
   useLocation,
   useNavigate,
} from "react-router-dom";
import Auth from "./auth/Auth";
import { useEffect } from "react";
import Home from "./home/home";

function App() {
   const location = useLocation();
   const navigate = useNavigate();

   useEffect(() => {
      if (location.pathname === "/") {
         navigate("/register");
      }
   }, [location,navigate]);

   return (
      <>
            <Routes>
                  {/* Auth Route */}
                  <Route path="/register" element={<Auth/>} />
                  <Route path="/home" element={<Home/>} />
            </Routes>
      </>
   );
}

export default App;
