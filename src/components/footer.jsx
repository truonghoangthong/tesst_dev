import React from "react";
import './footer.css';

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-left">
        <img src="../image 1.png" alt="Logo" className="footer-logo"/>
        <div className="footer-contact">
          <p>Neljäs Avenjku 3, 89400 Hyrynsalmi</p>
          <p>(+358) 504-040-373</p>
          <p><a href="mailto:contact@rakkaranta">contact@rakkaranta</a></p>
        </div>
      </div>
      <div className="footer-right">
        <div className="footer-column">
          <ul>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Accommodation Benefits</a></li>
            <li><a href="#">How to get to Ukko-Killa</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <ul>
            <li><a href="https://www.facebook.com/profile.php?id=61560052920308" target="_blank">Facebook</a></li>
            <li><a href="https://www.instagram.com/rakkaranta/" target="_blank">Instagram</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
} 
export default Footer;