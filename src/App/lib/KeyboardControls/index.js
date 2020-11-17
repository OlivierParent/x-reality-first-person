const QWERTY = {
  LEFT: "KeyA",
  UP: "KeyW",
};
const AZERTY = {
  LEFT: "KeyQ",
  UP: "KeyZ",
};

class KeyboardControls {
  static #keyboard = QWERTY;
  static #DIRECTION = {
    BACK: -1,
    DOWN: -1,
    FORWARD: 1,
    LEFT: -1,
    NONE: 0,
    RIGHT: 1,
    UP: 1,
  };

  static #forwardDirection = KeyboardControls.#DIRECTION.NONE;
  static #rightDirection = KeyboardControls.#DIRECTION.NONE;
  static #upDirection = KeyboardControls.#DIRECTION.NONE;

  static get forwardDirection() {
    return KeyboardControls.#forwardDirection;
  }

  static get rightDirection() {
    return KeyboardControls.#rightDirection;
  }

  static get upDirection() {
    return KeyboardControls.#upDirection;
  }

  static keyDownHandler(event) {
    console.log("KeyboardControls: keyDownHandler", `'${event.code}'`);
    switch (event.code) {
      case "ArrowDown":
      case "KeyS":
        KeyboardControls.#forwardDirection = KeyboardControls.#DIRECTION.BACK;
        break;
      case "ArrowLeft":
      case "KeyA":
      case KeyboardControls.#keyboard.LEFT:
        KeyboardControls.#rightDirection = KeyboardControls.#DIRECTION.LEFT;
        break;
      case "ArrowRight":
      case "KeyD":
        KeyboardControls.#rightDirection = KeyboardControls.#DIRECTION.RIGHT;
        break;
      case "ArrowUp":
      case KeyboardControls.#keyboard.UP:
        KeyboardControls.#forwardDirection =
          KeyboardControls.#DIRECTION.FORWARD;
        break;
      case "KeyF":
        KeyboardControls.#upDirection = KeyboardControls.#DIRECTION.DOWN;
        break;
      case "KeyR":
        KeyboardControls.#upDirection = KeyboardControls.#DIRECTION.UP;
        break;
    }
  }

  static keyUpHandler(event) {
    console.log("KeyboardControls: keyUpHandler", `'${event.code}'`);
    switch (event.code) {
      case "ArrowDown":
      case "ArrowUp":
      case "KeyS":
      case KeyboardControls.#keyboard.UP:
        KeyboardControls.#forwardDirection = KeyboardControls.#DIRECTION.NONE;
        break;
      case "ArrowLeft":
      case "ArrowRight":
      case "KeyD":
      case KeyboardControls.#keyboard.LEFT:
        KeyboardControls.#rightDirection = KeyboardControls.#DIRECTION.NONE;
        break;
      case "KeyF":
      case "KeyR":
        KeyboardControls.#upDirection = KeyboardControls.#DIRECTION.NONE;
        break;
    }
  }

  static addEventListeners() {
    console.info("KeyboardControls: addEventListeners");
    window.addEventListener("keydown", KeyboardControls.keyDownHandler);
    window.addEventListener("keyup", KeyboardControls.keyUpHandler);
  }

  static removeEventListeners() {
    console.info("KeyboardControls: removeEventListeners");
    window.removeEventListener("keydown", KeyboardControls.keyDownHandler);
    window.removeEventListener("keyup", KeyboardControls.keyUpHandler);
  }

  static setKeyboardAzerty() {
    KeyboardControls.#keyboard = AZERTY;
  }

  static setKeyboardQwerty() {
    KeyboardControls.#keyboard = QWERTY;
  }
}

export default KeyboardControls;
