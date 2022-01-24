import { Keyboard } from "./Keyboard";
import { DefaultXRControllers, VRCanvas } from "@react-three/xr";
import { Level } from "./Level";
import { OrbitControls } from "@react-three/drei";

function App() {
  return (
    <VRCanvas camera={{ position: [0, 0, 0] }}>
      <color attach="background" args={["grey"]} />
      <ambientLight intensity={1} />
      <Level />
      <Keyboard />
      <DefaultXRControllers />
      {/* I'm leaving the orbitcontrols /w other target in for demo purposes */}
      <OrbitControls target={[0, 0, -2]} />
    </VRCanvas>
  );
}

export default App;
