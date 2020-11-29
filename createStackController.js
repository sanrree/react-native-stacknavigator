import React from 'react';
import Controller from './controller';

export default function createStackController(routes, settings) {
  const Stack = (props) => {
    return (
      <Controller
        routes={routes}
        settings={settings}
        rootNavigator={props.navigator}
      />
    );
  };
  return Stack;
}
