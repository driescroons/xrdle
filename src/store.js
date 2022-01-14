import create from "zustand";
import produce from "immer";

export const answers = ["fancy", "woody", "spelt", "comet", "drone", "scarf"];

export const useStore = create((set) => ({
  guesses: [],
  answer: answers[Math.floor(Math.random() * answers.length)],
  keyboard: {},
  reset: () => {
    set((state) =>
      produce(state, (draft) => {
        draft.guesses = [];
        draft.answer = answers[Math.floor(Math.random() * answers.length)];
      })
    );
  },
  set: (store) => set(produce(store)),
}));
