import { randWord } from "@ngneat/falso";

export function generateWord() {
  let word = "";
  do {
    word = randWord();
  } while (word.length < 3 || word.length > 7);
  return word;
}