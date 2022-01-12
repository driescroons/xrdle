import { Canvas } from "@react-three/fiber"
import {OrbitControls, RoundedBox, Text} from '@react-three/drei'
import { DoubleSide, MathUtils } from "three"
import { useStore } from "./store";
import { useCallback, useEffect, useMemo } from "react";
import { Keyboard } from "./Keyboard";
import { DefaultXRControllers, VRCanvas } from "@react-three/xr";
import { Level } from "./Level";

function App() {
  return (
    <VRCanvas>
      <color attach="background" args={['grey']} />
      <ambientLight intensity={1} />
      <Level />
      <Keyboard position={[0, 1.5, -.3]} />\
      <DefaultXRControllers />
    </VRCanvas>
  )
}

export default App
