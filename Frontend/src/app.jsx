import React from "react";
import Header from "./components/header.jsx";
import Footer from "./components/Footer.jsx";
import { useState } from "react";
import {BrowserRouter as Router,Route,Navigate,Routes} from "react-router-dom"
import Login from "./Pages/Login.jsx";
import SignUp from "./Pages/SignUp.jsx";
import NotesPage from "./Pages/NotesPage.jsx";
import { useEffect } from "react";

function App() {
  const [isAuthenticated,setIsAuthenticated]=useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return(
    <Router>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated?'/notes':'/login'}></Navigate>}></Route>
        <Route path="/login" element={<Login setAuth={setIsAuthenticated}></Login>}></Route>
        <Route path="/sign-up" element={<SignUp></SignUp>}></Route>
        <Route 
          path="/notes"
          element={isAuthenticated?<NotesPage />:<Navigate to={"/login"}></Navigate>}
        ></Route>
      </Routes>
      <Footer></Footer>
    </Router>
  )
}

export default App;
