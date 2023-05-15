import React from "react";
import "../styles/footer.scss";

function Footer() {
  return (
    <div className="footer-main">
      <footer className="footer">
        <span>
          Build by the team of{" "}
          <a
            target="_blank"
            href="https://lampros.tech/"
            rel="noopener noreferrer"
          >
            Lampros Tech
          </a>
        </span>
      </footer>
    </div>
  );
}

export default Footer;
