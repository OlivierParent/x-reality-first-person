import React, { useEffect, useRef } from "react";
import { useFrame } from "react-three-fiber";
import {
  FlyControls,
  OrbitControls,
  PointerLockControls,
  Stats,
} from "@react-three/drei";
import { useControl } from "react-three-gui";
import { World } from "App/components";
import { KeyboardControls } from "App/utils";

export default () => {
  const enableFlyControls = useControl("Fly Controls", {
    group: "General",
    type: "boolean",
    value: false,
  });
  const enableOrbitControls = useControl("Orbit Controls", {
    group: "General",
    type: "boolean",
    value: false,
  });
  const enablePointerLockControls = useControl("PointerLock Controls", {
    group: "General",
    type: "boolean",
    value: false,
  });
  const showStats = useControl("Statistics", {
    group: "General",
    type: "boolean",
    value: false,
  });
  const showAxesHelper = useControl("Axes Helper", {
    group: "Helpers",
    type: "boolean",
    value: false,
  });
  const showGridHelper = useControl("Grid Helper", {
    group: "Helpers",
    type: "boolean",
    value: false,
  });

  const pointerLockControlsRef = useRef();

  useEffect(() => {
    KeyboardControls.addEventListeners();

    if (pointerLockControlsRef.current) {
      pointerLockControlsRef.current.getObject().position.y = 1;
    }

    return KeyboardControls.removeEventListeners;
  });

  useFrame(() => {
    if (pointerLockControlsRef.current) {
      pointerLockControlsRef.current.moveForward(
        KeyboardControls.MOVE_SPEED * KeyboardControls.forwardDirection
      );
      pointerLockControlsRef.current.moveRight(
        KeyboardControls.MOVE_SPEED * KeyboardControls.rightDirection
      );
    }
  });

  return (
    <>
      <>
        {enableFlyControls && (
          <FlyControls
            autoForward={false}
            dragToLook={true}
            movementSpeed={1.0}
            rollSpeed={0.005}
          />
        )}
        {enableOrbitControls && (
          <OrbitControls
            enablePan={true}
            enableRotate={true}
            enableZoom={true}
          />
        )}
        {enablePointerLockControls && (
          <PointerLockControls ref={pointerLockControlsRef} />
        )}
        {showStats && <Stats />}
        {showAxesHelper && <axesHelper />}
        {showGridHelper && <gridHelper args={[10, 10, 0xffffff, 0x333333]} />}
      </>
      <World />
    </>
  );
};
