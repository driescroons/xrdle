import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Interactive, useXR, useXREvent } from "@react-three/xr";
import { useEffect, useMemo, useRef } from "react";
import { DoubleSide } from "three";
import {
  colors,
  keyboardDimensions,
  keyDimensions,
  keyPadding,
  letterAmount,
  resetTime,
  rowAmount,
  rows,
} from "./constants";
import { useStore } from "./store";

import Key from "./Key";

export function Keyboard() {
  const { isPresenting, hoverState } = useXR();

  const set = useStore((store) => store.set);
  const guesses = useStore((store) => store.guesses);
  const answer = useStore((store) => store.answer);
  const reset = useStore((store) => store.reset);

  const incorrect = useMemo(
    () =>
      guesses.length > 0
        ? [...guesses]
            // all guesses except the one we're currently editing
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
  const meshRef = useRef();
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
      setTimeout(() => reset(), resetTime);
    }

    if (guesses.length - 1 === rowAmount) {
      setTimeout(() => reset(), resetTime);
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

  return isPresenting ? (
    <Interactive
      ref={groupRef}
      onSelectStart={(e) => {
        if (
          Array.from(hoverState[e.controller.inputSource.handedness]).sort(
            (a, b) => a[1].distance - b[1].distance
          )[0][0].uuid === meshRef.current.uuid
        ) {
          grabbingController.current = e.controller.controller;
          previousTransform.current = e.controller.controller.matrixWorld
            .clone()
            .invert();
        }
      }}
    >
      <group position={[0, isPresenting ? 1.3 : 0, -0.3]}>
        <group position={[0, 0, keyboardDimensions[2] / 2]}>
          {rows.map((row, rowIndex) => (
            <group key={rowIndex}>
              {row.split("").map((letter, letterIndex, letters) => (
                <Key
                  label={letter}
                  key={letterIndex}
                  position={[
                    letterIndex * keyDimensions[0] * keyPadding -
                      ((row.length - 1) * keyDimensions[0] * keyPadding) / 2,
                    -rowIndex * keyDimensions[1] * keyPadding +
                      ((rows.length - 1) * keyDimensions[1] * keyPadding) / 2,
                    0,
                  ]}
                  disabled={incorrect.includes(letter)}
                  onClick={() => {
                    set((store) => {
                      const lastGuess = store.guesses.at(-1);
                      if (lastGuess.length < letterAmount) {
                        store.guesses[
                          store.guesses.length - 1
                        ] = `${lastGuess}${letter}`;
                      }
                    });
                  }}
                />
              ))}
            </group>
          ))}
          <Key
            label="UNDO"
            dimensions={[
              keyDimensions[0] * 2.8,
              keyDimensions[1],
              keyDimensions[2],
            ]}
            position={[
              (-(rows[2].length + 1) * keyDimensions[0] * keyPadding) / 2 -
                keyDimensions[0],
              -keyDimensions[1] * keyPadding,
              0,
            ]}
            onClick={() => {
              set((store) => {
                const newGuess = store.guesses.at(-1).slice(0, -1);
                store.guesses[store.guesses.length - 1] = newGuess;
              });
            }}
          />
          <Key
            label="GUESS"
            dimensions={[
              keyDimensions[0] * 2.8,
              keyDimensions[1],
              keyDimensions[2],
            ]}
            position={[
              ((rows[2].length + 1) * keyDimensions[0] * keyPadding) / 2 +
                keyDimensions[0],
              -keyDimensions[1] * keyPadding,
              0,
            ]}
            disabled={guesses[guesses.length - 1]?.length !== answer.length}
            onClick={() => {
              const guess = guesses.at(-1);

              // extra check, but keys should be disabled
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
          args={keyboardDimensions}
          radius={0.001}
          smoothness={4}
          ref={meshRef}
        >
          <meshPhongMaterial color={colors.lightgrey} side={DoubleSide} />
        </RoundedBox>
      </group>
    </Interactive>
  ) : null;
}
