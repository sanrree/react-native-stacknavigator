import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

export default ({ children, animatedStyles }) => (
  <Animated.View style={[styles.screenContainer, animatedStyles]}>
    {children}
  </Animated.View>
);
