import "./css/App.css";
import DogCard from "./components/DogCard";
import Favorites from "./pages/Favorites";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Identify from "./pages/Identify";
import BreedInfo from "./pages/BreedInfo";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { Profile } from "./components/Profile";
import { AuthProvider } from "./components/auth";
import { RequireAuth } from "./components/RequireAuth";
import { BreedProvider } from "./contexts/BreedContext";

function App() {
  return (
    <div>

      <AuthProvider>
        <BreedProvider>
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/login" element={<Login />}></Route>
            
              <Route path="/" element={<RequireAuth><Home /></RequireAuth>}></Route>
              <Route path="/favorites" element={<RequireAuth><Favorites /></RequireAuth>}></Route>
              <Route path="/identify" element={<RequireAuth><Identify /></RequireAuth>}></Route>
              <Route path="/:name" element={<RequireAuth><BreedInfo /></RequireAuth>}></Route>
              <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>}></Route>
            
          </Routes>
       </main>
       </BreedProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
