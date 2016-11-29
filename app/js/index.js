import ReactDOM from "react-dom";
import React from "react";

import App from "./components/App.jsx";

const mountNode = document.querySelector(".js-mount");


ReactDOM.render(
    <App />,
    mountNode
);
