interface IStackScreen {
  screenKey: String;
  params: Object;
}

class StackScreen implements IStackScreen {
  screenKey: String;
  params: Object;

  constructor(stackScreen: IStackScreen) {
    this.screenKey = stackScreen.screenKey;
    this.params = stackScreen.params;
  }
}

export default StackScreen;
