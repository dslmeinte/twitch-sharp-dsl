import { deserializeObservably, isAstObject, serialize } from "./ast-utils"


const { localStorage } = window


export const storedAstOrNull = () => {
    const textContents = localStorage.ast
    if (textContents) {
        try {
            const json = JSON.parse(textContents)
            if (isAstObject(json)) {
                // the destination on the happy path:
                return deserializeObservably(json)
            }
        } catch (error) {}
    }
    // all other, unhappy paths lead here:
    return undefined
}


export const storeAst = (ast) => {
    localStorage.ast = JSON.stringify(serialize(ast))
}

