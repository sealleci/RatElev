import { type SaveDataV1, SaveDataV1Schema } from './schemas/saveV1.schema'

export function parseSaveV1(rawSave: string): SaveDataV1 {
    const parsedSave: unknown = JSON.parse(rawSave)

    return SaveDataV1Schema.assert(parsedSave)
}
