import React from 'react';
import { StatusBar } from 'react-native';
import Navigation from './app/appNavigation/Navigation';

export default App = () => {
  return (
    <>
    <StatusBar translucent backgroundColor={'transparent'} barStyle={'dark-content'} />
    <Navigation />
    </>
  );
};
