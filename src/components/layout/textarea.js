import React from "react";

const Textarea = props => {
    const {
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
        <div className="form-floating">
            <textarea
                className="form-control"
                id={id}
                onChange={handleChange}
                onPaste={handleChange}
                placeholder={placeholder}
                value={value}
                style={{height: "100px"}}>

            </textarea>

            <label htmlFor={id}>{placeholder}</label>
        </div>
    );
};

export default Textarea;