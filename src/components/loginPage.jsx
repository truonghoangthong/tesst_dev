import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import useLogin from '../../../Backend/src/hooks/AuthenicationHooks/useLogin';

const images = [
  '/img1.png',
  '/img2.png',
  '/img3.png',
  '/img4.png',
  '/img5.png',
  '/img6.png',
];

const LoginPage = () => {
  const { login, loading, error } = useLogin();
  const [currentImage, setCurrentImage] = useState(0);
  const [formData, setFormData] = useState({ email: '', password: '' });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      try {
        await login(formData);  
      } catch (err) {
        console.error('Login failed', err);
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

  const simulateLogin = () => {
    setFormData({
      email: 'johndoe@gmail.com',
      password: '123456789as',
    });
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
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          {error && <p className="error">{error}</p>}
          <button onClick={simulateLogin}>Simulate Login</button> 
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
