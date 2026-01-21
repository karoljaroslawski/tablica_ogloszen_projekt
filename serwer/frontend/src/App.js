import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer} from 'react-toastify';

import HomePage from './pages/home'
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import OfferPage from './pages/offer'
import AddOfferPage from './pages/addOffer';
import ProfilePage from './pages/profile';
import EditOfferPage from './pages/editOffer';

function AppRoutes(){

  return (
    <>
    <ToastContainer className="toast-position"/>
      <Routes >
        <Route path="/" element={<HomePage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/offer" element={<LoginPage/>}/>
        <Route path="/offer/:id" element={<OfferPage/>}/>
        <Route path="/editoffer" element={<LoginPage/>}/>
        <Route path="/editoffer/:id" element={<EditOfferPage/>}/>
        <Route path="/addoffer" element={<AddOfferPage/>}/>
        <Route path="/profile" element={<ProfilePage/>}/>
      </Routes>
      </>
  );

}

function App() {
  return (
    <BrowserRouter>
        <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
