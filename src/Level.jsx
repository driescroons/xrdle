import { RoundedBox, Text } from "@react-three/drei";
import { useXR } from "@react-three/xr";
import { DoubleSide } from "three";
import { boxDimensions, rowsAmount, lettersAmount, colors} from './constants';
import { useStore } from "./store";

export function Level() {
    const guesses = useStore(store => store.guesses);
    const answer = useStore(store => store.answer);
    const { isPresenting } = useXR();

    return (
        <group position={[-lettersAmount / 2 * boxDimensions, (isPresenting ? 1.6 : 0) + rowsAmount / 2 * boxDimensions, -2]}>
          {[...Array(rowsAmount)].map((_, row) => (
            [...Array(lettersAmount)].map((_, letter) => (
              <group key={`${row}-${letter}`} position={[letter * boxDimensions * 1.2, -row * boxDimensions * 1.2, 0]}>
                {guesses[row]?.[letter] && (
                  <Text color={row !== guesses.length - 1 ? 'white' : 'black'} anchorX="center"  anchorY="middle" fontSize={0.1} position={[0, 0, 0.001]}>   
                    {guesses[row][letter].toUpperCase()}
                  </Text>
                )}
                <mesh>
                  <RoundedBox args={[boxDimensions, boxDimensions, 0]} radius={0.01} smoothness={4}>
                    <meshStandardMaterial attach="material" color={row !== guesses.length - 1 && guesses[row]?.[letter] ? answer[letter] === guesses[row][letter] ? colors.green : answer.includes(guesses[row][letter]) ? colors.yellow : colors.grey : colors.white } side={DoubleSide} />
                  </RoundedBox>
                </mesh>
              </group>
              ))
              ))
            }
        </group>
    )
}