import React, { useState, useEffect } from 'react';
import './LoginPage.css';

const images = [
    '/public/img1.png',
		'/public/img2.png',
    '/public/img3.png',
		'/public/img4.png',
    '/public/img5.png',
    '/public/img6.png',
];

const LoginPage = () => {
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prevImage) => (prevImage + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container">
            <div className="slideshow-container">
                <img src={images[currentImage]} alt="Slideshow" className="slideshow-image" />
            </div>
            <div className="login-container">
                <div className="login-box">
                    <h2>Login</h2>
                    <form>
                        <input type="text" placeholder="Username" required />
                        <input type="password" placeholder="Password" required />
                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
