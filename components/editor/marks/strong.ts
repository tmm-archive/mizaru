import { DOMOutputSpec } from 'prosemirror-model'

import { Mark } from '../utils'

class Strong extends Mark {
    get name() {
        return 'strong'
    }

    get schema() {
        return {
            parseDOM: [
                {
                    tag: 'strong',
                },
                {
                    tag: 'b',
                    getAttrs: (node: string | Node) =>
                        (node as HTMLElement).style.fontWeight !== 'normal' &&
                        null,
                },
                {
                    style: 'font-weight',
                    getAttrs: (value: string | Node) =>
                        /^(bold(er)?|[5-9]\d{2,})$/.test(value as string) &&
                        null,
                },
            ],
            toDOM: (): DOMOutputSpec => ['strong'],
        }
    }
}

export default Strong