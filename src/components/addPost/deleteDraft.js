import {DELETE_DRAFT} from "../../constants";
import React, {useState} from "react";

const DeleteDraft = ({handleDraftDelete, isInvisible}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            className={`btn btn-outline-danger ${isInvisible ? "invisible" : ""}`}
            onClick={handleDraftDelete}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <i className={`bi bi-trash2${isHovered ? "-fill" : ""}`}>

            </i>
            {" " + DELETE_DRAFT}
        </button>
    );
};

export default DeleteDraft;