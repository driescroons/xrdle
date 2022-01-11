import { RoundedBox, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { DoubleSide, Vector3 } from "three";
import { useStore } from "./store";

const rows = [
    'qwertyuiop',
    'asdfghjkl',
    'zxcvbnm'
];

const keyDimension = 0.12;

export function Keyboard() {
    const ref = useRef();
    
    const [draggingOffset] = useState(new Vector3());

    const [dragging, setDragging] = useState(false);
    const [hovering, setHovering] = useState(false);
    const {viewport} = useThree();

    const set = useStore(store => store.set);
    const guesses = useStore(store => store.guesses);
    const guess = useStore(store => store.guess);
    const answer = useStore(store => store.answer);

    const incorrect = useMemo(() => guesses.length > 0 ? [...guesses].slice(0, -1).reduce((list, guess) => {
        list.push(...guess);
        return  list;
    } , []).filter(letter => !answer.includes(letter)) : [], [guesses]); 


    useFrame(({ mouse }) => {
        if (dragging) {
            // console.log(mouse);
            const x = (mouse.x * viewport.width) / 2
            const y = (mouse.y * viewport.height) / 2
            ref.current.position.set(x * 0.1, y * 0.1, 18).add(draggingOffset)
            // ref.current.rotation.set(-y, x, 0)
        }
    })


    return (
        <group ref={ref} position={[0, 0, 18]} onPointerMove={(event) => {
            if (event.intersections.length === 1) {
                setHovering(true);
            } else {
                setHovering(false);
            }
        }} onPointerDown={(event) => {
            if (event.intersections.length === 1) {
                draggingOffset.copy(ref.current.position.clone().sub(event.intersections[0].point));
                setDragging(true);
            } 
        }} onPointerUp={() => {
            setDragging(false);
        }}>
            {rows.map((row, rowIndex) => (
                <group key={rowIndex} position={[0, 0, 0]}>
                    {row.split('').map((letter, letterIndex, letters) => (
                        <Key label={letter} key={letterIndex} position={[letterIndex * keyDimension - (letters.length - 1) / 2 * keyDimension, -rowIndex * keyDimension + (rows.length - 1) / 2 * keyDimension, 0]} disabled={incorrect.includes(letter)} onClick={() => {
                            set(store => {
                                if (store.guesses.length > 0) {
                                    if (store.guesses[store.guesses.length - 1].length < store.answer.length) {
                                        store.guesses[store.guesses.length - 1] = `${ store.guesses[store.guesses.length - 1]}${letter}`;
                                    }
                                } else {
                                    store.guesses[0] = `${letter}`
                                }
                            })
                        }}/>
                    ))}
                </group>
            ))}
    
            <group>
                <Key label="UNDO" width={0.18} position={[0.52, -keyDimension, 0]} onClick={() => {
                    set(store => {
                        const newGuess = store.guesses[store.guesses.length - 1].slice(0, -1);
                        store.guesses[store.guesses.length - 1] = newGuess;
                    })
                }}/>
                <Key label="GUESS"  width={0.18} position={[-0.52, -keyDimension, 0]} disabled={guesses[guesses.length - 1]?.length !== answer.length} onClick={() => {
                    // if (guess) {
                        const guess = guesses.at(-1);
                        console.log(guesses, answer, guess, incorrect);

                        // these need to be disabled on keyboard insert
                        if (guess.split('').find(letter => incorrect.includes(letter))) {
                            console.log('wrong');
                            return;
                        }
                        
                        if (guess === answer) {
                            console.log('You win!');
                        }

                        set(store => {
                            store.guesses.push('');
                        })
                    // } 
                }} />
            </group>

            <RoundedBox args={[1.25, 0.4, 0]} position={[0, 0, -0.01]} radius={0.01} smoothness={4}>
               <meshStandardMaterial attach="material" color={'#d4d4d4'} side={DoubleSide} />
            </RoundedBox>
        </group>
    )
}

function Key({label, width = 0.1, height = 0.1, position = [0, 0, 0], fontSize = 0.05, disabled = false, onClick = () => null}) {

    const [hovered, setHovered] = useState(false);

    return (
        <group position={position}>
            <RoundedBox args={[width, height, 0]} radius={0.01} smoothness={4} onPointerOver={() => 
                setHovered(true)
            } onPointerLeave={() => setHovered(false)} onClick={!disabled && onClick}>
                <meshStandardMaterial attach="material" color={disabled ? 'black' : hovered ? '#2e2e2e' : '#6b6b6b'} side={DoubleSide} />
                {/* <meshPhongMaterial attach="material" color="#f3f3f3" wireframe /> */}
            </RoundedBox>
            
            <Text color="white" anchorX="center"  anchorY="middle" fontSize={fontSize} position={[0, 0, 0.01]} >
                {label.toUpperCase()}
            </Text> 
        </group>
    )
}