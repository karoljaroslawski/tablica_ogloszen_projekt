import React, { useState, useEffect } from 'react';
import { Link } from "react-router";
import axios from 'axios';
import { useNavigate } from 'react-router';

import '../styles/home.css';

import Header from './header';
import Footer from './footer';
import { sendError, sendSuccess } from '../components/toast';


const HomePage = () => {
    const navigate = useNavigate();

    const [offers, setOffers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(-1);

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setIsAdmin(localStorage.getItem("isAdmin"));
    },[isAdmin])

    useEffect(() => {
        axios
            .get('/api/gethomeoffers')
            .then(data => {
                setOffers(data.data.results);
                setLoading(false);
            })
            .catch(err => {
                console.error("Błąd pobierania oferty:", err);
                setLoading(false);
            });
    }, []);

    const selectOffer = (id) => {
        setSelectedOffer(id);
        setShowModal(true);
    };

    const handleDeleteOffer = async () => {
        const token = localStorage.getItem("token");
        const data = {idOffer:selectedOffer};
        try {
            await axios.post('/api/deleteoffer', data, {
                headers: { Authorization: token }
            });
            sendSuccess("Ogłoszenie zostało usunięte");
            setOffers(prevOffers => prevOffers.filter(offer => offer.idoffer !== selectedOffer));
            navigate("/");
        } catch (err) {
            sendError("Nie udało się usunąć ogłoszenia");
            console.error(err);
        } finally {
            setShowModal(false);
        }
    };

    return (
        <div className="container">
            <Header />
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
            <main className="mainContent">
                <div className="grid">
                    {!loading ? offers
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
                                    {(isAdmin=="true")?(<button className="dangerBtn" onClick={() => {selectOffer(offer.idoffer)}}>Usuń ogłoszenie</button>):(<span></span>)}
                                </div>
                            </div>
                        )) : <div className="loading">Ladowanie ogłoszeń</div>}
                </div>
            </main>
            <Footer />
            {showModal && (
                <div className="modalOverlay">
                    <div className="modalContent">
                        <h2>Potwierdź usunięcie</h2>
                        <p>Czy na pewno chcesz usunąć to ogłoszenie? Tej operacji nie można cofnąć.</p>
                        <div className="modalActions">
                            <button className="btnSecondary" onClick={() => setShowModal(false)}>Anuluj</button>
                            <button className="dangerBtn" onClick={handleDeleteOffer}>Usuń na zawsze</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;