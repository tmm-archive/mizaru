import { Node as ProsemirrorNode } from 'prosemirror-model'
import { Plugin, PluginKey } from 'prosemirror-state'

import { Lexer } from 'marked'

import { Decoration, DecorationSet } from 'prosemirror-view'

import { Plugin as PluginExtension, checkActive } from '../utils'
import Parser, { Decorations, Marks } from '../parser'
import { DecorationType } from '../types'

const key = new PluginKey('markdown')

class Markdown extends PluginExtension {
    results: { decorations: Decorations; marks: Marks } = {
        decorations: [],
        marks: [],
    }

    get name() {
        return 'markdown'
    }

    render(doc: ProsemirrorNode) {
        doc.descendants((node, pos) => {
            if (node.isBlock) {
                const lexer = new Lexer()
                const tokens = lexer.lex(node.textContent)
                const parser = new Parser({ offset: pos + 1 })
                // @ts-ignore
                const elements = parser.parse(tokens)
                const { marks, decorations } = elements
                this.results = {
                    decorations: [...this.results.decorations, ...decorations],
                    marks: [...this.results.marks, ...marks],
                }
            }
        })
    }

    get decorations() {
        return this.results.decorations.map((deco) => {
            const attrs = {
                class: deco.type ?? DecorationType.Syntax,
            }
            return Decoration.inline(deco.from, deco.to, attrs)
        })
    }

    private createDeco(doc: ProsemirrorNode) {
        this.results = { decorations: [], marks: [] }
        this.render(doc)
        return this.decorations
            ? DecorationSet.create(doc, this.decorations)
            : []
    }

    plugins() {
        return [
            new Plugin({
                key,
                state: {
                    init: (_config, instance) => {
                        return this.createDeco(instance.doc)
                    },
                    apply: (tr, value, _oldState, _newState) => {
                        if (tr.docChanged) {
                            return this.createDeco(tr.doc)
                        }
                        return value
                    },
                },
                props: {
                    decorations(state) {
                        // @ts-ignore
                        return this.getState(state)
                    },
                },
                appendTransaction: (_transactions, _oldState, newState) => {
                    const tr = newState.tr
                    const { doc, selection, schema } = newState
                    tr.removeMark(0, doc.textContent.length)
                    this.results.marks.forEach(({ type, ...rest }) => {
                        const { from, to } = rest
                        const active = checkActive(from, to, selection)
                        const attrs = {
                            ...rest.attrs,
                            active,
                        }
                        const mark = schema.mark(type, attrs)

                        tr.addMark(from, to, mark)
                        tr.removeStoredMark(mark)
                    })

                    return tr
                },
            }),
        ]
    }
}

export default Markdown
