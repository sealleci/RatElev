import { type } from 'arktype'

const SignalSnapshotSchema = type({
    id: 'string > 0',
    status: "'inactive' | 'active'"
})

const QuestSnapshotSchema = type({
    id: 'string > 0',
    status: "'inactive' | 'active' | 'completed'"
})

export const DialogueBlockSnapshotSchema = type({
    id: 'string > 0',
    curStepIndex: 'number.integer >= 0'
})

const DialogueSceneSnapshotSchema = type({
    id: 'string > 0',
    curDialogueBlockId: 'string',
    visitedDialogueBlockIds: 'string[]',
    dialogueBlocks: DialogueBlockSnapshotSchema.array()
})

const FloorSnapshotSchema = type({
    id: 'string > 0',
    dialogueScene: DialogueSceneSnapshotSchema
})

const StorylineSnapshotSchema = type({
    id: 'string > 0',
    curSignalIndex: 'number.integer >= 0'
})

const FloorButtonSnapshotSchema = type({
    floorNumber: 'number.integer',
    isAvailable: 'boolean'
})

const GameSnapshotSchema = type({
    languageId: "'zh-CN' | 'en' | 'ru'",
    curFloorNumber: 'number.integer',
    floorButtons: FloorButtonSnapshotSchema.array(),
    passengerIds: 'string[]',
    questIds: 'string[]'
})

export const SaveDataV1Schema = type({
    schemaVersion: '1',
    contentVersion: 'string > 0',

    signals: SignalSnapshotSchema.array(),
    quests: QuestSnapshotSchema.array(),
    floors: FloorSnapshotSchema.array(),
    storylines: StorylineSnapshotSchema.array(),
    game: GameSnapshotSchema
}).onDeepUndeclaredKey('reject')

export type SaveDataV1 = typeof SaveDataV1Schema.infer
