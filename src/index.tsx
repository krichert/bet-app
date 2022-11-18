import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { initializeApp } from 'firebase/app';

import { store } from './app/store';
import App from './App';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const container = document.getElementById('root')!;
const root = createRoot(container);

const firebaseConfig = {
    apiKey: "AIzaSyDenYwj-TloeeKvNK-ouK4fyifQqogq1vY",
    authDomain: "bet-app-fd3b8.firebaseapp.com",
    databaseURL: "https://bet-app-fd3b8.firebaseio.com",
    projectId: "bet-app-fd3b8",
    storageBucket: "bet-app-fd3b8.appspot.com",
    messagingSenderId: "362708928041",
    appId: "1:362708928041:web:15a52d2b1ff429c515be38"
};

initializeApp(firebaseConfig);

root.render(
  <React.StrictMode>
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
