import React from "react";

const Input = props => {
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

        <input type={type} className="form-control" id={id} value={value} onChange={handleChange} placeholder={placeholder} />
        </>
};

export default Input;