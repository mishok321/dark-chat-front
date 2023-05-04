import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Lobby from "./components/Lobby";
import Room from "./components/Room";
import { ReactNotifications } from "react-notifications-component";
import Login from "./components/Login";
import Register from "./components/Register";
import NotFound from "./components/NotFound";
import { useState } from "react";
import token from "./constants/token";

export default function App() {
    const [isToken, setIsToken] = useState(
      () => localStorage.getItem(token.NAME) !== null
    );

    return (
      <>
        <ReactNotifications />
        <BrowserRouter>
          <Routes>
            <Route exact path="/room/:id" element={ isToken ? <Room /> : <Navigate to="/login"/> }/>
            <Route exact path="/" element={ isToken ? <Lobby setIsToken={setIsToken} /> : <Navigate to="/login"/>  }/>
            <Route exact path="/login" element={ isToken ? <Navigate to="/"/> : <Login setIsToken={setIsToken} /> } />
            <Route exact path="/register" element={ isToken ? <Navigate to="/"/> : <Register /> } />
            <Route exact path="*" element={ <NotFound /> } />
          </Routes>
        </BrowserRouter>
      </>
    );
}
