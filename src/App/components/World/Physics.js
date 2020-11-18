import React, { useEffect, useRef } from "react";
import * as CANNON from "cannon-es";
import * as THREE from "three";
import { useFrame, useThree } from "react-three-fiber";
import { Plane, PointerLockControls, Sphere } from "@react-three/drei";
import { KeyboardControls, PhysicsEnvironment } from "App/lib";

const BOX_SIZE = 0.5;
const NUMBER_OF_BOXES = 10;
const PLANE_SIZE = 10;
const RANDOM_COORDINATES = new Array(NUMBER_OF_BOXES).fill(null).map(() => {
  const x = Math.floor(Math.random() * PLANE_SIZE - PLANE_SIZE / 2);
  const y = BOX_SIZE;
  const z = Math.floor(Math.random() * PLANE_SIZE - PLANE_SIZE / 2);

  return [x, y, z];
});

export default (props) => {
  const pointerRef = useRef();
  const { scene } = useThree();

  let boxes = new Array(NUMBER_OF_BOXES).fill(null).map((box, index) => {
    const position = RANDOM_COORDINATES[index];
    const ref = useRef();

    return { position, ref };
  });

  useEffect(() => {
    console.info("useEffect: KeyboardControls");
    KeyboardControls.addEventListeners();
    // KeyboardControls.setKeyboardAzerty();

    return KeyboardControls.removeEventListeners;
  }, []);

  useEffect(() => {
    console.info("useEffect: PhysicsEnvironment");
    PhysicsEnvironment.init(KeyboardControls);
    PhysicsEnvironment.debug(scene);
    const dimensions = new CANNON.Vec3(BOX_SIZE, BOX_SIZE, BOX_SIZE);
    const mass = 0; // kg
    boxes.forEach((box) => {
      const position = new CANNON.Vec3(...box.position);
      PhysicsEnvironment.addBox(dimensions, mass, position);
    });
  }, []);

  useFrame(() => {
    const camera = pointerRef.current.getObject();
    const player = PhysicsEnvironment.player;

    player.quaternion.copy(camera.quaternion);

    camera.position.copy(player.position);
    camera.position.y += 1.25; // 1,75 m

    PhysicsEnvironment.simulate();
  });

  return (
    <>
      <PointerLockControls ref={pointerRef} />
      <Plane
        args={[PLANE_SIZE, PLANE_SIZE]}
        rotation={[THREE.MathUtils.degToRad(-90), 0, 0]}
        {...props}
      >
        <meshBasicMaterial color={0x666666} side={THREE.DoubleSide} />
      </Plane>
      {boxes.map((box, index) => {
        console.log("Box:", index);
        return (
          <Sphere
            args={[BOX_SIZE, 32, 32]}
            key={index}
            position={box.position}
            ref={box.ref}
          >
            <meshBasicMaterial color={0xffffff * Math.random()} />
          </Sphere>
        );
      })}
    </>
  );
};
