import * as CANNON from "cannon-es";
import * as THREE from "three";
import cannonDebugger from "cannon-es-debugger";

const BOX_SIZE = 0.5; // m
const GRAVITATIONAL_ACCELERATION = 9.80665; // m/s^2
const VELOCITY = {
  FORWARD_DIRECTION: 3,
  RIGHT_DIRECTION: 1,
};

class PhysicsEnvironment {
  static #bodies = [];
  static #controls;
  static #groundBody;
  static #physicsMaterial1 = new CANNON.Material("physicsMaterial1");
  static #physicsContactMaterial;
  static #playerBody;
  static #time;
  static #world = new CANNON.World();

  static get player() {
    return this.#playerBody;
  }

  /**
   * Add a physics box
   *
   * @param {CANNON.Vec3} dimensions
   * @param {CANNON.Vec3} position
   * @param {number} mass
   * @return {number} index of body
   */
  static addBox(
    dimensions = new CANNON.Vec3(BOX_SIZE, BOX_SIZE, BOX_SIZE),
    mass = 1,
    position = new CANNON.Vec3(0, 0, 0)
  ) {
    console.log("PhysicsEnvironment: addBox", dimensions, mass, position);
    const shape = new CANNON.Box(dimensions);
    const body = new CANNON.Body({ mass, position, shape });
    this.#world.addBody(body);
    const arrayLength = this.#bodies.push(body);
    return arrayLength - 1;
  }

  /**
   * Cannon.js Debugger
   *
   * @param {THREE.scene} scene
   */
  static debug(scene) {
    cannonDebugger(scene, this.#bodies);
  }

  /**
   * Initialize physics engine
   */
  static init(controls) {
    this.#controls = controls;
    this.#time = Date.now();
    this.initWorld();
    this.initMaterial();
    this.initGround();
    this.initPlayer();
  }

  /**
   * Initialize ground
   */
  static initGround() {
    console.info("PhysicsEnvironment: initGround");
    const mass = 0;
    const shape = new CANNON.Plane();
    this.#groundBody = new CANNON.Body({ mass, shape });
    this.#groundBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      THREE.MathUtils.degToRad(-90)
    );
    this.#world.addBody(this.#groundBody);
    this.#bodies.push(this.#groundBody);

    // stairs
    const angle = THREE.MathUtils.degToRad(-90 + 35);
    const vector = new CANNON.Vec3(1, 0, 0);
    const stairsShape = new CANNON.Box(new CANNON.Vec3(1 / 2, 10 / 2, 0.1));
    const stairsBody = new CANNON.Body({ mass, shape: stairsShape });
    stairsBody.quaternion.setFromAxisAngle(vector, angle);
    this.#world.addBody(stairsBody);
    this.#bodies.push(stairsBody);
  }

  /**
   * Initialize material
   */
  static initMaterial() {
    console.info("PhysicsEnvironment: initMaterial");
    this.#physicsContactMaterial = new CANNON.ContactMaterial(
      PhysicsEnvironment.#physicsMaterial1,
      PhysicsEnvironment.#physicsMaterial1
    );
    this.#world.addContactMaterial(this.#physicsContactMaterial);
  }

  /**
   * Initialize player
   */
  static initPlayer() {
    console.info("PhysicsEnvironment: initPlayer");
    const mass = 75; // kg
    const position = new CANNON.Vec3(0, 5, 2);
    const shape = new CANNON.Sphere(BOX_SIZE);
    const body = new CANNON.Body({ mass, position, shape });
    this.#bodies.push(body);
    this.#playerBody = body;
    this.#world.addBody(body);
  }

  /**
   * Initialize world
   */
  static initWorld() {
    console.info("PhysicsEnvironment: initWorld");
    this.#world.gravity.set(0, -GRAVITATIONAL_ACCELERATION, 0);
    this.#world.broadphase = new CANNON.NaiveBroadphase();
  }

  /**
   * Simulation step
   */
  static simulate() {
    const time = Date.now();
    const deltaT = (time - this.#time) / 1000; // s

    const velocity = new THREE.Vector3(
      this.#controls.rightDirection * VELOCITY.RIGHT_DIRECTION,
      this.#playerBody.velocity.y,
      this.#controls.forwardDirection * -VELOCITY.FORWARD_DIRECTION
    ).applyQuaternion(this.#playerBody.quaternion);
    this.#playerBody.velocity.x = velocity.x;
    this.#playerBody.velocity.z = velocity.z;

    this.#world.step(deltaT);
    this.#time = time;
  }
}

export default PhysicsEnvironment;
