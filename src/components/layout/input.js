import React from "react";

const Input = props => {
    const {
        type = "text",
        value,
        placeholder,
        onChange
    } = props;

    const generateId = () => {
        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 9 characters
        // after the decimal.
        return '_' + Math.random().toString(36).substr(2, 9);
    };

    const id = generateId();

    const handleChange = e => onChange(e.target.value);

    return (
        <div className="mb-3 form-floating">
            <input
                type={type}
                className="form-control"
                id={id}
                value={value}
                onChange={handleChange}
                onPaste={handleChange}
                placeholder={placeholder}/>

            <label htmlFor={id}>{placeholder}</label>
        </div>
    );
};

export default Input;