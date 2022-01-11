import { Canvas } from "@react-three/fiber"
import {OrbitControls, RoundedBox, Text} from '@react-three/drei'
import { DoubleSide } from "three"
import { useStore } from "./store";
import { useCallback, useEffect, useMemo } from "react";
import { Keyboard } from "./Keyboard";

// const colors = ['#505050', '#00cc33', '#614e0c'];

const rowsAmount = 6;
const lettersAmount = 5;

const boxDimensions = 1.8;

const colors = {
  grey: '#878787',
  green: '#1e942d',
  yellow: '#cca418',
  white: '#f3f3f3'
}

function App() {
  const guesses = useStore(store => store.guesses);
  const answer = useStore(store => store.answer);

  return (
    <Canvas camera={{position: [0, 0, 20]}}>
      <color attach="background" args={['black']} />
      {/* <OrbitControls /> */}
      <ambientLight intensity={1} />
      <group position={[0, 0, 0]}>
        <group position={[-lettersAmount + boxDimensions / 2, rowsAmount - boxDimensions / 2, 0]}>
          {[...Array(rowsAmount)].map((_, row) => (
            [...Array(lettersAmount)].map((_, letter) => (
              <group key={`${row}-${letter}`} position={[letter * 2, -row * 2, 0]}>
                {guesses[row]?.[letter] && (
                  <Text color={row !== guesses.length - 1 ? 'white' : 'black'} anchorX="center"  anchorY="middle" fontSize={1} position={[0, 0, 0.1]}>   
                    {guesses[row][letter].toUpperCase()}
                  </Text>
                )}
                <mesh>
                  {/* <planeBufferGeometry attach="geometry" args={[boxDimensions, boxDimensions]} /> */}
                  {/* <meshStandardMaterial attach="material" color={colors[Math.floor(Math.random() * colors.length)]} side={DoubleSide} /> */}
                  <RoundedBox args={[boxDimensions, boxDimensions, 0]} radius={0.1} smoothness={4}>
                    <meshStandardMaterial attach="material" color={row !== guesses.length - 1 && guesses[row]?.[letter] ? answer[letter] === guesses[row][letter] ? colors.green : answer.includes(guesses[row][letter]) ? colors.yellow : colors.grey : colors.white } side={DoubleSide} />
                    {/* <meshPhongMaterial attach="material" color="#f3f3f3" wireframe /> */}
                  </RoundedBox>
                </mesh>
              </group>
              ))
              ))
            }
        </group>
      </group>
      <Keyboard />
    </Canvas>
  )
}

export default App
