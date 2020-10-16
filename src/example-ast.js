/*
 * Construct an (in-memory representation of an) AST === Abstract Syntax Tree.
 *
 *
 * An AST is represented by AST objects which are plain JavaScript objects of the following form:
 *
 * {
 *      concept: "_concept label_",
 *      settings: { // an object to store all values assigned to properties:
 *          name: "_some name_",
 *          // &c. ...
 *      }
 * }
 */


import { DataModel, Entity, Relation } from "./concepts"

const order = {
    concept: Entity,
    settings: {
        singularName: "Order",
        pluralName: "Orders"
    }
}

const orderLine = {
    concept: Entity,
    settings: {
        singularName: "Order Line",
        pluralName: "Order Lines"
    }
}


const relation1 = {
    concept: Relation,
    settings: {
        leftHand: {
            ref: order
        },
        rightHand: {
            ref: orderLine
        },
        phrase: "holds",
        cardinality: "one or more"
    }
}

const relation2 = {
    concept: Relation,
    settings: {
        leftHand: {
            ref: orderLine
        },
        rightHand: {
            ref: order
        },
        phrase: "belongs to",
        cardinality: "one"
    }
}


export const exampleAst = {
    concept: DataModel,
    settings: {
        entities: [ order, orderLine ],
        relations: [ relation1, relation2 ]
    }
}

