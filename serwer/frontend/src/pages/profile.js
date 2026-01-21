import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router";
import axios from 'axios';

import '../styles/profile.css';
import Header from './header';
import { sendWarning, sendError, sendSuccess } from '../components/toast';

const ProfilePage = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({ username: '', email: '' });
    const [userOffers, setUserOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');

    const [showModal, setShowModal] = useState(false);
    
    useEffect(() => {
        const isLogged = localStorage.getItem("isLogged");
        if (!isLogged) {
            sendWarning("Nie jesteś zalogowany");
            navigate("/login");
        }
    }, []);

    useEffect(() => {
        try {
            const token = localStorage.getItem("token");
            axios
                .get('/api/getuseroffers', {
                    headers: {
                        Authorization: token
                    }
                })
                .then(data => {
                    setUserOffers(data.data.results);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Błąd pobierania oferty:", err);
                    setLoading(false);
                });
            setLoading(false);
        } catch (err) {
            console.error("Błąd ładowania profilu", err);
            setLoading(false);
        };
    }, []);

    useEffect(() => {
        const username = localStorage.getItem("username");
        const email = localStorage.getItem("email");
        setUser({ username: username, email: email });
    }, []);

    const handleDeleteAccount = async () => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete('/api/deleteuser', {
                headers: { Authorization: token }
            });
            sendSuccess("Konto zostało usunięte");
            localStorage.clear();
            navigate("/");
        } catch (err) {
            sendError("Nie udało się usunąć konta");
            console.error(err);
        } finally {
            setShowModal(false);
        }
    };

    return (
        <div>
            <Header />
            <div className="container">
                <section className="profileHeader">
                    <div className="profileInfo">
                        <h1>Mój Profil</h1>
                        <div className="profileSubsection">
                            <div className="userInfoCard">
                                <p><strong>Nazwa użytkownika:</strong> {user.username}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                                <button className="dangerBtn" onClick={() => setShowModal(true)}>Usuń konto</button>
                            </div>
                            <div className="addBtn">
                                <Link to="/addoffer"><button className="btnPrimary" id="addBtn">+ Dodaj nowe ogłoszenie</button></Link>
                            </div>
                        </div>
                    </div>

                </section>

                <hr className="divider" />

                <main className="mainContent">
                    <h2 className="sectionTitle">Twoje aktualne ogłoszenia</h2>

                    {loading ? (
                        <p>Ładowanie...</p>
                    ) : userOffers.length > 0 ? (
                        <div>
                            <section className="controlsSection">
                                <div className="searchBar">
                                    <input
                                        type="text"
                                        placeholder="Szukaj ogłoszenia..."
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="filters">
                                    <select onChange={(e) => setSortOrder(e.target.value)}>
                                        <option value="newest">Najnowsze</option>
                                        <option value="oldest">Najstarsze</option>
                                        <option value="asc">Cena: rosnąco</option>
                                        <option value="desc">Cena: malejąco</option>
                                    </select>
                                </div>
                            </section>
                            <div className="grid">
                                {!loading ? userOffers
                                    .filter(offer => offer.title.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .sort((a, b) => {
                                        if (sortOrder === 'asc') return a.price - b.price;
                                        else if (sortOrder === 'desc') return b.price - a.price;
                                        else if (sortOrder === 'oldest') return new Date(a.adddate) - new Date(b.adddate);
                                        return new Date(b.adddate) - new Date(a.adddate);
                                    })
                                    .map(offer => (
                                        <div key={offer.idOffer} className="offerCard">
                                            <div className="offerImage">{offer.imagepath ? (<img src={"/api/" + offer.imagepath}></img>) : (<div>Brak zdjęcia</div>)}</div>
                                            <div className="offerInfo">
                                                <h3>{offer.title}</h3>
                                                {offer.isprice ? <p className="price">{offer.price} zł</p> : <p className="price">Bezpłatne</p>}
                                                <Link to={"/offer/" + offer.idoffer}><button className="detailsBtn">Szczegóły</button></Link>
                                                <Link to={"/editoffer/" + offer.idoffer}><button className="detailsBtn">Edytuj ogłoszenie</button></Link>
                                            </div>
                                        </div>
                                    )) : <div className="loading">Ladowanie ogłoszeń</div>}
                            </div>
                        </div>
                    ) : (
                        <div className="noAds">
                            <p>Nie masz jeszcze żadnych ogłoszeń.</p>
                        </div>
                    )}
                </main>
            </div>
            {showModal && (
                <div className="modalOverlay">
                    <div className="modalContent">
                        <h2>Potwierdź usunięcie</h2>
                        <p>Czy na pewno chcesz usunąć swoje konto? Tej operacji nie można cofnąć.</p>
                        <div className="modalActions">
                            <button className="btnSecondary" onClick={() => setShowModal(false)}>Anuluj</button>
                            <button className="dangerBtn" onClick={handleDeleteAccount}>Usuń na zawsze</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;