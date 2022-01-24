import { RoundedBox, Text } from "@react-three/drei";
import { DoubleSide } from "three";
import { colors, letterDimensions } from "./constants";
import font from "./assets/OpenSans-ExtraBold.ttf";
import { useSpring, a } from "@react-spring/three";

export default function Letter({
  label,
  fontColor = colors.black,
  color: _color = colors.white,
  position = [0, 0, 0],
}) {
  const { rotation, color } = useSpring({
    rotation: [0, label ? 0 : Math.PI, 0],
    color: _color,
  });

  return (
    <a.group position={position} rotation={rotation}>
      {label && (
        <Text
          color={"black"}
          anchorX="center"
          anchorY="middle"
          fontSize={letterDimensions[1] / 1.5}
          position={[0, 0, letterDimensions[2] / 2 + 0.001]}
          font={font}
        >
          {label.toUpperCase()}
        </Text>
      )}
      <mesh>
        <RoundedBox args={letterDimensions} radius={0.01} smoothness={4}>
          <a.meshStandardMaterial color={color} side={DoubleSide} />
        </RoundedBox>
      </mesh>
    </a.group>
  );
}
