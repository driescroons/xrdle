import { Keyboard } from "./Keyboard";
import { DefaultXRControllers, VRCanvas } from "@react-three/xr";
import { Level } from "./Level";
import { useStore } from "./store";

function App() {
  const set = useStore((store) => store.set);

  if (process.env.NODE_ENV === "development") {
    window.addGuess = (guess) => {
      set((store) => {
        if (store.guesses.length > 0) {
          store.guesses[store.guesses.length - 1] = guess;
        } else {
          store.guesses.push(guess);
        }
        store.guesses.push("");
      });
    };
  }

  return (
    <VRCanvas camera={{ position: [0, 0, 0] }}>
      <color attach="background" args={["grey"]} />
      <ambientLight intensity={1} />
      <Level />
      <Keyboard position={[0, 1.5, -0.3]} />\
      <DefaultXRControllers />
    </VRCanvas>
  );
}

export default App;
