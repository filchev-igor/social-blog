import logo from "../../img/logo.png";
import React from "react";

const UpperNavbar = () => (
    <nav aria-label="Hidden navigation during scrolling"
         className="bg-light bg-gradient navbar navbar-expand-md pt-0"
         id="firstNavbarConsumer">
        <div className="container-fluid">
            <div className="collapse navbar-collapse pt-2" id="navbarText">
                <ul className="navbar-nav align-items-center w-100 justify-content-center">
                    <li className="nav-item">
                        <img alt="Website icon" src={logo} style={{width:"4rem", height: "4rem"}} />
                    </li>

                    <li className="nav-item">
                        <span className="nav-link display-6 text-uppercase">
                            social blog
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
);

export default UpperNavbar;