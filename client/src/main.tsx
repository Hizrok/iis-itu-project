// @author Tomáš Vlach

import { CssBaseline } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { AuthProvider } from 'react-auth-kit';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    {/* AuthProvider for hadling JWT tokes and user information */}
    <AuthProvider authType={'cookie'}
                  authName={'_auth'}
                  cookieDomain={window.location.hostname}
                  cookieSecure={window.location.protocol === "https:"}>
      {/* Redux provider for cross page variables */}
      <Provider store={store}>
        <CssBaseline />
        <App />
      </Provider>
    </AuthProvider>
  </React.StrictMode>
);