//For snacking purposes
import React from 'react';
import { View, Text, Button, StyleSheet, Animated } from 'react-native';
import createStackController, { useController } from './index';

function Page() {
  const { push, pop, showPopup } = useController();

  return (
    <View>
      <Button title="navigate" onPress={() => push('Page1')} />
      <Button title="popup" onPress={() => showPopup('Page2')} />
      <Button title="go back" onPress={pop} />
    </View>
  );
}

const routes = {
  Page1: Page,
  Page2: Page,
  Page3: Page,
};

function Popup({ children, animatedValue, index }) {
  const backgroundAnimStyle = {
    opacity: animatedValue.interpolate({
      inputRange: [index - 1, index],
      outputRange: [0, 0.8],
    }),
  };
  const contentAnimStyle = {
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [index - 1, index],
          outputRange: [150, 0],
        }),
      },
       {
        scale: animatedValue.interpolate({
          inputRange: [index - 1, index],
          outputRange: [0.6, 1],
        }),
      },
    ],
    opacity: animatedValue.interpolate({
      inputRange: [index - 1, index],
      outputRange: [0, 0.8],
    }),
  };
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '100%',
            backgroundColor: '#000',
          },
          backgroundAnimStyle,
        ]}
      />
      <Animated.View
        style={[{ padding: 10, backgroundColor: '#fff' }, contentAnimStyle]}>
        {children}
      </Animated.View>
    </View>
  );
}

const settings = {
  containers: {
    showPopup: {
      container: Popup,
      configureTransitions: () => null,
      noAnimation: true,
      animationConfig: {
        duration: 300,
      },
    },
  },
};

const styles = StyleSheet.create({});

const Stack = createStackController(routes, settings);

export default function App() {
  return <Stack />;
}
