import React from "react";

const InputReadonly = props => {
    const {
        type,
        id,
        value,
        placeholder,
        onChange,
        onClick,
        readonly
    } = props;

    const handleChange = e => onChange(e.target.value);
    const handleClick = e => onClick(e.target.type);

    return <>
        <label htmlFor={id} className="form-label">

        </label>

        <input type={type} className="form-control" id={id} value={value} onChange={handleChange} onClick={handleClick}
               placeholder={placeholder} readOnly={readonly} />
    </>
};

export default InputReadonly;