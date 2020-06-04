import { Parent as UnistParent } from 'unist'

import { NodeType } from '../../../types'
import { Node, Parent } from '../types'

function modifier(node: Node, index: number, parent: UnistParent) {
    const isSyntax = node.type === NodeType.Syntax
    if (isSyntax) return

    const { children, raw } = <Parent>parent
    const isFirst = index === 0
    const isLast = index === children.length - 1

    const syntaxChar = raw.startsWith('**') ? '**' : '__'
    const syntaxChild = {
        type: NodeType.Syntax,
        value: syntaxChar,
    }

    if (isFirst) parent.children.unshift(syntaxChild)
    if (isLast) parent.children.push(syntaxChild)
}

export default modifier