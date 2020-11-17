import React from "react";
import { FlyControls, OrbitControls, Stats } from "@react-three/drei";
import { useControl } from "react-three-gui";
import { World, WorldPhysics } from "App/components";

export default () => {
  const enableFlyControls = useControl("Fly Controls", {
    group: "Controls",
    type: "boolean",
    value: false,
  });
  const enableOrbitControls = useControl("Orbit Controls", {
    group: "Controls",
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
        {showStats && <Stats />}
        {showAxesHelper && <axesHelper />}
        {showGridHelper && <gridHelper args={[10, 10, 0xffffff, 0x333333]} />}
      </>
      {false && <World />}
      {true && <WorldPhysics />}
    </>
  );
};
