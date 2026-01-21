import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import '../styles/authStyles.css';
import '../styles/addOffer.css'
import Header from './header';

import { sendError, sendSuccess, sendWarning } from '../components/toast';

const AddOfferPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        isFree: false,
        price: '',
        image: null
    });

    useEffect(() => {
        const isLogged = localStorage.getItem("isLogged");
        if (!isLogged) {
            sendWarning("Nie jesteś zalogowany");
            navigate("/login");
        }
    }, []);

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

        if (!formData.title || !(formData.isFree || formData.price) || !formData.image) {
            sendError("Tytuł, cena/bezpłatność i zdjęcie są wymagane");
            return;
        }
        if(!formData.isFree && !formData.price){
            sendError("Cena/bezpłatność jest wymagana");
            return;
        }
        if(formData.price && Number.isNaN(formData.price)){
            sendError("Cena musi być liczbą rzeczywistą");
            return;
        }
        if(!formData.isFree && formData.price){
            if(formData.price>10000000){
                sendError("Cena musi być mniejsza niż 1000000");
                return;
            }
            if(formData.price<0){
                sendError("Cena musi być dodatnia");
                return;
            }
        }
        
        if(formData.title.length>=500){
                    sendError("Tytuł nie może być dłuższy niż 255 znaków");
                    return;
        }
        

        if(formData.description.length>=500){
            sendError("Opis musi zawierać się w 500 znakach");
            return;
        }

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('isPrice', !formData.isFree);
        data.append('price', !formData.isFree ? formData.price : 0.0);
        data.append('photo', formData.image);

        const token = localStorage.getItem("token");
        try {
            const response = await axios.post('/api/createoffer', data, {
                headers: {
                    Authorization: token,
                    "Content-Type": "multipart/form-data",
                }
            });

            if (response.status == 201) {
                sendSuccess("Ogłoszenie dodane pomyślnie!");
                navigate("/");
            }
        } catch (err) {
            console.error("Błąd wysyłania:", err);
        }
    };

    return (
        <div>
            <Header />
            <div className="authContainer">
                <div className="authCard" style={{ maxWidth: '600px' }}>
                    <h2>Dodaj nowe ogłoszenie</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="formGroup">
                            <label>Zdjęcie produktu</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                required
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

                        <button type="submit" className="authBtn">Opublikuj ogłoszenie</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddOfferPage;