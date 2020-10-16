import { observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import { render } from "react-dom"

require("./styling.css")


import { exampleAst } from "./example-ast"
import { generateCode } from "./generation"
import { Projection } from "./projection"


const ast = observable(exampleAst)

const App = observer(() => <div>
    <Projection value={ast} ancestors={[]} />
    <h3>Generated code</h3>
    <pre className="code">{generateCode(ast)}</pre>
</div>)


render(
    <App />,
    document.getElementById("root")
)

