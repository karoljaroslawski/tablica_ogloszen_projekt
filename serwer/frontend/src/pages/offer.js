import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'

import Header from './header'

import '../styles/offer.css';

const OfferPage = () => {
    const { id } = useParams();
    const [offer, setOffer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get('/api/getoffer', { params: { idOffer: id } })
            .then(data => {
                setOffer(data.data.results);
                setLoading(false);
            })
            .catch(err => {
                console.error("Błąd pobierania oferty:", err);
                setLoading(false);
            });

    }, [id]);

    if (loading) return <div className="loader">Ładowanie oferty...</div>;
    if (!offer) return <div className="error">Nie znaleziono takiej oferty.</div>;

    return (
        <div>
            <Header />
            <div className="offer-page-container">
                <main className="offer-main">
                    {/* Sekcja górna: Zdjęcie i Podstawowe Info */}
                    <div className="offer-card-large">
                        <div className="offer-image-section">
                            {offer.image_url ? (
                                <img src={offer.image_url} className="main-photo" />
                            ) : (
                                <div className="offerImage">{offer.imagepath ? (<img src={"/api/" + offer.imagepath}></img>) : (<div>Brak zdjęcia</div>)}</div>
                            )}
                        </div>

                        <div className="offer-details-section">
                            <h1 className="offer-title-large">{offer.title}</h1>

                            {/* Warunkowe wyświetlanie ceny */}
                            {offer.isPrice && (
                                <div className="offer-price-tag">
                                    {offer.price} <span className="currency">PLN</span>
                                </div>
                            )}

                            <div className="seller-contact-box">
                                <h3>Kontakt ze sprzedawcą</h3>
                                <p className="contact-item">
                                    <strong>Email:</strong> <a href={`mailto:${offer.email}`}>{offer.email}</a>
                                </p>
                                <p className="contact-item">
                                    <strong>Telefon:</strong> <a href={`tel:${offer.telnumber}`}>{offer.telnumber}</a>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sekcja dolna: Opis */}
                    <div className="offer-description-card">
                        <h2>Opis ogłoszenia</h2>
                        <div className="description-text">
                            {offer.description}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default OfferPage;