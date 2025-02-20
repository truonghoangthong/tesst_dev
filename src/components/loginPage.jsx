import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import useLogin from '../../../Backend/src/hooks/AuthenicationHooks/useLogin';
import useAuthStore from '../../../Backend/src/store/authStore';
import Popup from './popup';
import { useNavigate } from 'react-router-dom';

const images = [
  '/img1.png',
  '/img2.png',
  '/img3.png',
  '/img4.png',
  '/img5.png',
  '/img6.png',
];

const LoginPage = () => {
  const { login, loading: loginLoading, error: loginError } = useLogin();
  const user = useAuthStore((state) => state.user);
  const [currentImage, setCurrentImage] = useState(0);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const [popup, setPopup] = useState({
    show: false,
    title: "",
    message: "",
    status: "",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user) {
      console.log('User data after login:', user);
      console.log('Is Admin:', user.isAdmin);
      if (popup.status === "success") {
        if (user.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/client/sauna');
        }
      }
    }
  }, [user, popup.status, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      try {
        const result = await login(formData);
        setPopup({
          show: true,
          title: result.Title,
          message: result.Message,
          status: result.Status,
        });

      } catch (error) {
        console.error('Login failed', error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const closePopup = () => {
    setPopup({ show: false, title: "", message: "", status: "" });
  };

  return (
    <div className="container login-page">
      <div className="slideshow-container">
        <img src={images[currentImage]} alt="Slideshow" className="slideshow-image" />
      </div>
      <div className="login-container">
        <div className="login-box">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="email"
              placeholder="Username"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={loginLoading}>
              {loginLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          {loginError && <p className="error">{loginError}</p>}
        </div>
      </div>
      {popup.show && (
        <Popup
          title={popup.title}
          message={popup.message}
          status={popup.status}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default LoginPage;