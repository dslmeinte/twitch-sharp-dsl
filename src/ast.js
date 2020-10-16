/*
 * Everything that's specific to our particular shape of AST goes in this file.
 */

import { isAstObject } from "./ast-utils"
import { Entity } from "./concepts"
import { Associative, Characteristic, Kernel, Reference } from "./entity-kinds"


export const entityKind = (entity, dataModel) => {
    const incomingRelations = dataModel.settings["relations"].filter((relation) => relation.settings["rightHand"].ref === entity)
    const incomingCrowsFeet = incomingRelations.some((relation) => relation.settings["cardinality"].endsWith("more"))
    if (incomingCrowsFeet > 1) {
        return Associative
    }
    if (incomingCrowsFeet === 1) {
        return Characteristic
    }
    return entity.settings["isReference"] ? Reference : Kernel
}


export const dataModel = (ancestors) => ancestors[ancestors.length - 1]


export function validate(value, ancestors) {
    if (isAstObject(value)) {
        const { settings } = value
        switch (value.concept) {
            case Entity: {
                const issues = []
                if (dataModel(ancestors).settings["entities"].some((otherEntity) => otherEntity !== value && otherEntity.settings["singularName"] === settings["singularName"])) {
                    issues.push({ propertyName: "singularName", message: "Another with the same singular name already exists." })
                }
                if (dataModel(ancestors).settings["entities"].some((otherEntity) => otherEntity !== value && otherEntity.settings["pluralName"] === settings["pluralName"])) {
                    issues.push({ propertyName: "pluralName", message: "Another with the same plural name already exists." })
                }
                return issues
            }
        }
    }
}


export const issuesForProperty = (issues, propertyName) => (issues && issues.filter((issue) => issue.propertyName === propertyName)) || []

