import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import '../styles/authStyles.css';
import '../styles/editOffer.css'
import Header from './header';

import { sendError, sendSuccess, sendWarning } from '../components/toast';

const EditOfferPage = () => {
    const navigate = useNavigate();

    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        isFree: false,
        price: '',
        image: null
    });

    const [showModal, setShowModal] = useState(false);


    useEffect(() => {
        const isLogged = localStorage.getItem("isLogged");
        if (!isLogged) {
            sendWarning("Nie jesteś zalogowany");
            navigate("/login");
        }
    }, []);

    useEffect(() => {
        axios
            .get('/api/getoffer', { params: { idOffer: id } })
            .then(data => {
                setFormData({
                    title: data.data.results.title,
                    description: data.data.results.description,
                    isFree: !data.data.results.isprice,
                    price: data.data.results.price,
                });
            })
            .catch(err => {
                console.error("Błąd pobierania oferty:", err);
            });

    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        setFormData(prev => ({ ...prev, image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !(formData.isFree || formData.price)) {
            sendError("Tytuł, cena/bezpłatność są wymagane");
            return;
        }
        if (!formData.isFree && !formData.price) {
            sendError("Cena/bezpłatność jest wymagana");
            return;
        }
        if (formData.price && Number.isNaN(formData.price)) {
            sendError("Cena musi być liczbą rzeczywistą");
            return;
        }
        if (!formData.isFree && formData.price) {
            if (formData.price > 10000000) {
                sendError("Cena musi być mniejsza niż 1000000");
                return;
            }
            if (formData.price < 0) {
                sendError("Cena musi być dodatnia");
                return;
            }
        }
        if (formData.title.length >= 500) {
            sendError("Tytuł nie może być dłuższy niż 255 znaków");
            return;
        }

        if (formData.description.length >= 500) {
            sendError("Opis musi zawierać się w 500 znakach");
            return;
        }

        const data = new FormData();
        data.append('idOffer', id);
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('isPrice', !formData.isFree);
        data.append('price', !formData.isFree ? formData.price : 0.0);
        data.append('photo', formData.image ? formData.image : "None");

        const token = localStorage.getItem("token");
        try {
            const response = await axios.post('/api/editoffer', data, {
                headers: {
                    Authorization: token,
                    "Content-Type": "multipart/form-data",
                }
            });
            console.log(response);

            if (response.status == 200) {
                sendSuccess("Edycja ogłoszenia pomyślna!");
                navigate("/profile");
            }
        } catch (err) {
            console.error("Błąd wysyłania:", err);
        }
    };

    const handleDeleteOffer = async () => {
        const token = localStorage.getItem("token");
        const data = { idOffer: id };
        try {
            await axios.post('/api/deleteoffer', data, {
                headers: { Authorization: token }
            });
            sendSuccess("Ogłoszenie zostało usunięte");
            navigate("/profile");
        } catch (err) {
            sendError("Nie udało się usunąć ogłoszenia");
            console.error(err);
        } finally {
            setShowModal(false);
        }
    };


    return (
        <div>
            <Header />
            <div className="authContainer">
                <div className="authCard" style={{ maxWidth: '600px' }}>
                    <h2>Edytuj ogłoszenie</h2>

                    <form>
                        <div className="formGroup">
                            <label>Zdjęcie produktu</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>

                        <div className="formGroup">
                            <label>Tytuł ogłoszenia</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="np. Rower górski Scott"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="formGroup">
                            <label>Opis</label>
                            <textarea
                                name="description"
                                placeholder="Opisz swój przedmiot..."
                                rows="5"
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontFamily: 'inherit' }}
                                value={formData.description}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <div className="formGroup" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                            <input
                                type="checkbox"
                                id="isFree"
                                name="isFree"
                                checked={formData.isFree}
                                onChange={handleChange}
                                style={{ width: 'auto' }}
                            />
                            <label htmlFor="isFree" style={{ marginBottom: 0 }}>To ogłoszenie jest darmowe</label>
                        </div>

                        {!formData.isFree && (
                            <div className="formGroup">
                                <label>Cena (PLN)</label>
                                <input
                                    type="number"
                                    name="price"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required={!formData.isFree}
                                />
                            </div>
                        )}

                        <button className="authBtn" onClick={handleSubmit}>Edytuj ogłoszenie</button>
                    </form>
                    <button className="dangerBtn" onClick={() => setShowModal(true)}>Usuń ogłoszenie</button>
                </div>
            </div>
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

export default EditOfferPage;