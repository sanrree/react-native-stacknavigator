import { useState, useRef, useEffect } from 'react';
import { BackHandler } from 'react-native';
import { StackScreen } from '../data';

const BackHandlerListeners = {
  PopCallbacks: [],
};

function useStack(parameters) {
  const currentStack = useRef([]);

  const _parameters = useRef(parameters);

  const _rootNavigator = useRef(null);

  const _routes = useRef(null);

  const [currentScreen, setCurrentScreen] = useState(_configure());

  const _shouldEraseStack = useRef(false);

  const _afterPushEvent = useRef(null);

  useEffect(() => {
    if (_afterPushEvent.current) {
      _afterPushEvent.current();
      if (_shouldEraseStack.current) {
        const _Pops = BackHandlerListeners.PopCallbacks;
        _Pops.slice(0, _Pops.length - 1).forEach((action) => {
          BackHandler.removeEventListener('hardwareBackPress', action);
        });
        _Pops.splice(0, _Pops.length - 1);

        const _currentStack = currentStack.current;
        currentStack.current = [_currentStack[_currentStack.length - 1]];
      }
      _afterPushEvent.current = null;
    }
  }, [currentScreen]);

  function _configure() {
    if (_routes.current != null) {
      return;
    }

    const { initialScreen, routes, rootNavigator } = _parameters.current;

    _routes.current = routes;
    _rootNavigator.current = rootNavigator;

    let _initialScreen;

    if (_is_screen_undefined(initialScreen)) {
      _initialScreen = new StackScreen({
        screenKey: Object.keys(routes)[0],
      });
    } else {
      _initialScreen = new StackScreen({
        screenKey: initialScreen,
      });
    }

    currentStack.current = [_initialScreen];

    return _initialScreen.screenKey;
  }

  function _is_screen_undefined(screen) {
    const _exists = _routes.current[screen] === undefined;
    return _exists;
  }

  function push(screen, params, popCallback, afterPushEvent) {
    const _is_current = screen === currentScreen;
    const _is_undefined = _is_screen_undefined(screen);

    if (_is_undefined) {
      if (_rootNavigator.current) {
        _rootNavigator.Navigate(screen, params);
      }
      return;
    } else if (_is_current) {
      return;
    }

    const _Pops = BackHandlerListeners.PopCallbacks;

    const length = _Pops.push(async () => popCallback());
    BackHandler.addEventListener('hardwareBackPress', _Pops[length - 1]);

    const newScreen = new StackScreen({ screenKey: screen, params: params });

    currentStack.current.push(newScreen);

    _shouldEraseStack.current = params?.shouldEraseStack || false;

    _afterPushEvent.current = afterPushEvent;

    setCurrentScreen(screen);
  }

  function reset(callback) {
    let lastScreen = currentStack.current.pop();
    currentStack.current.push(currentStack.current[1]);
    currentStack.current[1] = lastScreen;

    while (currentStack.current.length !== 2) {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        BackHandlerListeners.PopCallbacks.pop()
      );

      currentStack.current.pop();
    }

    setCurrentScreen(
      currentStack.current[currentStack.current.length - 1].screenKey + '_reset'
    );
  }

  function pop() {
    if (isLastScreen()) {
      rootPop();
      return;
    }

    BackHandler.removeEventListener(
      'hardwareBackPress',
      BackHandlerListeners.PopCallbacks.pop()
    );

    currentStack.current.pop();

    setCurrentScreen(
      currentStack.current[currentStack.current.length - 1].screenKey
    );
  }

  function isLastScreen() {
    return currentStack.current.length <= 1;
  }

  function rootPop() {
    if (_rootNavigator.current) {
      _rootNavigator.current.GoBack();
    } else {
      BackHandler.exitApp();
    }
  }

  function dropHistory() {
    const _Pops = BackHandlerListeners.PopCallbacks;
    _Pops.slice(0, _Pops.length - 1).forEach((action) => {
      BackHandler.removeEventListener('hardwareBackPress', action);
    });
    _Pops.splice(0, _Pops.length - 1);

    const _currentStack = currentStack.current;
    currentStack.current = [_currentStack[_currentStack.length - 1]];
  }

  return {
    push,
    pop,
    reset,
    isLastScreen,
    rootPop,
    dropHistory,
    currentStack,
    currentScreen,
  };
}

export default useStack;
