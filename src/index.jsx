import { action, observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import { render } from "react-dom"

require("./styling.css")


import { asObservable } from "./ast-utils"
import { generateCode } from "./generation"
import { dataModel } from "./initial-ast"
import { Projection } from "./projection"
import { storeAst, storedAstOrNull } from "./storage"


const state = observable({})

const storedAst = storedAstOrNull()
state.ast = storedAst || asObservable(dataModel)
state.isStored = !!storedAst

const App = observer(() => <div>
    <Projection value={state.ast} ancestors={[]} />
    <h3>Model Persistence</h3>
    {state.isStored && <span>Data Model above is persisted in the browser's localStorage.</span>}
    <div>
        <button
            tabIndex={-1}
            onClick={action((_) => {
                storeAst(state.ast)
                state.isStored = true
                state.isSavedIndication = true
                setTimeout(action(() => {
                    state.isSavedIndication = false
                }), 1500)
            })}
        >Save data model</button> {state.isSavedIndication && <span className="indication">- saved</span>}
        <button
            tabIndex={-1}
            onClick={action((_) => {
                state.ast = asObservable(dataModel)
                storeAst(undefined)
                state.isStored = false
                state.isResetIndication = true
                setTimeout(action(() => {
                    state.isResetIndication = false
                }), 1500)
            })}
        >Reset data model</button> {state.isResetIndication && <span className="indication">- reset</span>}
    </div>
    <h3>Generated code</h3>
    <pre className="code">{generateCode(state.ast)}</pre>
</div>)


render(
    <App />,
    document.getElementById("root")
)

