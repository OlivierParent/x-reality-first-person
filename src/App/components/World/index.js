import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "react-three-fiber";
import { Box, Plane, PointerLockControls } from "@react-three/drei";
import { useControl } from "react-three-gui";
import { KeyboardControls } from "App/lib";

const MOVE_SPEED = 0.1;

export default () => {
  const enablePointerLockControls = useControl("PointerLock Controls", {
    group: "Controls",
    type: "boolean",
    value: true,
  });

  const pointerLockControlsRef = useRef();

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
  }, []);

  useFrame(() => {
    if (pointerLockControlsRef.current) {
      pointerLockControlsRef.current.moveForward(
        MOVE_SPEED * KeyboardControls.forwardDirection
      );
      pointerLockControlsRef.current.moveRight(
        MOVE_SPEED * KeyboardControls.rightDirection
      );
      pointerLockControlsRef.current.getObject().position.y +=
        MOVE_SPEED * KeyboardControls.upDirection; // m
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
      <Box>
        <meshBasicMaterial />
      </Box>
    </>
  );
};
