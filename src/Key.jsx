import { a, useSpring } from "@react-spring/three";
import { RoundedBox, Text } from "@react-three/drei";
import { Interactive } from "@react-three/xr";
import { useState } from "react";
import { DoubleSide } from "three";
import font from "./assets/OpenSans-ExtraBold.ttf";
import { keyDimensions } from "./constants";

export default function Key({
  label,
  dimensions = keyDimensions,
  position,
  fontSize = 0.01,
  disabled = false,
  onClick = () => null,
}) {
  const [hovered, setHovered] = useState(false);
  const spring = useSpring({
    color: disabled ? "black" : hovered ? "#2e2e2e" : "#6b6b6b",
  });

  return (
    <Interactive
      onSelect={() => {
        !disabled && onClick();
      }}
      onHover={() => {
        setHovered(true);
      }}
      onBlur={() => {
        setHovered(false);
      }}
    >
      <group position={position}>
        <RoundedBox args={dimensions} radius={0.001} smoothness={4}>
          <a.meshPhongMaterial color={spring.color} side={DoubleSide} />
        </RoundedBox>

        <Text
          color="white"
          anchorX="center"
          anchorY="middle"
          fontSize={fontSize}
          position={[0, 0, keyDimensions[2] + 0.001]}
          font={font}
        >
          {label.toUpperCase()}
        </Text>
      </group>
    </Interactive>
  );
}
