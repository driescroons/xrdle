import { RoundedBox, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Interactive, useController, useXR, useXREvent } from "@react-three/xr";
import { useEffect, useMemo, useRef, useState } from "react";
import { DoubleSide, Vector3 } from "three";
import { rowsAmount } from "./constants";
import { useStore } from "./store";

const rows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

const keyDimension = 0.02;

export function Keyboard({ position = [0, 0, 0] }) {
  const ref = useRef();

  const [hovered, setHovered] = useState(false);
  const { isPresenting } = useXR();

  const set = useStore((store) => store.set);
  const guesses = useStore((store) => store.guesses);
  const answer = useStore((store) => store.answer);
  const reset = useStore((store) => store.reset);

  const incorrect = useMemo(
    () =>
      guesses.length > 0
        ? [...guesses]
            .slice(0, -1)
            .reduce((list, guess) => {
              list.push(...guess);
              return list;
            }, [])
            .filter((letter) => !answer.includes(letter))
        : [],
    [guesses]
  );

  const grabbingController = useRef();
  const groupRef = useRef();
  const previousTransform = useRef(undefined);

  useXREvent("selectend", (e) => {
    if (e.controller.controller === grabbingController.current) {
      grabbingController.current = undefined;
      previousTransform.current = undefined;
    }
  });

  useEffect(() => {
    const guess = guesses.at(-1);
    if (guesses.find((guess) => guess === answer)) {
      // We should also quit the game
      setTimeout(() => reset(), 1000);
    }

    if (guesses.length - 1 === rowsAmount) {
      setTimeout(() => reset(), 1000);
    }
  }, [guesses, answer]);

  useFrame(() => {
    if (
      !grabbingController.current ||
      !previousTransform.current ||
      !groupRef.current
    ) {
      return;
    }

    const controller = grabbingController.current;
    const group = groupRef.current;

    group.applyMatrix4(previousTransform.current);
    group.applyMatrix4(controller.matrixWorld);
    group.updateWorldMatrix(false, true);

    previousTransform.current = controller.matrixWorld.clone().invert();
  });

  const keyboard = useStore((store) => store.keyboard);

  return isPresenting ? (
    <Interactive
      ref={groupRef}
      onSelectStart={(e) => {
        if (!Object.values(keyboard).includes(true)) {
          grabbingController.current = e.controller.controller;
          previousTransform.current = e.controller.controller.matrixWorld
            .clone()
            .invert();
        }
      }}
    >
      <group ref={ref} position={position}>
        {rows.map((row, rowIndex) => (
          <group key={rowIndex} position={[0, 0, 0]}>
            {row.split("").map((letter, letterIndex, letters) => (
              <Key
                label={letter}
                key={letterIndex}
                position={[
                  (letterIndex * keyDimension -
                    ((letters.length - 1) / 2) * keyDimension) *
                    1.15,
                  (-rowIndex * keyDimension +
                    ((rows.length - 1) / 2) * keyDimension) *
                    1.15,
                  0,
                ]}
                disabled={incorrect.includes(letter)}
                onClick={() => {
                  set((store) => {
                    if (store.guesses.length > 0) {
                      const lastGuess = store.guesses[store.guesses.length - 1];
                      if (lastGuess.length < store.answer.length) {
                        store.guesses[
                          store.guesses.length - 1
                        ] = `${lastGuess}${letter}`;
                      }
                    } else {
                      store.guesses[0] = `${letter}`;
                    }
                  });
                }}
              />
            ))}
          </group>
        ))}

        <group>
          <Key
            label="UNDO"
            width={0.032}
            position={[0.098, -keyDimension * 1.15, 0]}
            onClick={() => {
              set((store) => {
                const newGuess = store.guesses[store.guesses.length - 1].slice(
                  0,
                  -1
                );
                store.guesses[store.guesses.length - 1] = newGuess;
              });
            }}
          />
          <Key
            label="GUESS"
            width={0.032}
            position={[-0.098, -keyDimension * 1.15, 0]}
            disabled={guesses[guesses.length - 1]?.length !== answer.length}
            onClick={() => {
              const guess = guesses.at(-1);

              // these need to be disabled on keyboard insert
              if (
                guess.split("").find((letter) => incorrect.includes(letter))
              ) {
                console.log("wrong");
                return;
              }

              set((store) => {
                store.guesses.push("");
              });
            }}
          />
        </group>

        <RoundedBox
          args={[0.26, 0.085, 0.01]}
          position={[0, 0, -0.01]}
          radius={0.001}
          smoothness={4}
          onHover={() => setHovered(true)}
          onBlur={() => setHovered(false)}
        >
          <meshStandardMaterial
            attach="material"
            color={hovered ? "red" : "#d4d4d4"}
            side={DoubleSide}
          />
        </RoundedBox>
      </group>
    </Interactive>
  ) : null;
}

function Key({
  label,
  width = keyDimension,
  height = keyDimension,
  position = [0, 0, 0],
  fontSize = 0.005,
  disabled = false,
  onClick = () => null,
}) {
  const [hovered, setHovered] = useState(false);
  const set = useStore((store) => store.set);

  return (
    <Interactive
      onSelect={() => {
        !disabled && onClick();
      }}
      onHover={() => {
        set((store) => {
          store.keyboard[label] = true;
        });
        setHovered(true);
      }}
      onBlur={() => {
        set((store) => {
          store.keyboard[label] = false;
        });
        setHovered(false);
      }}
    >
      <group position={position}>
        <RoundedBox args={[width, height, 0]} radius={0.001} smoothness={4}>
          <meshStandardMaterial
            color={disabled ? "black" : hovered ? "#2e2e2e" : "#6b6b6b"}
            side={DoubleSide}
          />
        </RoundedBox>

        <Text
          color="white"
          anchorX="center"
          anchorY="middle"
          fontSize={fontSize}
          position={[0, 0, 0.001]}
        >
          {label.toUpperCase()}
        </Text>
      </group>
    </Interactive>
  );
}
