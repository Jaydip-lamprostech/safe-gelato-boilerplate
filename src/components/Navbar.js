import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.scss";
import "animate.css";

function Navbar(props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [address, setAddress] = useState("");

  console.log(props.userData);
  function handleClick() {
    setIsExpanded(!isExpanded);
  }
  return (
    <>
      <header className="header">
        <nav className="navbar">
          <span className="logo animate__animated animate__fadeInDown">
            <Link to="/">
              {/* <Image src={logo} alt="logo" /> */}
              <h1 className="logo-h1">
                LOGO
                {/* UpToData */}
              </h1>
            </Link>
          </span>
          <ul
            className={
              isExpanded === false
                ? "navmenu animate__animated animate__fadeInDown"
                : "navmenu active animate__animated animate__fadeInDown"
            }
          >
            <li className="navitem">
              <span>
                <Link
                  //   target="_blank"
                  //   rel="noopener noreferrer"
                  to="/first-page"
                  className="navlink"
                >
                  Page1
                </Link>
              </span>
            </li>
            <li className="navitem">
              <span>
                <Link
                  //   target="_blank"
                  //   rel="noopener noreferrer"
                  to="/second-page"
                  className="navlink"
                >
                  Page2
                </Link>
              </span>
            </li>
            <li className="navitem">
              <span>
                <Link
                  //   target="_blank"
                  //   rel="noopener noreferrer"
                  to="/third-page"
                  className="navlink"
                >
                  Page3
                </Link>
              </span>
            </li>
          </ul>
          {props.userData.address ? (
            <>
              <button className="logged-in">
                {props.userData.address.eoa.slice(0, 5) +
                  "..." +
                  props.userData.address.eoa.slice(
                    props.userData.address.eoa.length - 5,
                    props.userData.address.eoa.length
                  )}
              </button>
              <button className="login-button" onClick={props.logout}>
                Logout
              </button>
            </>
          ) : (
            <button
              className="login-button animate__animated animate__fadeInDown"
              onClick={props.login}
            >
              Login
            </button>
          )}

          <button
            onClick={handleClick}
            className={isExpanded === false ? "hamburger" : "hamburger active"}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </nav>
      </header>

      {/* {children} */}
      {/* footer */}
    </>
  );
}

export default Navbar;
