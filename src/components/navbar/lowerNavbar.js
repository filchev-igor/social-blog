import {Link} from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import LogoutButton from "../logoutButton";
import React from "react";

const LowerNavbar = () => (
    <nav aria-label="Main navigation"
         className="navbar navbar-expand-md navbar-light bg-light bg-gradient sticky-top shadow-sm"
         id="secondNavbarConsumer">
        <div className="container-fluid">
            <button aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation"
                    className="navbar-toggler"
                    data-bs-target="#navbarNav" data-bs-toggle="collapse" type="button">
                        <span className="navbar-toggler-icon">

                        </span>
            </button>

            <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                <ul className="navbar-nav text-uppercase">
                    <li className="nav-item">
                        <Link className="nav-link" to={ROUTES.HOME}>Home</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to={ROUTES.ACCOUNT}>Account</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to={ROUTES.ADMIN}>Admin</Link>
                    </li>

                    <li className="nav-item">
                        <LogoutButton/>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
);

export default LowerNavbar;