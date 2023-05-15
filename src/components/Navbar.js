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
          <span className="logo animate__animated animate__fadeInDown animate__delay-2s">
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
                ? "navmenu animate__animated animate__fadeInDown animate__delay-2s"
                : "navmenu active animate__animated animate__fadeInDown animate__delay-2s"
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
              <Link
                //   target="_blank"
                //   rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
                to="/profile"
                className="animate__animated animate__fadeInDown"
              >
                <button className="logged-in">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    enable-background="new 0 0 24 24"
                    height="24px"
                    viewBox="0 0 24 24"
                    width="24px"
                    fill="#000000"
                  >
                    <g>
                      <rect fill="none" height="24" width="24" />
                      <rect fill="none" height="24" width="24" />
                    </g>
                    <g>
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 6.14 2.12C16.43 19.18 14.03 20 12 20z" />
                    </g>
                  </svg>
                  Account
                </button>
              </Link>
              <button
                className="login-button animate__animated animate__fadeInDown"
                id="logout"
                onClick={props.logout}
              >
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
