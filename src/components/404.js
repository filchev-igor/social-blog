import React from "react";

export const PageDoesNotExistColumn = props => (
    <div className="row justify-content-center">
        <div className="col col-sm-9 col-md-8 col-lg-8 col-xl-8 col-xxl-8 text-center">
            {props.children}
        </div>
    </div>
);