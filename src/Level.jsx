import { useXR } from "@react-three/xr";
import { boxDimensions, rowsAmount, lettersAmount, colors } from "./constants";
import Letter from "./Letter";
import { useStore } from "./store";

export function Level() {
  const guesses = useStore((store) => store.guesses);
  const answer = useStore((store) => store.answer);
  const { isPresenting } = useXR();

  return (
    <group
      position={[
        (-lettersAmount / 2) * boxDimensions,
        (isPresenting ? 1.6 : 0) + (rowsAmount / 2) * boxDimensions,
        -2,
      ]}
    >
      {[...Array(rowsAmount)].map((_, row) =>
        [...Array(lettersAmount)].map((_, letter) => (
          <Letter
            row={row}
            letter={letter}
            key={`${row}-${letter}`}
            label={guesses[row]?.[letter]}
            position={[
              letter * boxDimensions * 1.2,
              -row * boxDimensions * 1.2,
              0,
            ]}
            fontColor={row !== guesses.length - 1 ? "black" : "white"}
            color={
              row !== guesses.length - 1 && guesses[row]?.[letter]
                ? answer[letter] === guesses[row][letter]
                  ? colors.green
                  : answer.includes(guesses[row][letter])
                  ? colors.yellow
                  : colors.grey
                : colors.white
            }
          />
        ))
      )}
    </group>
  );
}
