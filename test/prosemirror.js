// eslint-disable-next-line import/named
import { builders } from 'prosemirror-test-builder'
import { EditorState } from 'prosemirror-state'

import schema from '../components/editor/schema'

const out = builders(schema, {
    p: { nodeType: 'paragraph' },
    b: { markType: 'bold' },
})

function type(state, text) {
    return state.apply(state.tr.insertText(text))
}

function remove(state, from, to) {
    return state.apply(state.tr.delete(from, to))
}

function command(state, command) {
    command(state, (tr) => (state = state.apply(tr)))
    return state
}

function mkState(config) {
    return EditorState.create({
        schema,
        ...config,
    })
}

export { out, type, remove, command, mkState }
