import { Keyboard } from "./Keyboard";
import { DefaultXRControllers, VRCanvas } from "@react-three/xr";
import { Level } from "./Level";

function App() {
  return (
    <VRCanvas camera={{position: [0, 0, 0 ]}}>
      <color attach="background" args={['grey']} />
      <ambientLight intensity={1} />
      <Level />
      <Keyboard position={[0, 1.5, -.3]} />\
      <DefaultXRControllers />
    </VRCanvas>
  )
}

export default App
