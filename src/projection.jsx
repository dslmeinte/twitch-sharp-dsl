import { action, observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"


import { dataModel, entityKind, issuesForProperty, validate } from "./ast"
import { isAstObject, newAstObject } from "./ast-utils"
import { DataModel, Entity, Relation } from "./concepts"
import { Kernel, Reference } from "./entity-kinds"
import { indefiniteArticleFor, withFirstUpper } from "./text-utils"
import { DropDownValue, TextValue } from "./value-components"


const EntityRef = observer(({ astObject, propertyName, dataModel, plural }) => {
    const value = astObject.settings[propertyName]
    return <DropDownValue
        editState={observable({
            // Only navigate reference relation when there's one:
            value: value && value.ref.settings[plural ? "pluralName" : "singularName"],
            inEdit: false,
            setValue: (newValue) => {
                astObject.settings[propertyName] = {
                    ref: newValue
                }
            }
        })}
        className="reference"
        options={dataModel.settings["entities"].map((entity) => ({
            id: entity.id,
            text: entity.settings[plural ? "pluralName" : "singularName"],
            thing: entity
        }))}
        actionText="(choose an entity)"
        placeholderText="<entity>"
    />
})


const IssueSpanWrapper = observer(({ allIssues, propertyName, children }) => {
    const issues = issuesForProperty(allIssues, propertyName)
    return <span className={issues.length > 0 ? "has-issues" : ""} title={issues.map((issue) => issue.message).join("\n")}>{children}</span>
})


export const Projection = observer(({ value, ancestors }) => {
    if (isAstObject(value)) {
        const { settings } = value
        const editStateFor = (propertyName) => observable({
            value: settings[propertyName],
            inEdit: false,
            setValue: (newValue) => { settings[propertyName] = newValue }
        })
        // (cases are in alphabetical order of concept labels:)
        switch (value.concept) {
            case DataModel: return <div>
                <h3>Data Model</h3>
                <div>
                    <h4>Entities</h4>
                    <div className="entities">
                        {settings["entities"].map((entity, index) => <Projection key={index} value={entity} ancestors={[ value ]} />)}
                    </div>
                    <button
                        tabIndex={-1}
                        onClick={action((_) => {
                            settings["entities"].push(newAstObject(Entity))
                        })}
                    >Add an entity</button>
                </div>
                <div className="spacer"></div>
                <div>
                    <h4>Relations</h4>
                    <div className="relations">
                        {settings["relations"].map((relation, index) => <Projection key={index} value={relation} ancestors={[ value ]}/>)}
                    </div>
                    <button
                        tabIndex={-1}
                        onClick={action((_) => {
                            const newRelation = newAstObject(Relation)
                            newRelation.settings["cardinality"] = "one or more"
                            settings["relations"].push(newRelation)
                        })}
                    >Add a relation</button>
                </div>
            </div>
            case Entity: {
                const kind = entityKind(value, dataModel(ancestors))
                const issues = validate(value, ancestors)
                return <div className="entity">
                    <span className="keyword">{withFirstUpper(indefiniteArticleFor(settings["singularName"]))}</span>&nbsp;
                    <IssueSpanWrapper allIssues={issues} propertyName="singularName">
                        <TextValue editState={editStateFor("singularName")} placeholderText="<singular name>" />
                    </IssueSpanWrapper>&nbsp;
                    <span className="keyword">(plural: </span>
                    <TextValue editState={editStateFor("pluralName")} placeholderText="<plural name>" />
                    <span className="keyword">, kind: </span>
                    {[ Kernel, Reference ].indexOf(kind) > -1
                        ? <div className="switch">
                        <span className={"entity-kind " + (settings["isReference"] || "selected")} onClick={action((_) => { settings["isReference"] = false })}>Kernel</span>
                        <span className="keyword">/</span>
                        <span className={"entity-kind " + (settings["isReference"] && "selected")} onClick={action((_) => { settings["isReference"] = true })}>Reference</span>
                        {/*TODO  consider using DropDownValue*/}
                        </div>
                        : <span className="keyword entity-kind">{kind}</span>
                    }
                    <span className="keyword">) describes</span>&nbsp;
                    <TextValue editState={editStateFor("description")} placeholderText="&hellip;" />
                    <span className="keyword">.</span>&nbsp;
                </div>
            }
            case Relation: return <div className="relation">
                <span className="keyword">Each</span>&nbsp;
                <EntityRef astObject={value} propertyName={"leftHand"} dataModel={dataModel(ancestors)} plural={false} />&nbsp;
                <TextValue editState={editStateFor("phrase")} placeholderText="<phrase>" />&nbsp;
                <DropDownValue
                    className="value quoted-type"
                    editState={editStateFor("cardinality")}
                    options={[ "at most one", "one or more" ].map((text) => ({ id: text, text: text, thing: text }))}
                    // TODO  check possibilities
                    placeholderText="<cardinality>"
                />&nbsp;
                <EntityRef astObject={value} propertyName={"rightHand"} dataModel={dataModel(ancestors)} plural={settings["cardinality"].endsWith("more")} />&nbsp;
                <span className="keyword">.</span>
            </div>
            default: return <div>
                <em>{"No projection defined for concept: " + value.concept}</em>
            </div>
        }
    }
    return <em>{"No projection defined for value: " + value}</em>
})

