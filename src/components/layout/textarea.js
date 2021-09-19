import React from "react";
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";

const Textarea = props => {
    const {
        value,
        placeholder,
        onChange,
        dataDragId
    } = props;

    const id = generateUniqueID();

    const handleChange = e => onChange(e.target.value);

    return (
        <div className="form-floating">
            <textarea
                className="form-control"
                id={id}
                data-drag-id={dataDragId}
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