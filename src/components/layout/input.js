import React from "react";

const Input = props => {
    const {
        type = "text",
        id,
        value,
        placeholder,
        onChange
    } = props;

    const handleChange = e => onChange(e.target.value);

    return <div className="form-floating mb-3">
        <input
            type={type}
            className="form-control"
            id={id} value={value}
            onChange={handleChange}
            onPaste={handleChange}
            placeholder={placeholder}/>

        <label htmlFor={id}>{placeholder}</label>

        </div>
};

export default Input;