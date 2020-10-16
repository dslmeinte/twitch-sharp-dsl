const isObject = (value) => (!!value) && (typeof value === "object") && !Array.isArray(value)
export const isAstObject = (value) => isObject(value) && ("concept" in value) && ("settings" in value)
export const isAstReference = (value) => isObject(value) && ("ref" in value)


// re-export shortid.generate under a nicer name
import { generate as newId } from "shortid"
export { newId }


export function withComputedIds(value) {
    if (isAstObject(value)) {
        value.id = newId()
        for (const propertyName in value.settings) {
            withComputedIds(value.settings[propertyName])
        }
        return value
    }
    if (Array.isArray(value)) {
        value.forEach(withComputedIds)
    }
}


import { observable } from "mobx"

export function asObservable(ast) {
    const id2ObservableAstObject = {}
    const refObjectsToFix = []

    function asObservableInternal(value) {
        if (isAstObject(value)) {
            const observableAstObject = observable({
                id: value.id,
                concept: value.concept,
                settings: {}
            })
            for (const propertyName in value.settings) {
                observableAstObject.settings[propertyName] = asObservableInternal(value.settings[propertyName])
            }
            id2ObservableAstObject[value.id] = observableAstObject
            return observableAstObject
        }
        if (isAstReference(value)) {
            const refObjectToFix = observable({})
            refObjectsToFix.push([ value.ref.id, refObjectToFix ])
            return refObjectToFix
        }
        if (Array.isArray(value)) {
            return value.map(asObservableInternal)
        }
        return value
    }

    const observableAst = asObservableInternal(ast)

    refObjectsToFix.forEach(([ refId, refObjectToFix ]) => {
        refObjectToFix.ref = id2ObservableAstObject[refId]
    })

    return observableAst
}


export const newAstObject = (concept, ast) => observable({
    id: newId(),
    concept: concept,
    settings: {}
})


export function serialize(value) {
    if (isAstObject(value)) {
        const serializedAstObject = {
            id: value.id,
            concept: value.concept,
            settings: {}
        }
        for (const propertyName in value.settings) {
            serializedAstObject.settings[propertyName] = serialize(value.settings[propertyName])
        }
        return serializedAstObject
    }
    if (isAstReference(value)) {
        // Instead of a reference object, return an object with a 'refId === ref.id':
        return ({
            refId: value.ref.id
        })
    }
    if (Array.isArray(value)) {
        return value.map(serialize)
    }
    return value
}


const isSerializedAstReference = (value) => isObject(value) && ("refId" in value)

export function deserialize(serializedAst) {
    const id2AstObject = {}
    const referencesToResolve = []

    function deserializeInternal(value) {
        if (isAstObject(value)) {
            const astObject = {
                id: value.id,
                concept: value.concept,
                settings: {}
            }
            for (const propertyName in value.settings) {
                astObject.settings[propertyName] = deserializeInternal(value.settings[propertyName])
            }
            id2AstObject[value.id] = astObject
            return astObject
        }
        if (isSerializedAstReference(value)) {
            const refObjectToFix = {}
            referencesToResolve.push([ value.refId, refObjectToFix ])
            return refObjectToFix
        }
        if (Array.isArray(value)) {
            return value.map(deserializeInternal)
        }
        return value
    }

    const deserializedAst = deserializeInternal(serializedAst)

    referencesToResolve.forEach(([ refId, refObjectToFix ]) => {
        refObjectToFix.ref = id2AstObject[refId]
    })

    return deserializedAst
}


export function deserializeObservably(serializedAst) {
    const id2ObservableAstObject = {}
    const referencesToResolve = []

    function deserializeObservablyInternal(value) {
        if (isAstObject(value)) {
            const observableAstObject = observable({
                id: value.id,
                concept: value.concept,
                settings: {}
            })
            for (const propertyName in value.settings) {
                observableAstObject.settings[propertyName] = deserializeObservablyInternal(value.settings[propertyName])
            }
            id2ObservableAstObject[value.id] = observableAstObject
            return observableAstObject
        }
        if (isSerializedAstReference(value)) {
            const refObjectToFix = observable({})
            referencesToResolve.push([ value.refId, refObjectToFix ])
            return refObjectToFix
        }
        if (Array.isArray(value)) {
            return value.map(deserializeObservablyInternal)
        }
        return value
    }

    const deserializedAst = deserializeObservablyInternal(serializedAst)

    referencesToResolve.forEach(([ refId, refObjectToFix ]) => {
        refObjectToFix.ref = id2ObservableAstObject[refId]
    })

    return deserializedAst
}


export function deepCopy(ast) {
    const id2CopiedObject = {}
    const referencesToResolve = []

    function deepCopyInternal(value) {
        if (isAstObject(value)) {
            const copiedObject = {
                id: value.id,
                concept: value.concept,
                settings: {}
            }
            for (const propertyName in value.settings) {
                copiedObject.settings[propertyName] = deepCopyInternal(value.settings[propertyName])
            }
            id2CopiedObject[value.id] = copiedObject
            return copiedObject
        }
        if (isAstReference(value)) {
            const refObjectToFix = {}
            referencesToResolve.push([ value.ref.id, refObjectToFix ])
            return refObjectToFix
        }
        if (Array.isArray(value)) {
            return value.map(deepCopyInternal)
        }
        return value
    }

    const copiedAst = deepCopyInternal(ast)

    referencesToResolve.forEach(([ refId, refObjectToFix ]) => {
        refObjectToFix.ref = id2CopiedObject[refId]
    })

    return copiedAst
}

