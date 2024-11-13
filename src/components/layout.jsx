"use client";

import { Provider } from 'react-redux';
import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import {  persistor, store } from '@/store/store';

const Layout = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
          {children}
      </PersistGate>
    </Provider>
  );
};

export default Layout;
