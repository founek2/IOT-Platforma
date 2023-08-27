import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
// import reportWebVitals from './reportWebVitals';
console.log("App", App)
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ErrorBoundary } from './components/ErrorBoundary.js';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <ErrorBoundary
        onError={() => {
            localStorage.clear();
            document.location.reload();
        }}
        actionText="Odhlásit a restartovat rozhraní"
    >
        <App />
    </ErrorBoundary>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
