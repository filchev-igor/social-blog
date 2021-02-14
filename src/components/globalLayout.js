import React from "react";
import logo from "../img/logo.png";

export const ContainerFluid = props => (
    <div className="container-fluid py-5 min-vh-100 bg-white">
        {props.children}
    </div>
);

export const NavbarTop = () => (
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

export const SingleColumn = props => (
    <div className="row justify-content-center">
        <div className="col col-sm-9 col-md-8 col-lg-8 col-xl-8 col-xxl-8">
            <div className="card">
                <div className="card-body">{props.children}</div>
            </div>
        </div>
    </div>
);

export const LabeledInput = props => {
    const {
        type,
        id,
        value,
        placeholder,
        onChange
    } = props;

    const handleChange = e => onChange(e.target.value);

    return <>
        <label htmlFor={id} className="form-label">

        </label>
        <input type={type} className="form-control" id={id} value={value} onChange={handleChange}
               placeholder={placeholder}/>
    </>;
};