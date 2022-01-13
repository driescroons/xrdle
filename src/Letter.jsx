import { RoundedBox, Text } from "@react-three/drei";
import { DoubleSide } from "three";
import { boxDimensions, colors } from "./constants";

export default function Letter({
  label,
  fontColor = "black",
  color = colors.white,
  position = [0, 0, 0],
}) {
  return (
    <group position={position}>
      {label && (
        <Text
          color={fontColor}
          anchorX="center"
          anchorY="middle"
          fontSize={0.1}
          position={[0, 0, 0.001]}
        >
          {`${label}`.toUpperCase()}
        </Text>
      )}
      <mesh>
        <RoundedBox
          args={[boxDimensions, boxDimensions, 0]}
          radius={0.01}
          smoothness={4}
        >
          <meshStandardMaterial
            attach="material"
            color={color}
            side={DoubleSide}
          />
        </RoundedBox>
      </mesh>
    </group>
  );
}
