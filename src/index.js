import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'tachyons';
import './index.css';

ReactDOM.render(<React.StrictMode>
                    <App/>
                </React.StrictMode>, document.getElementById('root'));

reportWebVitals();