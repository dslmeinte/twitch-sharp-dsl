const isObject = (value) => (!!value) && (typeof value === "object") && !Array.isArray(value)
export const isAstObject = (value) => isObject(value) && ("concept" in value) && ("settings" in value)
export const isAstReference = (value) => isObject(value) && ("ref" in value)


export const newAstObject = (concept, ast) => ({
    concept: concept,
    settings: {}
})

