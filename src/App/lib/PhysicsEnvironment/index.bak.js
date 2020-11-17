import * as CANNON from "cannon-es";
import * as THREE from "three";
import cannonDebugger from "cannon-es-debugger";
import KeyboardControls from "../KeyboardControls";

const GRAVITATIONAL_ACCELERATION = 9.80665; // m/s^2

class PhysicsEnvironment {
  static #bodies = [];
  static #controls;
  static #directionVector = new CANNON.Vec3(0, 0, 0);
  static #groundBody;
  static #physicsMaterial1 = new CANNON.Material("physicsMaterial1");
  static #playerBody;
  static #time;
  static #world = new CANNON.World();

  static get player() {
    return PhysicsEnvironment.#playerBody;
  }

  static set directionVector(directionThreeQuat) {
    const force = 3;
    const xForce = PhysicsEnvironment.#controls.rightDirection * 1;
    const yForce = 0;
    const zForce = -PhysicsEnvironment.#controls.forwardDirection * force;
    const forceThreeVec = new THREE.Vector3(xForce, yForce, zForce);
    const { x, y, z } = forceThreeVec.applyQuaternion(directionThreeQuat);

    PhysicsEnvironment.#directionVector = new CANNON.Vec3(x, y, z);
  }

  /**
   * Initialize physics engine.
   */
  static init(controls) {
    PhysicsEnvironment.#controls = controls;
    PhysicsEnvironment.#time = Date.now(); // ms
    PhysicsEnvironment.initWorld();
    PhysicsEnvironment.initGround();
    PhysicsEnvironment.initPlayer();
  }

  static debug(scene) {
    cannonDebugger(scene, this.#world.bodies);
  }

  /**
   * Add a box.
   *
   * @param {CANNON.Vec3} dimensions
   * @param {CANNON.Vec3} position
   * @param {number} mass
   * @return {number} index of body
   */
  static addBox(
    dimensions = new CANNON.Vec3(1, 1, 1),
    mass = 1,
    position = new CANNON.Vec3(0, 0, 0)
  ) {
    console.log("PhysicsEnvironment: initGround", dimensions, mass, position);
    const shape = new CANNON.Box(dimensions);
    const body = new CANNON.Body({ mass, shape, position });
    PhysicsEnvironment.#world.addBody(body);
    const arrayLength = PhysicsEnvironment.#bodies.push(body);
    return arrayLength - 1;
  }

  /**
   * initialize ground.
   */
  static initGround() {
    console.info("PhysicsEnvironment: initGround");
    const mass = 0;
    const shape = new CANNON.Plane();
    PhysicsEnvironment.#groundBody = new CANNON.Body({ mass, shape });
    PhysicsEnvironment.#groundBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      THREE.MathUtils.degToRad(-90)
    );
    PhysicsEnvironment.#world.addBody(PhysicsEnvironment.#groundBody);
    const stairsShape = new CANNON.Box(new CANNON.Vec3(1 / 2, 10 / 2, 0.1));
    const stairsBody = new CANNON.Body({ mass: 0, shape: stairsShape });
    PhysicsEnvironment.#world.addBody(stairsBody);
    stairsBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      THREE.MathUtils.degToRad(-80 + 180)
    );
  }

  /**
   * Initialize material.
   */
  static initMaterial() {
    console.info("PhysicsEnvironment: initMaterial");
    const physicsContactMaterial = new CANNON.ContactMaterial(
      PhysicsEnvironment.#physicsMaterial1,
      PhysicsEnvironment.#physicsMaterial1,
      0.0,
      0.3
    );
    this.#world.addContactMaterial(physicsContactMaterial);
  }

  /**
   * Initialize player
   */
  static initPlayer() {
    console.info("PhysicsEnvironment: initPlayer");
    const mass = 5;
    const shape = new CANNON.Sphere(1);
    PhysicsEnvironment.#playerBody = new CANNON.Body({ mass, shape });
    PhysicsEnvironment.#playerBody.position.set(0, 5, 2);
    PhysicsEnvironment.#world.addBody(PhysicsEnvironment.#playerBody);
  }

  /**
   * Initialize world.
   */
  static initWorld() {
    console.info("PhysicsEnvironment: initWorld");
    PhysicsEnvironment.#world.gravity.set(0, -GRAVITATIONAL_ACCELERATION, 0);
    PhysicsEnvironment.#world.broadphase = new CANNON.NaiveBroadphase();
  }

  /**
   *
   * @param {DateTime} time
   */
  static simulate(time) {
    const deltaT = (time - PhysicsEnvironment.#time) / 1000; // s
    PhysicsEnvironment.#playerBody.velocity.x =
      PhysicsEnvironment.#directionVector.x;
    PhysicsEnvironment.#playerBody.velocity.z =
      PhysicsEnvironment.#directionVector.z;
    PhysicsEnvironment.#world.step(deltaT);
    PhysicsEnvironment.#time = time;
  }
}

export default PhysicsEnvironment;
