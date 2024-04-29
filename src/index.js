import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { ProSidebarProvider } from "react-pro-sidebar";



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
  <React.StrictMode>
  <ProSidebarProvider>
    <Router>
  
      <App />
     
    </Router>
    </ProSidebarProvider>
  </React.StrictMode>
  </Provider>
);

// reportWebVitals code...
