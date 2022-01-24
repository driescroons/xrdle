import { a, easings, useSpring } from "@react-spring/three";
import {
  colors,
  letterDimensions,
  letterPadding,
  rowAmount,
} from "./constants";
import { useStore } from "./store";

export default function Indicator({ position }) {
  const guesses = useStore((store) => store.guesses);
  const answer = useStore((store) => store.answer);

  const spring = useSpring({
    position: [
      -letterDimensions[0] * letterPadding,
      -((guesses.length - 1) % rowAmount) * letterDimensions[1] * letterPadding,
      0,
    ],
    opacity: guesses.length >= rowAmount || guesses.includes(answer) ? 0 : 1,
    config: {
      easing: easings.easeInOutSine,
      duration: 500,
    },
  });

  return (
    <group position={position}>
      <a.mesh position={spring.position}>
        <sphereGeometry args={[letterDimensions[0] / 8, 32, 32]} />
        <a.meshBasicMaterial
          color={colors.white}
          opacity={spring.opacity}
          transparent={true}
        />
      </a.mesh>
    </group>
  );
}
