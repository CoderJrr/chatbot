import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';

import { store } from './store/store.js'; // RTK Query'nin entegre edildiği store

//store'u React bileşen ağacına “enjekte eder”.Böylece useSelector, useDispatch gibi Redux hook’ları kullanılabilir hale gelir
// Uygulama Redux Provider ile sarılır, tüm alt bileşenler store'a erişebilir.
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>  
      <App />
    </Provider>
  </React.StrictMode>
);
