import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "react-three-fiber";
import { Box, Plane, Sphere, PointerLockControls } from "@react-three/drei";
import { useControl } from "react-three-gui";
import { KeyboardControls } from "App/lib";
import { PhysicsEnvironment } from "App/lib";
import * as CANNON from "cannon-es";

const NUMBER_OF_CUBES = 10;
const RANDOM_COORDINATES = new Array(NUMBER_OF_CUBES).fill(null).map(() => {
  const range = 10;
  const size = 1;
  return [
    Math.floor(Math.random() * range - range / 2), // left to right
    size / 2, //size / 2, //down to up
    Math.floor(Math.random() * range - range / 2), // back to front
  ];
});

export default () => {
  console.log("Physics");
  const enablePointerLockControls = useControl("PointerLock Controls", {
    group: "Controls",
    type: "boolean",
    value: true,
  });
  const pointerLockControlsRef = useRef();
  const { scene } = useThree();

  let boxes = new Array(NUMBER_OF_CUBES).fill(null).map((box, index) => {
    const position = RANDOM_COORDINATES[index];
    const ref = useRef();

    return { position, ref };
  });

  useEffect(() => {
    console.info("useEffect: KeyboardControls");
    KeyboardControls.addEventListeners();

    return KeyboardControls.removeEventListeners;
  }, []);

  useEffect(() => {
    console.info("useEffect: pointerLockControlsRef");
    if (pointerLockControlsRef.current) {
      pointerLockControlsRef.current.getObject().position.y = 1.75; // m
    }
  }, [enablePointerLockControls]);

  useEffect(() => {
    console.info("useEffect: PhysicsEnvironment");
    PhysicsEnvironment.init(KeyboardControls);
    PhysicsEnvironment.debug(scene);
    boxes.forEach((box) => {
      PhysicsEnvironment.addBox(
        new CANNON.Vec3(0.5, 0.5, 0.5),
        0, // mass in kg
        new CANNON.Vec3(box.position[0], box.position[1], box.position[2])
      );
    });
  }, []);

  useFrame(() => {
    if (pointerLockControlsRef.current) {
      // Match Player Direction to the Camera Direction.
      PhysicsEnvironment.player.quaternion.copy(
        pointerLockControlsRef.current.getObject().quaternion
      );

      // set the position of the camera to the player position.
      pointerLockControlsRef.current
        .getObject()
        .position.copy(PhysicsEnvironment.player.position);

      PhysicsEnvironment.simulate(Date.now());
    }
  });

  return (
    <>
      {enablePointerLockControls && (
        <PointerLockControls ref={pointerLockControlsRef} />
      )}
      <Plane args={[10, 10]} rotation={[THREE.MathUtils.degToRad(-90), 0, 0]}>
        <meshBasicMaterial color={0x666666} side={THREE.DoubleSide} />
      </Plane>
      {boxes.map((box, index) => {
        console.log("box:", index);
        return (
          <Sphere
            args={[0.5, 8, 8]}
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
