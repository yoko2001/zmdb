import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { App } from './App';
import { Home } from './home/Home';
import { Admin } from './admin/Admin';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.Fragment>
        <CssBaseline />
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App />}>
                    <Route path='/' element={<Home />}>
                        <Route path='/organizations/:organizationId' element={<Home />} />
                    </Route>
                    <Route path='/admin' element={<Admin />}>
                        <Route path='/admin/:target' element={<Admin />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    </React.Fragment>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
