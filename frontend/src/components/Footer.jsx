import "../styles/footer.css"; 
import facebookIcon from "../assets/icons/facebook.png";
import twitterIcon from "../assets/icons/twitter.png";
import instagramIcon from "../assets/icons/instagram.png";
import linkedinIcon from "../assets/icons/linkedin.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Contact Info */}
        <div className="contact-info">
          <h3>Contact Us</h3>
          <p>📍 Krishna Mandir, Imadol, Lalitpur, Nepal</p>
          <p>📧 <a href="mailto:info@bahumukhi.com">info@bahumukhi.com</a></p>
          <p>📞 <a href="tel:+9779851220315">9851220315</a></p>
        </div>

        {/* Social Media Icons */}
        <div className="social-links">
          <h3>Follow Us</h3>
          <a href="https://www.facebook.com/profile.php?id=100068070978875" target="_blank" rel="noopener noreferrer">
            <img src={facebookIcon} alt="Facebook" />
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            <img src={twitterIcon} alt="Twitter" />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <img src={instagramIcon} alt="Instagram" />
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <img src={linkedinIcon} alt="LinkedIn" />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <p className="footer-bottom">© {new Date().getFullYear()} Bahumukhi Investment Company</p>
    </footer>
  );
};

export default Footer;