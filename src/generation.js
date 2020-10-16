import {indefiniteArticleFor, withFirstUpper} from "./text-utils"


const generateForEntity = (entity) => {
    const { singularName, pluralName, description } = entity.settings
    return `${withFirstUpper(indefiniteArticleFor(singularName))} ${singularName} (plural: ${pluralName}) describes ${description || "..."}.`
}


const generateForRelation = (relation) => {
    const { leftHand, phrase, cardinality, rightHand } = relation.settings
    const rightHandDisplayName = rightHand && rightHand.ref.settings[cardinality.endsWith("more") ? "pluralName" : "singularName"]
    return `Each ${leftHand.ref.settings["singularName"]} ${phrase} ${cardinality} ${rightHandDisplayName}.`
}

export const generateCode = (ast) => {
    const { entities, relations } = ast.settings
    return `
Data Model


    Entities:

${entities.map((entity) => `\t\t* ${generateForEntity(entity)}`).join("\n")}


    Relations:

${relations.map((relation) => `\t\t* ${generateForRelation(relation)}`).join("\n")}

`
}

