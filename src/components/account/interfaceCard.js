import React from "react";
import ColorRadio from "./colorRadio";
import * as interfaceConst from "../../constants/interfaceStyles";
import ColorSchemeSwitcher from "./colorSchemeSwitcher";
import LikeButtons from "./likeButtons";

const InterfaceCard = ({interfaceStyle}) => {
    const title = interfaceStyle[0].toUpperCase() + interfaceStyle.slice(1);
    const collectionField = interfaceStyle
        .split(" ")
        .map((value, index) => {
            if (index) {
                return value[0].toUpperCase() + value.slice(1);
            }

            return value;
        })
        .join("");

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{title}</h5>

                {interfaceStyle !== interfaceConst.LIKE_BUTTONS &&
                <>
                    <h6 className="card-subtitle mb-2 text-muted">background</h6>
                    <div className="card-text">
                        <ColorRadio interfaceStyle={collectionField}/>
                    </div>
                </>}

                {(interfaceStyle === interfaceConst.UPPER_NAVBAR
                    || interfaceStyle === interfaceConst.LOWER_NAVBAR) &&
                <>
                    <h6 className="card-title my-2 text-muted">Color schemes</h6>

                    <div className="card-text">
                        <ColorSchemeSwitcher interfaceStyle={collectionField}/>
                    </div>
                </>}

                {interfaceStyle === interfaceConst.LOWER_NAVBAR &&
                <>
                    <h6 className="card-title my-2 text-muted">Logout button color</h6>

                    <div className="card-text">
                        <ColorRadio type="logoutButtonColor" interfaceStyle={collectionField}/>
                    </div>
                </>}

                {(interfaceStyle === interfaceConst.HOME_PAGE ||
                    interfaceStyle === interfaceConst.POST_PAGE) &&
                <>
                    <h6 className="card-title my-2 text-muted">Post background</h6>

                    <div className="card-text">
                        <ColorRadio type="cardColor" interfaceStyle={collectionField}/>
                    </div>
                </>}

                {(interfaceStyle !== interfaceConst.UPPER_NAVBAR &&
                    interfaceStyle !== interfaceConst.LOWER_NAVBAR &&
                    interfaceStyle !== interfaceConst.NEW_POST &&
                    interfaceStyle !== interfaceConst.LIKE_BUTTONS) &&
                <>
                    <h6 className="card-title my-2 text-muted">Text color</h6>

                    <div className="card-text">
                        <ColorRadio type="textColor" interfaceStyle={collectionField}/>
                    </div>
                </>}

                {interfaceStyle === interfaceConst.LIKE_BUTTONS &&
                <>
                    <h6 className="card-subtitle mb-2 text-muted">Like button</h6>
                    <div className="card-text">
                        <ColorRadio type="like.background" interfaceStyle={collectionField}/>
                    </div>
                    <div className="card-text">
                        <LikeButtons/>
                    </div>
                </>}
            </div>
        </div>
    );
};

export default InterfaceCard;