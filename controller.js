import React from 'react';
import { useStack, useAnimation, useContextState } from './hooks';
import StackContext from './context';
import { AppScreenContainer, AppStackContainer } from './components';

export default function Controller({
  routes,
  rootNavigator,
  screenProps,
  overDrawElements,
  initialScreen,
  settings,
}) {
  const controller = useStack({
    routes,
    rootNavigator,
    initialScreen,
  });

  const animator = useAnimation(settings?.transitionDuration);

  const contextState = useContextState();

  function pop() {
    if (animator.isAnimationRunning.current) {
      return;
    }

    if (controller.isLastScreen()) {
      controller.rootPop();
    } else {
      animator.animate(controller.currentStack.current.length - 2, () => {
        controller.pop();
      });
    }
  }

  function push(screen, params) {
    if (animator.isAnimationRunning.current) {
      return;
    }

    controller.push(screen, params, pop, (callback) => {
      const toValue = controller.currentStack.current.length - 1;
      animator.fixAnimatedValue(toValue);
      animator.animate(toValue);
    });
  }

  function getProps(item) {
    return {
      navigator: {
        Navigate: push,
        GoBack: pop,
        params: item.params,
        staticProps: routes[item.screenKey].staticProps,
        screenProps,
      },
    };
  }

  function getContextValue() {
    return [push, pop, contextState.values, contextState.setValue];
  }

  function getAnimatedStyles(item, index) {
    const length = controller.currentStack.current.length;
    const isLast = index === length - 1;

    if (item.params?.noAnimation && isLast) {
      return;
    }

    if (settings?.configureTransitions) {
      return settings.configureTransitions(
        index,
        controller.currentStack.current.length,
        animator.animatedValue.current
      );
    }

    return animator.getDefaultAnimations(
      index,
      controller.currentStack.current.length
    );
  }

  function renderStack() {
    return controller.currentStack.current.map((item, index) => {
      let Screen = routes[item.screenKey];
      return (
        <AppScreenContainer
          key={index}
          animatedStyles={getAnimatedStyles(item, index)}>
          <Screen key={item.screenKey} {...getProps(item)} />
        </AppScreenContainer>
      );
    });
  }

  return (
    <StackContext.Provider value={getContextValue()}>
      <AppStackContainer>{renderStack()}</AppStackContainer>

      {overDrawElements?.map((Item, index) => {
        return <Item key={index} />;
      })}
    </StackContext.Provider>
  );
}
