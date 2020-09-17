import React, { Fragment } from "react";
import spinner from "./spinner.gif";

export default () => (
  <Fragment>
    <img
      src={spinner}
      style={{
        width: "200px",
        margin: "0",
        position: "absolute",
        top: "40%",
        left: "45%",
        display: "block",
      }}
      alt="Loading..."
    />
  </Fragment>
);
