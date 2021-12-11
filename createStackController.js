import React from 'react';
import Controller from './controller';

export default function createStackController(routes, settings) {
  const Stack = ({navigator,overDrawElements,belowDrawElements,initialScreen}) => {
    return (
      <Controller
        routes={routes}
        settings={settings}
        rootNavigator={navigator}
        overDrawElements={overDrawElements}
        belowDrawElements={belowDrawElements}
        initialScreen={initialScreen}
      />
    );
  };
  return Stack;
}
