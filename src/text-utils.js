/*
 * Useful functions that are used by both the projection, as well as the code generator.
 */

export const indefiniteArticleFor = (nextWord) => "a" + ((typeof nextWord === "string" && nextWord.match(/^[aeiouAEIOU]/)) ? "n" : "")
export const withFirstUpper = (str) => str.charAt(0).toUpperCase() + str.substring(1)

