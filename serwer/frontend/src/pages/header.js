import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import '../styles/header.css'

const Header = () => {
    const [isLogged, setIsLogged] = useState(false);
    const [username, setUsername] = useState("username");

    const navigate = useNavigate();

    useState(() => {
        const uname = localStorage.getItem("username");
        if (!uname)
            return false;
        else {
            setIsLogged(true);
            setUsername(uname);
        }
    }, [])

    const logout = () => {
        setUsername("");
        setIsLogged(false);
        localStorage.setItem("token", "");
        localStorage.setItem("username", "");
        localStorage.setItem("idUser", "");
        localStorage.setItem('email', "");
        localStorage.setItem('isLogged',false);
        localStorage.setItem('isAdmin',false);
        navigate("/");
    }

    return isLogged ? (
        <header className="header">
            <Link to="/"><div className="logo">ogloszenia.test</div></Link>
            <nav className="nav">
                <div classname="hello_text" >Witaj {username}</div>
                <Link to="/profile"><button className="btnSecondary">Profil</button></Link>
                <button className="btnPrimary" onClick={logout}>Wyloguj</button>
            </nav>
        </header>
    ) : (
        <header className="header">
            <Link to="/"><div className="logo">ogloszenia.test</div></Link>
            <nav className="nav">
                <Link to="/login"><button className="btnSecondary">Logowanie</button></Link>
                <Link to="/register"><button className="btnPrimary">Rejestracja</button></Link>
            </nav>
        </header>
    )
}

export default Header;