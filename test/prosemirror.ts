// eslint-disable-next-line import/named
import { builders } from 'prosemirror-test-builder'
import { Mark, Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorState, Plugin, Selection } from 'prosemirror-state'
import { Schema } from 'prosemirror-model'

function headings(attrs: object) {
    return [1, 2, 3, 4, 5, 6].reduce(
        (obj, cur, _i) => ({
            ...obj,
            [`h${cur}`]: { nodeType: 'heading', level: cur, ...attrs },
        }),
        {},
    )
}

function marks(attrs: object) {
    return ['delete', 'emphasis', 'inlineCode', 'strong'].reduce(
        (obj, cur, _i) => ({
            ...obj,
            [cur]: { nodeType: cur, ...attrs },
        }),
        {},
    )
}

function out(schema: Schema, options: { node: object; mark: object }) {
    return builders(schema, {
        ...headings(options?.node),
        ...marks(options?.mark),
        p: { nodeType: 'paragraph' },
    })
}

function type(state: EditorState, text: string) {
    return state.apply(state.tr.insertText(text))
}

function remove(state: EditorState, from: number, to: number) {
    return state.apply(state.tr.delete(from, to))
}

function backspace(state: EditorState, count: number) {
    return remove(state, state.doc.content.size - count, state.doc.content.size)
}

function mkState(config: {
    schema?: Schema | any
    doc?: ProsemirrorNode | null
    selection?: Selection | null
    storedMarks?: Mark[] | null
    plugins?: Array<Plugin<any, any>> | null
}) {
    return EditorState.create(config)
}

export { out, backspace, type, remove, mkState }
