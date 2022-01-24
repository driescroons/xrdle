import { useXR } from "@react-three/xr";
import { useSpring, a } from "@react-spring/three";
import { useControls } from "leva";
import { useEffect } from "react";
import {
  rowAmount,
  letterAmount,
  colors,
  letterDimensions,
  letterPadding,
  resetTime,
} from "./constants";
import Indicator from "./Indicator";
import Letter from "./Letter";
import { useStore } from "./store";

export function Level() {
  const guesses = useStore((store) => store.guesses);
  const answer = useStore((store) => store.answer);
  const set = useStore((store) => store.set);
  const reset = useStore((store) => store.reset);

  const { isPresenting } = useXR();

  const { guess } = useControls({
    guess: {
      value: "",
    },
  });

  useEffect(() => {
    set((store) => {
      store.guesses[store.guesses.length - 1] = guess.slice(0, letterAmount);
      if (guess.length >= letterAmount) {
        store.guesses.push("");
      }
    });
  }, [guess]);

  useEffect(() => {
    if (guesses.includes(answer)) {
      setTimeout(() => {
        reset();
      }, resetTime);
    }
  }, [guesses]);

  return (
    <group
      position={[
        (-(letterAmount - 1) / 2) * letterDimensions[0] * letterPadding,
        (isPresenting ? 1.6 : 0) +
          ((rowAmount - 1) / 2) * letterDimensions[1] * letterPadding,
        -2,
      ]}
    >
      <Indicator />
      <group>
        {[...Array(rowAmount)].map((_, row) =>
          [...Array(letterAmount)].map((_, letter) => (
            <Letter
              row={row}
              letter={letter}
              key={`${row}-${letter}`}
              label={guesses[row]?.[letter]}
              position={[
                letter * letterDimensions[0] * letterPadding,
                -row * letterDimensions[1] * letterPadding,
                0,
              ]}
              fontColor={"black"}
              color={
                row < guesses.length - 1
                  ? answer.split("").includes(guesses[row]?.[letter])
                    ? answer[letter] === guesses[row]?.[letter]
                      ? colors.green
                      : colors.yellow
                    : colors.grey
                  : colors.white
              }
            />
          ))
        )}
      </group>
    </group>
  );
}
