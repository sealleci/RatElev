import { describe, expect, it } from 'vitest'
import { DialogueBlockSnapshotSchema } from './saveV1.schema'

describe('DialogueBlockSnapshotSchema', () => {
    it('Accept 0 curStepIndex', () => {
        const result = DialogueBlockSnapshotSchema.assert({
            id: 'block:intro',
            curStepIndex: 0
        })

        expect(result.curStepIndex).toBe(0)
    })

    it('Reject negative curStepIndex', () => {
        expect(() => {
            DialogueBlockSnapshotSchema.assert({
                id: 'block:intro',
                curStepIndex: -1
            })
        }).toThrow()
    })
})
