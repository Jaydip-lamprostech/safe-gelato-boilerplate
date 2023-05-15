import React from "react";
import bg1 from "../components/assets/bg1.png";
import "../styles/landingpage.scss";
import "animate.css";

function LandingPage() {
  return (
    <>
      <div className="hero">
        <div className="hero-left animate__animated animate__backInLeft animate__slow">
          <p className="hero-p">Lorem, ipsum dolor.</p>
          <h1 className="hero-h1">Lorem ipsum dolor sit amet.</h1>
          <p className="hero-p">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci,
            dolorum?
          </p>
          <div className="hero-left-buttons">
            <button className="hero-btn-1">lorem Ipsum</button>
            <button className="hero-btn-2">lorem Ipsum</button>
          </div>
        </div>
        <div className="hero-right animate__animated animate__backInRight animate__slow">
          <div className="hero-right-inside">
            <img className="hero-right-bg1" src={bg1} alt="background" />
          </div>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
