import React from "react";
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";

const Input = props => {
    const {
        type = "text",
        value,
        placeholder,
        onChange
    } = props;

    const id = generateUniqueID();

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