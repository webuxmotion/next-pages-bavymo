import randomWords from "random-english-words";

export function generateWord() {
  let word = "";
  do {
    const result = randomWords(); // string | string[]
    word = Array.isArray(result) ? result[0] : result; // ensure string
  } while (word.length < 3 || word.length > 7);

  return word.toUpperCase();
}