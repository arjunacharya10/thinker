import * as React from 'react';
import ReactDom from 'react-dom/client';
import App from "./app"

const root = ReactDom.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);