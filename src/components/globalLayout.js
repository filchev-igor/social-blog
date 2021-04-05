import React from "react";

export const ContainerFluid = props => (
    <div className="container-fluid py-5 min-vh-100 bg-white">
        {props.children}
    </div>
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