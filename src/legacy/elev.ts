type NestedArray<T> = Array<NestedArray<T> | T>
type ActionFunction = () => void

enum SignalStatus {
    INACTIVE = 'inactive',
    ACTIVE = 'active'
}

enum QuestStatus {
    INACTIVE = 'inactive',
    ACTIVE = 'active',
    COMPLETED = 'completed'
}

enum LiftingStatus {
    UP = 'up',
    DOWN = 'down',
    BOTH = 'both',
    IDLE = 'idle'
}

enum DialogueBlockStepKind {
    DIALOGUE = 'dialogue',
    CHOICE = 'choice'
}

enum DialogueLayout {
    LEFT = 'left',
    RIGHT = 'right',
    MIDDLE = 'middle'
}

enum SpinnerDotColor {
    DARK = 'dark',
    LIGHT = 'light'
}

enum MovingMotion {
    OPENING = 'opening',
    CLOSING = 'closing',
    IDLE = 'idle'
}

enum LanguageSwitchMotion {
    ROTATING_LEFT = 'rotating_left',
    ROTATING_RIGHT = 'rotating_right',
    IDLE = 'idle'
}

interface Identifiable {
    id: string
    toString: () => string
}

interface LanguageInfo {
    id: string
    name: string
}

type LocalizedTextMap = Record<string, string>
type UITextDefinitions = Record<string, LocalizedTextMap>
type UITextCatalog = Record<string, LocalizedText>

interface Background {
    bgColor: string
    innerHTML: string
}

type DialogueBlockToIncomingSignalsMap = Record<string, string[]>

type SignalToFloorMap = Record<string, string>

interface StorylineStage {
    /**
     * regex: /[^_]+_sig/
     */
    signalId: string
    /**
     * regex: /[^_]+_flr/
     */
    floorId: string
}

interface PendingFloor {
    index: number
    floorNumber: number
}

interface BindingButtonInfo {
    selector: string
    onClick: (this: HTMLElement, event: MouseEvent) => void
}

interface SignalSnapshot {
    /**
     * regex: /[^_]+_sig/
     */
    id: string
    status: string
}

interface QuestSnapshot {
    /**
     * regex: /[^_]+_tsk/
     */
    id: string
    status: string
}

interface FloorButtonSnapshot {
    floorNumber: number
    isAvailable: boolean
}

interface DialogueBlockSnapshot {
    id: string
    curStepIndex: number
}

interface DialogueSceneSnapshot {
    /**
     * regex: /[^_]+_dsc/
     */
    id: string
    curDialogueBlockId: string
    visitedDialogueBlockIds: string[]
    dialogueBlocks: DialogueBlockSnapshot[]
}

interface FloorSnapshot {
    id: string
    dialogueScene: DialogueSceneSnapshot
}

interface GameSnapshot {
    languageId: string
    curFloorNumber: number
    floorButtons: FloorButtonSnapshot[]
    passengerIds: string[]
    questIds: string[]
}

interface SaveData {
    signals: SignalSnapshot[]
    quests: QuestSnapshot[]
    floors: FloorSnapshot[]
    game: GameSnapshot
}

interface SaveRoot {
    status: boolean
    data: SaveData
}

interface SignalDefinition {
    id: string
    status?: SignalStatus
}

interface QuestDefinition {
    id: string
    description: LocalizedTextMap
}

interface ActionDefinition {
    id: string
    onAct: ActionFunction
}

interface ActionDefinition {
    id: string
    onAct: ActionFunction
}

interface PassengerDefinition {
    id: string
    name: LocalizedTextMap
    avatarBgColor: string
    avatarFontColor: string
    avatarText: LocalizedTextMap
}

interface DialogueDefinition {
    passengerId: string
    text: LocalizedTextMap
    actionId?: string
}

interface ChoiceOptionDefinition {
    nextDialogueBlockId: string
    text: LocalizedTextMap
}

interface DialogueBlockDefinition {
    id: string
    incomingSignalIds: string[]
    dialogues: DialogueDefinition[]
    choice?: ChoiceOptionDefinition[]
}

interface DialogueSceneDefinition {
    id: string
    dialogueBlocks: DialogueBlockDefinition[]
}

interface FloorDefinition {
    id: string
    storylineIds: string[]
    background: Background
    dialogueScene: DialogueSceneDefinition
}

interface StorylineDefinition {
    id: string
    priority: number
    stages: StorylineStage[]
    incomingSignalIds: string[]
}

function sleep(delay: number): Promise<void> {
    return new Promise<void>(resolve => {
        setTimeout(resolve, delay)
    })
}

function getRandomInt(minValue: number, maxValue?: number): number {
    if (maxValue === undefined) {
        maxValue = minValue
        minValue = 0
    }

    return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue
}

function range(rangeIndex: number, endIndex?: number): number[] {
    let startIndex = rangeIndex

    if (endIndex === undefined) {
        if (rangeIndex <= 0) {
            return []
        }

        startIndex = 0
        endIndex = rangeIndex
    }

    if (startIndex > endIndex) {
        ;[startIndex, endIndex] = [endIndex, startIndex]
    }

    const rangeArray: number[] = []

    for (let i = startIndex; i < endIndex; i += 1) {
        rangeArray.push(i)
    }

    return rangeArray
}

function flattenArray<T>(nestedArray: NestedArray<T>): T[] {
    return nestedArray.flatMap(item => (Array.isArray(item) ? flattenArray(item) : [item]))
}

function clearChildren(element: HTMLElement) {
    for (const child of Array.from(element.childNodes)) {
        element.removeChild(child)
    }
}

function toggleElementClass(element: HTMLElement, className: string) {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
}

function addElementClass(element: HTMLElement, className: string) {
    if (!element.classList.contains(className)) {
        element.classList.add(className)
    }
}

function removeElementClass(element: HTMLElement, className: string) {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    }
}

function padLeftZero(value: number): string {
    const valueString = value.toString()

    return /^[0-9]$/.test(valueString) ? `0${valueString}` : valueString
}

function getNumberFromId(id: string): string {
    const matchResult = id.match(/[^_]+/)

    return matchResult === null || matchResult.length <= 0 ? '' : matchResult[0]
}

const qs = (selector: string): HTMLElement => document.querySelector(selector as string)!

const qsa = (selector: string): NodeListOf<HTMLElement> =>
    document.querySelectorAll(selector as string)

class LocalizedText {
    private data: LocalizedTextMap

    constructor(data: LocalizedTextMap) {
        this.data = data
    }

    get(key: string): string {
        if (key in this.data) {
            return this.data[key]
        }

        return ''
    }

    set(key: string, value: string) {
        if (!LANGUAGE_INFO_LIST.containsKey(key)) {
            return
        }

        this.data[key] = value
    }

    toString(): string {
        const fields = Object.keys(this.data)
            .map(key => `"${key}":"${this.get(key)}"`)
            .join(',')

        return `{${fields}}`
    }
}

class Signal {
    /**
     * regex: /[^_]+_sig/
     */
    public id: string
    public status: SignalStatus

    constructor(id: string, status?: SignalStatus) {
        this.id = id
        this.status = status ?? SignalStatus.INACTIVE
    }

    isActive(): boolean {
        return this.status === SignalStatus.ACTIVE
    }

    activate() {
        this.status = SignalStatus.ACTIVE
    }

    deactivate() {
        this.status = SignalStatus.INACTIVE
    }

    getSnapshot(): SignalSnapshot {
        return {
            id: this.id,
            status: this.status.toString()
        }
    }

    toString(): string {
        return JSON.stringify(this.getSnapshot())
    }

    static convertToEnum(status: string): SignalStatus {
        return status === 'active' ? SignalStatus.ACTIVE : SignalStatus.INACTIVE
    }
}

class Quest {
    /**
     * regex: /[^_]+_tsk/
     */
    public id: string
    public description: LocalizedText
    public status: QuestStatus

    constructor(id: string, description: LocalizedText, status?: QuestStatus) {
        this.id = id
        this.description = description
        this.status = status ?? QuestStatus.INACTIVE
    }

    isActive(): boolean {
        return this.status === QuestStatus.ACTIVE
    }

    isCompleted(): boolean {
        return this.status === QuestStatus.COMPLETED
    }

    activate() {
        this.status = QuestStatus.ACTIVE
    }

    deactivate() {
        this.status = QuestStatus.INACTIVE
    }

    complete() {
        this.status = QuestStatus.COMPLETED
    }

    getSnapshot(): QuestSnapshot {
        return {
            id: this.id,
            status: this.status.toString()
        }
    }

    toString(): string {
        return JSON.stringify(this.getSnapshot())
    }

    static convertToEnum(status: string): QuestStatus {
        return status === 'active'
            ? QuestStatus.ACTIVE
            : status === 'finished'
              ? QuestStatus.COMPLETED
              : QuestStatus.INACTIVE
    }
}

class Action {
    /**
     * regex: /[^_]+_act/
     */
    public id: string
    public onAct: () => void

    constructor(id: string, onAct: () => void = () => {}) {
        this.id = id
        this.onAct = onAct
    }

    act() {
        this.onAct()
    }

    static getDeactivateSignalAction(id: string): () => void {
        return () => {
            SIGNAL_LIST.deactivate(id)
        }
    }

    static getActivateSignalAction(id: string): () => void {
        return () => {
            SIGNAL_LIST.activate(id)
        }
    }

    static getDeactivateQuestAction(id: string): () => void {
        return () => {
            QUEST_LIST.deactivate(id)
            game.questPanel.remove(id)
            game.questPanel.render(game.languageId)
        }
    }

    static getActivateQuestAction(id: string): () => void {
        return () => {
            QUEST_LIST.activate(id)
            game.questPanel.add(id)
            game.questPanel.render(game.languageId)
        }
    }

    static getCompleteQuestAction(id: string): () => void {
        return () => {
            QUEST_LIST.complete(id)
            game.questPanel.render(game.languageId)
        }
    }
    static getAddPassengerAction(id: string): () => void {
        return () => {
            game.passengerPanel.add(id)
            game.passengerPanel.render(game.languageId)
        }
    }

    static getRemovePassengerAction(id: string): () => void {
        return () => {
            game.passengerPanel.remove(id)
            game.passengerPanel.render(game.languageId)
        }
    }

    static getAdvancePlotAction(id: string): () => void {
        return () => {
            STORYLINE_LIST.getById(id)?.advance()
        }
    }

    static combineActions(...actions: ActionFunction[]): ActionFunction {
        return () => {
            actions.forEach(onAct => {
                onAct()
            })
        }
    }
}

class Passenger {
    /**
     * regex: /[^_]+_psg/
     */
    public id: string
    public name: LocalizedText
    public avatarBgColor: string
    public avatarFontColor: string
    public avatarText: LocalizedText
    public isVisible: boolean

    constructor(
        id: string,
        name: LocalizedText,
        avatarBgColor: string,
        avatarFontColor: string,
        avatarText: LocalizedText,
        isVisible: boolean = true
    ) {
        this.id = id
        this.name = name
        this.avatarBgColor = avatarBgColor
        this.avatarFontColor = avatarFontColor
        this.avatarText = avatarText
        this.isVisible = isVisible
    }
}

abstract class AbstractList<T extends Identifiable> {
    protected data: T[]

    constructor() {
        this.data = []
    }

    get length(): number {
        return this.data.length
    }

    contains(id: string): boolean {
        for (let i = 0; i < this.data.length; i += 1) {
            if (this.data[i].id === id) {
                return true
            }
        }

        return false
    }

    getById(id: string): T | undefined {
        for (const item of this.data) {
            if (item.id === id) {
                return item
            }
        }

        return undefined
    }

    toString(): string {
        return `[${this.data.map(item => item.toString()).join(',')}]`
    }
}

abstract class DialogueBlockStep {
    /**
     * regex: /[^_]+_dlg|[^_]+_chc/
     */
    public id: string
    public kind: DialogueBlockStepKind

    constructor(id: string, kind: DialogueBlockStepKind = DialogueBlockStepKind.DIALOGUE) {
        this.id = id
        this.kind = kind
    }

    isDialogue(): this is Dialogue {
        return this.kind === DialogueBlockStepKind.DIALOGUE
    }

    isChoice(): this is Choice {
        return this.kind === DialogueBlockStepKind.CHOICE
    }
}

class ChoiceOption {
    /**
     * regex: /[^_]+_[^_]+_opt/
     */
    public id: string
    /**
     * regex: /[^_]+_dlg/
     */
    public nextDialogueBlockId: string
    public text: LocalizedText

    constructor(id: string, nextDialogueBlockId: string, text: LocalizedText) {
        this.id = id
        this.nextDialogueBlockId = nextDialogueBlockId
        this.text = text
    }

    static splitId(id: string): [string, string] {
        const matchResult = id.match(/^([^_]+)_([^_]+)_opt$/)
        let id1 = ''
        let id2 = ''

        if (matchResult !== null) {
            if (matchResult.length > 1) {
                id1 = matchResult[1]
            }

            if (matchResult.length > 2) {
                id2 = matchResult[2]
            }
        }

        return [id1, id2]
    }
}

class Choice extends DialogueBlockStep {
    public options: ChoiceOption[]

    constructor(id: string, optionDefinitions: ChoiceOptionDefinition[] = []) {
        super(id, DialogueBlockStepKind.CHOICE)

        this.options = []

        for (let i = 0; i < optionDefinitions.length; i += 1) {
            this.options.push(
                new ChoiceOption(
                    `${padLeftZero(i)}_${getNumberFromId(this.id)}_opt`,
                    optionDefinitions[i].nextDialogueBlockId,
                    new LocalizedText(optionDefinitions[i].text)
                )
            )
        }
    }

    getOptionById(id: string): ChoiceOption | undefined {
        for (const option of this.options) {
            if (option.id === id) {
                return option
            }
        }

        return undefined
    }
}

class Dialogue extends DialogueBlockStep {
    /**
     * regex: /[^_]+_psg/
     */
    public passengerId: string
    /**
     * regex: /[^_]+_act/
     */
    public actionId: string
    public text: LocalizedText
    public layout: DialogueLayout
    public hasAction: boolean

    constructor(
        id: string,
        passengerId: string,
        text: LocalizedText,
        layout: DialogueLayout,
        actionId: string = ''
    ) {
        super(id)
        this.passengerId = passengerId
        this.text = text
        this.layout = layout
        this.actionId = actionId
        this.hasAction = actionId === '' ? false : true
    }

    static splitId(id: string): [string, string] {
        const matchResult = id.match(/^([^_]+)_([^_]+)_dlg$/)
        let id1 = ''
        let id2 = ''

        if (matchResult !== null) {
            if (matchResult.length > 1) {
                id1 = matchResult[1]
            }

            if (matchResult.length > 2) {
                id2 = matchResult[2]
            }
        }

        return [id1, id2]
    }

    act() {
        if (this.hasAction) {
            ACTION_LIST.getById(this.actionId)?.act()
        }
    }
}

class DialogueBlock {
    /**
     * regex: /[^_]+_dbk/
     */
    public id: string
    public curStepIndex: number
    public incomingSignalIds: string[]
    public data: DialogueBlockStep[]

    constructor(
        id: string,
        incomingSignalIds: string[],
        dialogueDefinitions: DialogueDefinition[],
        choiceOptionDefinitions?: ChoiceOptionDefinition[]
    ) {
        this.id = id
        this.incomingSignalIds = incomingSignalIds
        this.data = []

        for (let i = 0; i < dialogueDefinitions.length; i += 1) {
            this.data.push(
                new Dialogue(
                    `${padLeftZero(i)}_${getNumberFromId(this.id)}_dlg`,
                    dialogueDefinitions[i].passengerId,
                    new LocalizedText(dialogueDefinitions[i].text),
                    dialogueDefinitions[i].passengerId === PASSENGER_ME_ID
                        ? DialogueLayout.RIGHT
                        : dialogueDefinitions[i].passengerId === PASSENGER_NARRATOR_ID
                          ? DialogueLayout.MIDDLE
                          : DialogueLayout.LEFT,
                    dialogueDefinitions[i].actionId
                )
            )
        }

        if (choiceOptionDefinitions !== undefined && choiceOptionDefinitions.length > 0) {
            this.data.push(new Choice(`${getNumberFromId(this.id)}$_chc`, choiceOptionDefinitions))
        }

        this.curStepIndex = 0
    }

    get length(): number {
        return this.data.length
    }

    getStepByIndex(index: number): DialogueBlockStep | undefined {
        return index < 0 || index >= this.data.length ? undefined : this.data[index]
    }

    getStepById(id: string): DialogueBlockStep | undefined {
        for (const step of this.data) {
            if (step.id === id) {
                return step
            }
        }

        return undefined
    }

    getCurStep(): DialogueBlockStep | undefined {
        return this.getStepByIndex(this.curStepIndex)
    }

    moveToStart() {
        this.curStepIndex = 0
    }

    moveToEnd() {
        this.curStepIndex = this.data.length
    }

    /**
     *
     * range of `curStepIndex` is `[0, length]`, `length` is for the end.
     */
    advance() {
        this.curStepIndex += 1

        if (this.curStepIndex < 0) {
            this.curStepIndex = 0
        }

        if (this.curStepIndex > this.data.length) {
            this.curStepIndex = this.data.length
        }
    }

    isNotAtFirst(): boolean {
        if (this.curStepIndex <= 0 || this.curStepIndex >= this.data.length) {
            return false
        }

        const curStep = this.getCurStep()
        const prevStep = this.getStepByIndex(this.curStepIndex - 1)

        if (
            curStep !== undefined &&
            prevStep !== undefined &&
            !curStep.isChoice() &&
            !prevStep.isChoice() &&
            (curStep as Dialogue).passengerId === (prevStep as Dialogue).passengerId &&
            (curStep as Dialogue).layout === (prevStep as Dialogue).layout
        ) {
            return true
        }

        return false
    }

    isAtEnd(): boolean {
        return this.curStepIndex >= this.data.length
    }

    isUnlocked(): boolean {
        for (const signalId of this.incomingSignalIds) {
            const signal = SIGNAL_LIST.getById(signalId)

            if (!signal?.isActive()) {
                return false
            }
        }

        return true
    }

    endsWithDialogue(): boolean {
        if (this.data.length <= 0) {
            return false
        }

        return !this.data[this.data.length - 1].isChoice()
    }

    getSnapshot(): DialogueBlockSnapshot {
        return {
            id: this.id,
            curStepIndex: this.curStepIndex
        }
    }

    toString(): string {
        return JSON.stringify(this.getSnapshot())
    }
}

class DialogueScene {
    /**
     * regex: /[^_]+_dsc/
     */
    public id: string
    public dialogueBlocks: DialogueBlock[]
    public curDialogueBlockId: string
    public visitedDialogueBlockIds: string[]
    public dialogueBlockToIncomingSignalsMap: DialogueBlockToIncomingSignalsMap

    constructor(id: string, dialogueBlockDefinitions: DialogueBlockDefinition[]) {
        this.id = id
        this.dialogueBlocks = []
        this.dialogueBlockToIncomingSignalsMap = {}
        this.curDialogueBlockId = ''
        this.visitedDialogueBlockIds = []

        for (const dialogueBlockDefinition of dialogueBlockDefinitions) {
            const dialogueBlock = new DialogueBlock(
                dialogueBlockDefinition.id,
                dialogueBlockDefinition.incomingSignalIds,
                dialogueBlockDefinition.dialogues,
                dialogueBlockDefinition.choice
            )

            this.dialogueBlocks.push(dialogueBlock)
            this.dialogueBlockToIncomingSignalsMap[dialogueBlock.id] =
                dialogueBlock.incomingSignalIds
        }
    }

    containsBlock(id: string): boolean {
        for (const block of this.dialogueBlocks) {
            if (block.id === id) {
                return true
            }
        }
        return false
    }

    setCurDialogueBlock(id: string) {
        if (this.containsBlock(id)) {
            this.curDialogueBlockId = id
        }
    }

    getCurDialogueBlock(): DialogueBlock | undefined {
        for (const block of this.dialogueBlocks) {
            if (block.id === this.curDialogueBlockId) {
                return block
            }
        }

        return undefined
    }

    getDialogueBlock(id: string): DialogueBlock | undefined {
        for (const block of this.dialogueBlocks) {
            if (block.id === id) {
                return block
            }
        }

        return undefined
    }

    addVisitedBlock(id: string) {
        if (this.visitedDialogueBlockIds.indexOf(id) !== -1) {
            return
        }

        this.visitedDialogueBlockIds.push(id)
    }

    removeVisitedBlock(id: string) {
        const index = this.visitedDialogueBlockIds.indexOf(id)
        if (index === -1) {
            return
        }

        this.visitedDialogueBlockIds.splice(index, 1)
    }

    getSnapshot(): DialogueSceneSnapshot {
        return {
            id: this.id,
            curDialogueBlockId: this.curDialogueBlockId,
            visitedDialogueBlockIds: this.visitedDialogueBlockIds,
            dialogueBlocks: this.dialogueBlocks.map(dialogueBlock => dialogueBlock.getSnapshot())
        }
    }

    toString(): string {
        return JSON.stringify(this.getSnapshot())
    }
}

class Floor {
    /**
     * regex: /[^_]+_flr/
     */
    public id: string
    public dialogueScene: DialogueScene
    public storylineIds: string[]
    public background: Background

    constructor(
        id: string,
        dialogueScene: DialogueScene,
        storylineIds: string[],
        background?: Background
    ) {
        this.id = id
        this.dialogueScene = dialogueScene
        this.storylineIds = storylineIds
        this.background = background ?? { bgColor: 'rgba(0, 0, 0, .7)', innerHTML: '' }
    }

    updateDialogueBlock(): boolean {
        let selectedBlockId: string = ''
        let maxPriority = -Infinity

        for (const storylineId of this.storylineIds) {
            const storyline = STORYLINE_LIST.getById(storylineId)

            if (
                storyline === undefined ||
                !storyline.isAvailable() ||
                storyline.isCompleted() ||
                storyline.getCurFloorId() !== this.id
            ) {
                continue
            }

            const signalId = storyline.getCurSignalId()
            let hasSelectedBlock = false

            for (const dialogueBlockId of Object.keys(
                this.dialogueScene.dialogueBlockToIncomingSignalsMap
            )) {
                // check whether incoming signals of block includes certain signal
                if (
                    this.dialogueScene.dialogueBlockToIncomingSignalsMap[dialogueBlockId].indexOf(
                        signalId
                    ) === -1
                ) {
                    continue
                }

                // check whether block is available and not completed
                const dialogueBlock = this.dialogueScene.getDialogueBlock(dialogueBlockId)

                if (
                    dialogueBlock === undefined ||
                    !dialogueBlock.isUnlocked() ||
                    this.dialogueScene.curDialogueBlockId === dialogueBlock.id
                ) {
                    continue
                }

                // TODO: no need to advance
                // if storyline's current corresponding block is completed, then advance
                if (dialogueBlock.isAtEnd()) {
                    // storyline.advance()
                    continue
                }

                if (storyline.priority > maxPriority && !hasSelectedBlock) {
                    selectedBlockId = dialogueBlock.id
                    maxPriority = storyline.priority
                    hasSelectedBlock = true
                }
            }
        }

        // only if cur block is completed, new block can be selected
        if (
            this.dialogueScene.curDialogueBlockId === '' ||
            (this.dialogueScene.getCurDialogueBlock()?.isAtEnd() &&
                this.dialogueScene.getCurDialogueBlock()?.endsWithDialogue())
        ) {
            if (this.dialogueScene.curDialogueBlockId !== '') {
                this.dialogueScene.addVisitedBlock(this.dialogueScene.curDialogueBlockId)
            }

            this.dialogueScene.setCurDialogueBlock(selectedBlockId)
        }

        return selectedBlockId !== ''
    }

    getSnapshot(): FloorSnapshot {
        return {
            id: this.id,
            dialogueScene: this.dialogueScene.getSnapshot()
        }
    }

    toString(): string {
        return JSON.stringify(this.getSnapshot())
    }
}

class Storyline {
    /**
     * regex: /[^_]+_stl/
     */
    public id: string
    public priority: number
    public signalToFloorMap: SignalToFloorMap
    public signalIds: string[]
    public incomingSignalIds: string[]
    public curSignalIndex: number

    constructor(
        id: string,
        priority: number,
        stages: StorylineStage[],
        incomingSignalIds: string[] = []
    ) {
        this.id = id
        this.priority = priority
        this.signalToFloorMap = {}
        this.signalIds = []
        this.incomingSignalIds = incomingSignalIds
        this.curSignalIndex = 0

        for (const stage of stages) {
            this.signalToFloorMap[stage.signalId] = stage.floorId
            this.signalIds.push(stage.signalId)
        }
    }

    advance() {
        this.curSignalIndex += 1

        if (this.curSignalIndex < 0) {
            this.curSignalIndex = 0
        }

        if (this.curSignalIndex > this.signalIds.length) {
            this.curSignalIndex = this.signalIds.length
        }
    }

    getCurFloorId(): string {
        if (
            this.curSignalIndex < 0 ||
            this.curSignalIndex >= this.signalIds.length ||
            Object.keys(this.signalToFloorMap).indexOf(this.signalIds[this.curSignalIndex]) === -1
        ) {
            return ''
        }

        return this.signalToFloorMap[this.signalIds[this.curSignalIndex]]
    }

    getCurSignalId(): string {
        if (this.curSignalIndex < 0 || this.curSignalIndex >= this.signalIds.length) {
            return ''
        }

        return this.signalIds[this.curSignalIndex]
    }

    getSignalById(index: number): Signal | undefined {
        if (index < 0 || index >= this.signalIds.length) {
            return undefined
        }

        return SIGNAL_LIST.getById(this.signalIds[index])
    }

    getCurSignal(): Signal | undefined {
        return this.getSignalById(this.curSignalIndex)
    }

    isAvailable(): boolean {
        if (this.incomingSignalIds.length <= 0) {
            return true
        }

        for (const signalId of this.incomingSignalIds) {
            const signal = SIGNAL_LIST.getById(signalId)

            if (signal !== undefined && !signal.isActive()) {
                return false
            }
        }

        return true
    }

    isCompleted(): boolean {
        if (this.signalIds.length <= 0) {
            return true
        }

        if (this.curSignalIndex < this.signalIds.length) {
            return false
        }

        for (const signalId of this.signalIds) {
            const signal = SIGNAL_LIST.getById(signalId)

            if (signal !== undefined && !signal.isActive()) {
                return false
            }
        }

        return true
    }
}

class LanguageInfoList extends AbstractList<LanguageInfo> {
    constructor(data: LanguageInfo[]) {
        super()
        this.data = data
    }

    containsKey(id: string): boolean {
        return this.data.map(item => item.id).indexOf(id) !== -1
    }

    getKeyIndex(id: string): number {
        if (!this.containsKey(id)) {
            return -1
        }

        for (const i of range(this.length)) {
            if (this.data[i].id === id) {
                return i
            }
        }

        return -1
    }

    getItemByIndex(index: number): LanguageInfo {
        if (index < 0) {
            index = 0
        }

        if (index >= this.length) {
            index = this.length - 1
        }

        return this.data[index]
    }

    getItemByKey(id: string): LanguageInfo | undefined {
        for (const item of this.data) {
            if (id === item.id) {
                return item
            }
        }

        return undefined
    }

    getNameByKey(id: string): string {
        if (!this.containsKey(id)) {
            return ''
        }

        const item = this.getItemByKey(id)

        return item !== undefined ? item.name : ''
    }
}

class SignalList extends AbstractList<Signal> {
    constructor(signalDefinitions: SignalDefinition[]) {
        super()

        for (const signalDefinition of signalDefinitions) {
            this.data.push(new Signal(signalDefinition.id, signalDefinition.status))
        }
    }

    initialize() {
        for (const signal of this.data) {
            signal.deactivate()
        }
    }

    isActive(id: string): boolean {
        const signal = this.getById(id)

        return signal !== undefined && signal.status === SignalStatus.ACTIVE
    }

    activate(id: string): boolean {
        const signal = this.getById(id)

        if (signal !== undefined) {
            signal.activate()

            return true
        }

        return false
    }

    deactivate(id: string): boolean {
        const signal = this.getById(id)

        if (signal !== undefined) {
            signal.deactivate()

            return true
        }

        return false
    }

    getSnapshot(): SignalSnapshot[] {
        return this.data.map(signal => signal.getSnapshot())
    }
}

class QuestList extends AbstractList<Quest> {
    constructor(questDefinitions: QuestDefinition[]) {
        super()

        for (const questDefinition of questDefinitions) {
            this.data.push(
                new Quest(questDefinition.id, new LocalizedText(questDefinition.description))
            )
        }
    }

    isActive(id: string): boolean {
        const task = this.getById(id)

        return task !== undefined && task.status === QuestStatus.ACTIVE
    }

    isFinished(id: string): boolean {
        const task = this.getById(id)

        return task !== undefined && task.status === QuestStatus.COMPLETED
    }

    activate(id: string): boolean {
        const task = this.getById(id)

        if (task !== undefined) {
            task.activate()

            return true
        }

        return false
    }

    deactivate(id: string): boolean {
        const task = this.getById(id)

        if (task !== undefined) {
            task.deactivate()

            return true
        }

        return false
    }

    complete(id: string): boolean {
        const task = this.getById(id)

        if (task !== undefined) {
            task.complete()

            return true
        }

        return false
    }

    getSnapshot(): QuestSnapshot[] {
        return this.data.map(quest => quest.getSnapshot())
    }
}

class ActionList extends AbstractList<Action> {
    constructor(actionDefinitions: ActionDefinition[]) {
        super()

        for (const actionDefinition of actionDefinitions) {
            this.data.push(new Action(actionDefinition.id, actionDefinition.onAct))
        }
    }
}

class PassengerList extends AbstractList<Passenger> {
    constructor(passengerDefinitions: PassengerDefinition[]) {
        super()

        for (const passengerDefinition of passengerDefinitions) {
            this.data.push(
                new Passenger(
                    passengerDefinition.id,
                    new LocalizedText(passengerDefinition.name),
                    passengerDefinition.avatarBgColor,
                    passengerDefinition.avatarFontColor,
                    new LocalizedText(passengerDefinition.avatarText)
                )
            )
        }
    }
}

class FloorList extends AbstractList<Floor> {
    constructor(floorDefinitions: FloorDefinition[]) {
        super()

        for (const floorDefinition of floorDefinitions) {
            this.data.push(
                new Floor(
                    floorDefinition.id,
                    new DialogueScene(
                        floorDefinition.dialogueScene.id,
                        floorDefinition.dialogueScene.dialogueBlocks
                    ),
                    floorDefinition.storylineIds,
                    floorDefinition.background
                )
            )
        }
    }

    getSnapshot(): FloorSnapshot[] {
        return this.data.map(floor => floor.getSnapshot())
    }
}

class StoryLineList extends AbstractList<Storyline> {
    constructor(storylineDefinitions: StorylineDefinition[]) {
        super()

        this.data = []

        for (const storylineDefinition of storylineDefinitions) {
            this.data.push(
                new Storyline(
                    storylineDefinition.id,
                    storylineDefinition.priority,
                    storylineDefinition.stages,
                    storylineDefinition.incomingSignalIds
                )
            )
        }
    }

    getById(id: string): Storyline | undefined {
        for (const storyline of this.data) {
            if (storyline.id === id) {
                return storyline
            }
        }

        return undefined
    }
}

class Spinner {
    private dots: HTMLElement[]
    private frames: SpinnerDotColor[][]
    private step: number
    private timer: number | undefined
    private interval: number

    constructor() {
        this.dots = []
        this.frames = []
        this.step = 0
        this.timer = undefined
        this.interval = 250
    }

    generateFrames(frameCount: number): SpinnerDotColor[][] {
        const frames: number[][] = []

        if (frameCount === 0) {
            return []
        }

        for (const i of range(frameCount * 2)) {
            if (i === 0) {
                frames.push(Array(frameCount).fill(0))
            } else {
                const frame = [...frames[i - 1]]
                let areAllDotsSameColor = true

                for (const j of range(frame.length)) {
                    if (j !== 0 && frame[j - 1] !== frame[j]) {
                        frame[j] = frame[j - 1]
                        areAllDotsSameColor = false

                        break
                    }
                }

                if (areAllDotsSameColor) {
                    frame[0] ^= 1
                }

                frames.push(frame)
            }
        }

        return frames.map(frame =>
            frame.map(dotColor => (dotColor === 0 ? SpinnerDotColor.DARK : SpinnerDotColor.LIGHT))
        )
    }

    toggleDotColor(dotElement: HTMLElement, dotColor: SpinnerDotColor) {
        switch (dotColor) {
            case SpinnerDotColor.DARK:
                removeElementClass(dotElement, 'light-dot')
                addElementClass(dotElement, 'dark-dot')

                break
            case SpinnerDotColor.LIGHT:
                removeElementClass(dotElement, 'dark-dot')
                addElementClass(dotElement, 'light-dot')

                break
            default:
                break
        }
    }

    start() {
        this.dots = Array.from(qsa('#spinner .spinner-dot'))
        this.frames = this.generateFrames(this.dots.length)
        window.clearInterval(this.timer)
        this.timer = window.setInterval(() => {
            for (const i of range(this.frames[this.step].length)) {
                this.toggleDotColor(this.dots[i], this.frames[this.step][i])
            }
            this.step = (this.step + 1) % this.frames.length
        }, this.interval)
    }

    stop() {
        window.clearInterval(this.timer)
    }
}

class FloorButton {
    public floorNumber: number
    public text: string
    public isAvailable: boolean
    // public isSelected: boolean

    constructor(floorNumber: number, text: string, isAvailable: boolean) {
        this.floorNumber = floorNumber
        this.text = text
        this.isAvailable = isAvailable
        // this.isSelected = false
    }

    getSnapshot(): FloorButtonSnapshot {
        return {
            floorNumber: this.floorNumber,
            isAvailable: this.isAvailable
        }
    }

    toString(): string {
        return JSON.stringify(this.getSnapshot())
    }
}

abstract class MovableEntity {
    public isMoving: boolean
    public isOpen: boolean
    protected motion: MovingMotion
    protected stepCount: number
    protected step: number
    protected stepInterval: number

    constructor(stepCount: number, stepInterval: number) {
        this.isMoving = false
        this.isOpen = false
        this.motion = MovingMotion.IDLE
        this.step = 0
        this.stepCount = stepCount
        this.stepInterval = stepInterval
    }

    stop() {
        this.isMoving = false

        switch (this.motion) {
            case MovingMotion.OPENING:
                this.isOpen = true
                this.motion = MovingMotion.IDLE

                break
            case MovingMotion.CLOSING:
                this.isOpen = false
                this.motion = MovingMotion.IDLE

                break
            default:
                break
        }
    }

    protected abstract move(curStep: number): void

    protected abstract prepare(motion: MovingMotion): void

    protected *run(motion: MovingMotion): Generator<void> {
        this.prepare(motion)

        try {
            for (const i of range(this.stepCount)) {
                this.move(i + 1)

                yield
            }
        } finally {
            this.stop()
        }
    }

    syncStart(motion: MovingMotion) {
        for (const _ of this.run(motion)) {
        }
    }

    async start(motion: MovingMotion): Promise<void> {
        for (const _ of this.run(motion)) {
            await sleep(this.stepInterval)
        }
    }
}

class Door extends MovableEntity {
    private leftPart: HTMLElement
    private rightPart: HTMLElement

    constructor() {
        super(20, 6)

        this.leftPart = qs('#elev-door>div:nth-child(1)')
        this.rightPart = qs('#elev-door>div:nth-child(2)')
    }

    override move(curStep: number) {
        const leftPartPositionLeft = parseInt(this.leftPart.style.left)
        const rightPartPositionLeft = parseInt(this.rightPart.style.left)

        switch (this.motion) {
            case MovingMotion.OPENING:
                this.leftPart.style.left = `${leftPartPositionLeft - this.step}px`
                this.rightPart.style.left = `${rightPartPositionLeft + this.step}px`

                if (curStep >= this.stepCount) {
                    qs('#elev-door').style.display = 'none'
                }

                break
            case MovingMotion.CLOSING:
                this.leftPart.style.left = `${leftPartPositionLeft + this.step}px`
                this.rightPart.style.left = `${rightPartPositionLeft - this.step}px`

                break
            default:
                this.stop()

                break
        }
    }

    override prepare(motion: MovingMotion): void {
        this.motion = motion
        this.isMoving = true
        this.step = Math.ceil(this.leftPart.clientWidth / this.stepCount)
        qs('#elev-door').style.display = 'flex'
    }
}

class PendingFloorQueue {
    public data: PendingFloor[]

    constructor() {
        this.data = []
    }

    get length(): number {
        return this.data.length
    }

    clear() {
        this.data = []
    }

    sort() {
        for (let i = 0; i < this.data.length; i += 1) {
            this.data[i].index = i
        }
    }

    indexOf(value: number): number {
        for (let i = 0; i < this.data.length; i += 1) {
            if (this.data[i].floorNumber === value) {
                return i
            }
        }

        return -1
    }

    add(value: number) {
        if (this.indexOf(value) === -1) {
            this.data.push({ floorNumber: value, index: this.data.length })
            this.sort()
        }
    }

    remove(value: number) {
        const i = this.indexOf(value)

        if (i !== -1) {
            this.data.splice(i, 1)
            this.sort()
        }
    }

    getHighestFloor(): PendingFloor {
        let targetIndex = 0

        if (this.data.length <= 0) {
            return { floorNumber: 0, index: -1 }
        }

        for (let i = 0; i < this.data.length; i += 1) {
            if (this.data[i].floorNumber > this.data[targetIndex].floorNumber) {
                targetIndex = i
            }
        }

        return this.data[targetIndex]
    }

    getLowestFloor(): PendingFloor {
        let targetIndex = 0

        if (this.data.length <= 0) {
            return { floorNumber: 0, index: -1 }
        }

        for (let i = 0; i < this.data.length; i += 1) {
            if (this.data[i].floorNumber < this.data[targetIndex].floorNumber) {
                targetIndex = i
            }
        }

        return this.data[targetIndex]
    }
}

class FloorPanel {
    private floorNumberElement: HTMLElement
    private upIcon: HTMLElement
    private downIcon: HTMLElement
    private static randomTimer: number | undefined
    private static prevRandomFloorNumber: number | undefined

    constructor() {
        this.floorNumberElement = qs('#floor-number')
        this.upIcon = qs('#up-icon')
        this.downIcon = qs('#down-icon')
        FloorPanel.randomTimer = undefined
        FloorPanel.prevRandomFloorNumber = undefined
    }

    updateIcon(liftingStatus: LiftingStatus) {
        const className = 'invisible'

        switch (liftingStatus) {
            case LiftingStatus.UP:
                removeElementClass(this.upIcon, className)
                addElementClass(this.downIcon, className)

                break
            case LiftingStatus.DOWN:
                removeElementClass(this.downIcon, className)
                addElementClass(this.upIcon, className)

                break
            case LiftingStatus.IDLE:
                addElementClass(this.upIcon, className)
                addElementClass(this.downIcon, className)

                break
            case LiftingStatus.BOTH:
                removeElementClass(this.upIcon, className)
                removeElementClass(this.downIcon, className)

                break
            default:
                break
        }
    }

    updateFloorNumber(floorNumber: number) {
        this.floorNumberElement.textContent = floorNumber.toString()
    }

    static startFloorNumberScramble() {
        FloorPanel.prevRandomFloorNumber = parseInt(qs('#floor-number').textContent)
        FloorPanel.randomTimer = window.setInterval(() => {
            const floorNumberElement = qs('#floor-number')

            floorNumberElement.textContent = getRandomInt(-99, 99).toString()
        }, 200)
    }

    static stopFloorNumberScramble() {
        if (FloorPanel.randomTimer !== undefined) {
            clearInterval(FloorPanel.randomTimer)

            const floorNumberElement = qs('#floor-number')

            floorNumberElement.textContent = (FloorPanel.prevRandomFloorNumber ?? 0).toString()
        }
    }
}

class SavePanel extends MovableEntity {
    private coverElement: HTMLElement

    constructor() {
        super(15, 5)

        this.coverElement = qs('#save-panel-cover')
    }

    override move(curStep: number) {
        const cover_top = parseInt(this.coverElement.style.top)
        switch (this.motion) {
            case MovingMotion.OPENING:
                this.coverElement.style.top = `${cover_top - this.step}px`

                break
            case MovingMotion.CLOSING:
                this.coverElement.style.top = `${cover_top + this.step}px`

                break
            default:
                break
        }
    }

    override prepare(motion: MovingMotion) {
        this.motion = motion
        this.step = Math.ceil(this.coverElement.clientHeight / this.stepCount)
    }
}

class LanguagePanel {
    private curLanguageIndex: number
    private nextLanguageIndex: number
    public isMoving: boolean
    private motion: LanguageSwitchMotion
    private sectorAngle: number
    private initialAngle: number
    private step: number
    private stepAngle: number
    private stepCount: number
    private stepInterval: number
    private wheelELement: HTMLElement

    constructor() {
        this.curLanguageIndex = 0
        this.nextLanguageIndex = 0
        this.isMoving = false
        this.motion = LanguageSwitchMotion.IDLE
        this.sectorAngle = 90
        this.initialAngle = -45
        this.step = 0
        this.stepAngle = 0
        this.stepCount = 15
        this.stepInterval = 8
        this.wheelELement = qs('#lang-name-body')
    }

    stop() {
        this.isMoving = false
        this.motion = LanguageSwitchMotion.IDLE
        this.step = 0
        this.curLanguageIndex = this.nextLanguageIndex

        qs('#lang-name-prev>.lang-name-text').textContent = ''
        qs('#lang-name-cur>.lang-name-text').textContent = LANGUAGE_INFO_LIST.getItemByIndex(
            this.curLanguageIndex
        ).name
        qs('#lang-name-next>.lang-name-text').textContent = ''

        this.wheelELement.style.transform = `rotate(${this.initialAngle}deg)`
    }

    private move() {
        this.step += 1

        switch (this.motion) {
            case LanguageSwitchMotion.ROTATING_LEFT:
                this.wheelELement.style.transform = `rotate(${this.initialAngle - this.stepAngle * this.step}deg)`

                break
            case LanguageSwitchMotion.ROTATING_RIGHT:
                this.wheelELement.style.transform = `rotate(${this.initialAngle + this.stepAngle * this.step}deg)`

                break
            default:
                break
        }
    }

    private prepare(motion: LanguageSwitchMotion) {
        this.motion = motion
        this.isMoving = true
        this.stepAngle = Math.ceil(this.sectorAngle / this.stepCount)

        switch (this.motion) {
            case LanguageSwitchMotion.ROTATING_LEFT:
                this.nextLanguageIndex = (this.curLanguageIndex + 1) % LANGUAGE_INFO_LIST.length

                qs('#lang-name-prev>.lang-name-text').textContent = ''
                qs('#lang-name-next>.lang-name-text').textContent =
                    LANGUAGE_INFO_LIST.getItemByIndex(this.nextLanguageIndex).name

                break
            case LanguageSwitchMotion.ROTATING_RIGHT:
                this.nextLanguageIndex =
                    (this.curLanguageIndex - 1 + LANGUAGE_INFO_LIST.length) %
                    LANGUAGE_INFO_LIST.length

                qs('#lang-name-prev>.lang-name-text').textContent =
                    LANGUAGE_INFO_LIST.getItemByIndex(this.nextLanguageIndex).name
                qs('#lang-name-next>.lang-name-text').textContent = ''

                break
            default:
                break
        }
    }

    private *run(motion: LanguageSwitchMotion): Generator<void> {
        this.prepare(motion)

        try {
            for (const _ of range(this.stepCount)) {
                this.move()

                yield
            }
        } finally {
            this.stop()
        }
    }

    syncStart(motion: LanguageSwitchMotion) {
        for (const _ of this.run(motion)) {
        }
    }

    async start(motion: LanguageSwitchMotion) {
        for (const _ of this.run(motion)) {
            await sleep(this.stepInterval)
        }
    }

    setLanguage(languageId: string) {
        let languageIndex = LANGUAGE_INFO_LIST.getKeyIndex(languageId)

        if (languageIndex === -1) {
            languageIndex = 0
        }

        this.curLanguageIndex = languageIndex

        qs('#lang-name-prev>.lang-name-text').textContent = ''
        qs('#lang-name-cur>.lang-name-text').textContent = LANGUAGE_INFO_LIST.getItemByIndex(
            this.curLanguageIndex
        ).name
        qs('#lang-name-next>.lang-name-text').textContent = ''
    }

    getLanguageId(): string {
        return LANGUAGE_INFO_LIST.getItemByIndex(this.curLanguageIndex).id
    }
}

abstract class DisplayList<T> {
    public data: string[]

    constructor(id_list: string[] = []) {
        this.data = id_list
    }

    add(id: string) {
        if (this.data.indexOf(id) !== -1) {
            return
        }

        this.data.push(id)
    }

    remove(id: string) {
        const index = this.data.indexOf(id)
        if (index === -1) {
            return
        }
        this.data.splice(index, 1)
    }

    reset(data: string[]) {
        this.data = data
    }

    getSnapshot(): string[] {
        return this.data
    }

    toString(): string {
        return JSON.stringify(this.getSnapshot())
    }

    abstract getValidCount(): number
    abstract getByIndex(index: number): T | undefined
    abstract render(languageId: string): void
}

class PassengerPanel extends DisplayList<Passenger> {
    constructor(passengerIds: string[] = []) {
        super(passengerIds)
    }

    override getValidCount(): number {
        let count = 0

        for (const passengerId of this.data) {
            const passenger = PASSENGER_LIST.getById(passengerId)

            if (passenger !== undefined && passenger.isVisible) {
                count += 1
            }
        }

        return count
    }

    override getByIndex(index: number): Passenger | undefined {
        if (index < 0 || index >= this.data.length) {
            return undefined
        }

        return PASSENGER_LIST.getById(this.data[index])
    }

    override render(languageId: string) {
        const passengerListElement = qs('#passenger-list')
        const passengerCountElement = qs('#passenger-display-count')

        passengerCountElement.innerHTML = this.getValidCount().toString()
        clearChildren(passengerListElement)

        for (const passengerId of this.data) {
            const passenger = PASSENGER_LIST.getById(passengerId)

            if (passenger !== undefined && passenger.isVisible) {
                const itemElement = document.createElement('div')

                itemElement.classList.add('passenger-item', 'no-scrollbar')
                itemElement.innerHTML = passenger.name.get(languageId)
                passengerListElement.appendChild(itemElement)
            }
        }
    }
}

class QuestPanel extends DisplayList<Quest> {
    constructor(questIds: string[] = []) {
        super(questIds)
    }

    getValidCount(): number {
        let count = 0

        for (const questId of this.data) {
            const quest = QUEST_LIST.getById(questId)

            if (quest !== undefined && (quest.isActive() || quest.isCompleted())) {
                count += 1
            }
        }

        return count
    }

    getByIndex(index: number): Quest | undefined {
        if (index < 0 || index >= this.data.length) {
            return undefined
        }

        return QUEST_LIST.getById(this.data[index])
    }

    render(languageId: string) {
        const questContainerElement = qs('#task-container')

        clearChildren(questContainerElement)

        for (const questId of this.data) {
            const quest = QUEST_LIST.getById(questId)

            if (quest !== undefined && (quest.isActive() || quest.isCompleted)) {
                const itemElement = document.createElement('div')

                itemElement.classList.add('task-item')

                if (quest.isCompleted()) {
                    itemElement.classList.add('task-done-item')
                }

                itemElement.innerHTML = quest.description.get(languageId)
                questContainerElement.appendChild(itemElement)
            }
        }
    }
}

class EncryptionTool {
    static encrypt(content: string): string {
        return btoa(encodeURIComponent(content))
    }

    static decipher(content: string): string {
        return decodeURIComponent(atob(content))
    }
}

class Game {
    public languageId: string
    public curFloorNumber: number
    public destinationFloorNumber: number
    public highestFloorNumber: number
    public lowestFloorNumber: number
    public isLifting: boolean
    private liftingStatus: LiftingStatus
    private liftingInterval: number
    private floorButtons: [FloorButton, FloorButton][]
    public pendingFloorQueue: PendingFloorQueue
    public floorPanel: FloorPanel
    public passengerPanel: PassengerPanel
    public questPanel: QuestPanel
    public languagePanel: LanguagePanel
    public savePanel: SavePanel
    public door: Door
    public spinner: Spinner
    public uiTextCatalog: UITextCatalog

    constructor() {
        this.languageId = DEFAULT_LANGUAGE_ID
        this.curFloorNumber = 1
        this.destinationFloorNumber = 0
        this.highestFloorNumber = 6
        this.lowestFloorNumber = -2
        this.isLifting = false
        this.liftingStatus = LiftingStatus.IDLE
        this.liftingInterval = 200
        this.floorButtons = []
        this.pendingFloorQueue = new PendingFloorQueue()
        this.floorPanel = new FloorPanel()
        this.passengerPanel = new PassengerPanel([])
        this.questPanel = new QuestPanel([])
        this.languagePanel = new LanguagePanel()
        this.savePanel = new SavePanel()
        this.door = new Door()
        this.spinner = new Spinner()
        this.uiTextCatalog = {}

        for (const key of Object.keys(UI_TEXT_DEFINITIONS)) {
            this.uiTextCatalog[key] = new LocalizedText(UI_TEXT_DEFINITIONS[key])
        }
    }

    getCurrentFloor(): Floor | undefined {
        return FLOOR_LIST.getById(`${this.curFloorNumber}_flr`)
    }

    static jumpToBottom() {
        const dialogueContainerElement = qs('#dialog-container')

        dialogueContainerElement.scrollTop = dialogueContainerElement.scrollHeight
    }

    static hideJumpButton() {
        qs('#jump-button').style.display = 'none'
    }

    static showJumpButton() {
        qs('#jump-button').style.display = 'flex'
    }

    static hideAdvanceButton() {
        qs('#spinner').style.display = 'none'
        qs('#go-on-button-row').style.display = 'none'
    }

    static showAdvanceButton() {
        qs('#spinner').style.display = 'flex'
        qs('#go-on-button-row').style.display = 'flex'
    }

    static hideChoiceGroup() {
        qs('#options-row').style.display = 'none'
    }

    static showChoiceGroup() {
        qs('#options-row').style.display = 'flex'
    }

    static disableFloorButtons() {
        qsa('.button-col').forEach(button => {
            button.classList.add('is-disabled')
        })
    }

    static enableFloorButtons() {
        qsa('.button-col').forEach(button => {
            button.classList.remove('is-disabled')
        })
    }

    static disableSaveButtons() {
        qsa('.save-button-wrap').forEach(button => {
            button.classList.add('is-disabled')
        })
    }

    static enableSaveButtons() {
        qsa('.save-button-wrap').forEach(button => {
            button.classList.remove('is-disabled')
        })
    }

    static createResultIcon(isSuccessful: boolean): HTMLElement {
        const iconElement = document.createElement('div')

        if (isSuccessful) {
            iconElement.classList.add('save-operation-success')

            return iconElement
        } else {
            iconElement.classList.add('save-operation-fail')
        }

        for (const _ of range(2)) {
            iconElement.appendChild(document.createElement('div'))
        }

        return iconElement
    }

    static handleDialogueBlockCompletion(floor: Floor, dialogueBlock: DialogueBlock) {
        if (dialogueBlock.isAtEnd() && dialogueBlock.endsWithDialogue()) {
            Game.hideChoiceGroup()

            if (floor.updateDialogueBlock()) {
                Game.showAdvanceButton()
            } else {
                Game.hideAdvanceButton()
            }

            if (dialogueBlock.id !== floor.dialogueScene.curDialogueBlockId) {
                floor.dialogueScene.addVisitedBlock(dialogueBlock.id)
            }
        }
    }

    static createAvatar(passengerId: string, languageId: string): HTMLElement {
        const passenger = PASSENGER_LIST.getById(passengerId)
        const avatarElement: HTMLElement = document.createElement('div')
        const avatarTextElement: HTMLElement = document.createElement('div')

        avatarElement.classList.add('avatar')
        avatarTextElement.classList.add('no-select')

        if (passenger !== undefined) {
            avatarTextElement.style.backgroundColor = passenger.avatarBgColor
            avatarTextElement.style.color = passenger.avatarFontColor
            avatarTextElement.innerHTML = passenger.avatarText.get(languageId)
            avatarTextElement.setAttribute('lkey', passenger.id)
        }

        avatarElement.appendChild(avatarTextElement)

        return avatarElement
    }

    static createDialogue(
        dialogue: Dialogue,
        languageId: string,
        isNotAtFirst: boolean = true
    ): HTMLElement | null {
        const dialogueRowElement: HTMLElement = document.createElement('div')
        const dialogueElement: HTMLElement = document.createElement('div')

        switch (dialogue.layout) {
            case DialogueLayout.LEFT:
                dialogueRowElement.classList.add('dialog-row', 'left-dialog-row')
                dialogueElement.classList.add('dialog-box', 'left-dialog-box')

                if (isNotAtFirst) {
                    dialogueElement.classList.add('left-not-first-line')
                }

                dialogueElement.innerHTML = dialogue.text.get(languageId)
                dialogueElement.setAttribute('lkey', dialogue.id)

                if (!isNotAtFirst) {
                    dialogueRowElement.append(Game.createAvatar(dialogue.passengerId, languageId))
                }

                dialogueRowElement.append(dialogueElement)

                return dialogueRowElement
            case DialogueLayout.RIGHT:
                dialogueRowElement.classList.add('dialog-row', 'right-dialog-row')
                dialogueElement.classList.add('dialog-box', 'right-dialog-box')

                if (isNotAtFirst) {
                    dialogueElement.classList.add('right-not-first-line')
                }

                dialogueElement.innerHTML = dialogue.text.get(languageId)
                dialogueElement.setAttribute('lkey', dialogue.id)
                dialogueRowElement.append(dialogueElement)

                if (!isNotAtFirst) {
                    dialogueRowElement.append(Game.createAvatar(dialogue.passengerId, languageId))
                }

                return dialogueRowElement
            case DialogueLayout.MIDDLE:
                dialogueRowElement.classList.add('dialog-row', 'mid-dialog-row')
                dialogueElement.classList.add('dialog-box', 'mid-dialog-box')
                dialogueElement.innerHTML = dialogue.text.get(languageId)
                dialogueElement.setAttribute('lkey', dialogue.id)
                dialogueRowElement.appendChild(dialogueElement)

                return dialogueRowElement
            default:
                return null
        }
    }

    static createChoiceOption(choiceOption: ChoiceOption, languageId: string): HTMLElement {
        const optionElement = document.createElement('div')
        const optionTextElement = document.createElement('div')

        optionElement.classList.add('option-button', 'no-scrollbar')
        optionElement.setAttribute('next', choiceOption.nextDialogueBlockId)
        optionTextElement.classList.add('no-select')
        optionTextElement.innerHTML = choiceOption.text.get(languageId)
        optionTextElement.setAttribute('lkey', choiceOption.id)
        optionElement.appendChild(optionTextElement)
        optionElement.addEventListener('click', () => {
            Game.hideChoiceGroup()
            const nextDialogueBlockId = optionElement.getAttribute('next')
            const floor = game.getCurrentFloor()

            if (floor === undefined || nextDialogueBlockId === null) {
                return
            }

            Game.renderDelimiterElement()
            floor.dialogueScene.addVisitedBlock(floor.dialogueScene.curDialogueBlockId)
            floor.dialogueScene.setCurDialogueBlock(nextDialogueBlockId)

            const dialogueBlock = floor.dialogueScene.getCurDialogueBlock()

            if (dialogueBlock === undefined) {
                return
            }

            dialogueBlock.moveToStart()
            Game.advanceDialogue(dialogueBlock, game.languageId)
            Game.handleDialogueBlockCompletion(floor, dialogueBlock)
            Game.jumpToBottom()
        })

        return optionElement
    }

    static renderDialogue(
        dialogue: Dialogue,
        languageId: string,
        isNotAtFirst: boolean = true
    ): boolean {
        const dialogueContainerElement = qs('#dialog-container')
        const dialogueElement = Game.createDialogue(dialogue, languageId, isNotAtFirst)

        if (dialogueElement !== null) {
            dialogueContainerElement.appendChild(dialogueElement)

            return true
        }

        return false
    }

    static renderChoiceOption(select: Choice, languageId: string) {
        Game.hideAdvanceButton()

        const optionRowElement: HTMLElement = qs('#options-row')

        clearChildren(optionRowElement)

        for (const option of select.options) {
            optionRowElement.appendChild(Game.createChoiceOption(option, languageId))
        }

        Game.showChoiceGroup()
    }

    static advanceDialogue(
        dialogueBlock: DialogueBlock,
        languageId: string,
        shouldExecuteAction: boolean = true
    ) {
        const dialogueStep = dialogueBlock.getCurStep()

        if (dialogueStep === undefined) {
            if (!dialogueBlock.isAtEnd()) {
                Game.hideChoiceGroup()
                dialogueBlock.advance()
                Game.showAdvanceButton()
            } else {
                if (dialogueBlock.endsWithDialogue()) {
                    Game.hideChoiceGroup()
                } else {
                    Game.showChoiceGroup()
                }
                Game.hideAdvanceButton()
            }
            return
        }

        if (dialogueStep.isChoice()) {
            Game.renderChoiceOption(dialogueStep as Choice, languageId)
            dialogueBlock.moveToEnd()
        } else {
            Game.hideChoiceGroup()
            Game.renderDialogue(dialogueStep as Dialogue, languageId, dialogueBlock.isNotAtFirst())

            if (shouldExecuteAction) {
                ;(dialogueStep as Dialogue).act()
            }

            dialogueBlock.advance()

            if (!dialogueBlock.isAtEnd()) {
                Game.showAdvanceButton()
            } else {
                Game.renderDelimiterElement()
                Game.hideAdvanceButton()
            }
        }
    }

    static renderDelimiterElement() {
        const delimiterRowElement = document.createElement('div')
        const delimiterElement = document.createElement('div')

        delimiterRowElement.classList.add('dialog-row', 'mid-dialog-row')
        delimiterElement.classList.add('block-br')
        delimiterRowElement.appendChild(delimiterElement)
        qs('#dialog-container').appendChild(delimiterRowElement)
    }

    static renderDialogueBlock(
        dialogueBlock: DialogueBlock,
        languageId: string,
        isVisited: boolean = false
    ) {
        let prevPassengerId = ''

        for (let i = 0; i < dialogueBlock.length; i += 1) {
            if (!isVisited && i >= dialogueBlock.curStepIndex) {
                if (i === 0) {
                    // Game.stepDialog(dialogueBlock, languageId)
                    Game.hideChoiceGroup()
                    Game.showAdvanceButton()
                }

                break
            }

            const dialogueStep = dialogueBlock.getStepByIndex(i)

            if (dialogueStep === undefined) {
                break
            }

            if (dialogueStep.isChoice()) {
                if (!isVisited) {
                    Game.renderChoiceOption(dialogueStep, languageId)

                    break
                }
            } else if (dialogueStep.isDialogue()) {
                Game.hideChoiceGroup()

                if (
                    Game.renderDialogue(
                        dialogueStep as Dialogue,
                        languageId,
                        prevPassengerId === dialogueStep.passengerId
                    )
                ) {
                    prevPassengerId = dialogueStep.passengerId
                }

                if (!isVisited) {
                    Game.showAdvanceButton()
                }
            }
        }

        if (dialogueBlock.length > 0 && isVisited) {
            Game.renderDelimiterElement()
        }
    }

    renderFloor() {
        Game.hideAdvanceButton()
        Game.hideChoiceGroup()
        clearChildren(qs('#dialog-container'))

        const bgElement: HTMLElement = qs('#background')
        const floor = this.getCurrentFloor()

        if (floor === undefined) {
            bgElement.style.backgroundColor = ''
            bgElement.innerHTML = ''

            return
        }

        floor.updateDialogueBlock()
        bgElement.style.backgroundColor = floor.background.bgColor
        bgElement.innerHTML = floor.background.innerHTML

        for (const dialogueBlockId of floor.dialogueScene.visitedDialogueBlockIds) {
            const visitedDialogueBlock = floor.dialogueScene.getDialogueBlock(dialogueBlockId)

            if (visitedDialogueBlock !== undefined) {
                Game.renderDialogueBlock(visitedDialogueBlock, this.languageId, true)
            }
        }

        const curDialogueBlock = floor.dialogueScene.getCurDialogueBlock()

        if (
            curDialogueBlock !== undefined &&
            floor.dialogueScene.visitedDialogueBlockIds.indexOf(curDialogueBlock.id) === -1
        ) {
            Game.renderDialogueBlock(curDialogueBlock, this.languageId)

            if (curDialogueBlock.isAtEnd()) {
                Game.hideAdvanceButton()

                if (curDialogueBlock.endsWithDialogue()) {
                    Game.renderDelimiterElement()
                }
            }
        }

        Game.hideJumpButton()
        Game.jumpToBottom()
    }

    canStartLifting(): boolean {
        return !(
            this.pendingFloorQueue.length <= 0 ||
            (this.liftingStatus !== LiftingStatus.UP &&
                this.liftingStatus !== LiftingStatus.DOWN) ||
            this.destinationFloorNumber > this.highestFloorNumber ||
            this.destinationFloorNumber < this.lowestFloorNumber ||
            this.destinationFloorNumber === 0 ||
            this.destinationFloorNumber === this.curFloorNumber
        )
    }

    calcLiftingDirection() {
        if (this.pendingFloorQueue.length > 0) {
            if (this.pendingFloorQueue.length === 1) {
                const destinationFloorNumber = this.pendingFloorQueue.getHighestFloor().floorNumber

                this.liftingStatus =
                    destinationFloorNumber > this.curFloorNumber
                        ? LiftingStatus.UP
                        : destinationFloorNumber < this.curFloorNumber
                          ? LiftingStatus.DOWN
                          : LiftingStatus.IDLE
                this.destinationFloorNumber = destinationFloorNumber
            } else {
                const highestFloor = this.pendingFloorQueue.getHighestFloor()
                const lowestFloor = this.pendingFloorQueue.getLowestFloor()

                if (
                    highestFloor.floorNumber >= this.curFloorNumber &&
                    this.curFloorNumber >= lowestFloor.floorNumber
                ) {
                    if (highestFloor.index <= lowestFloor.index) {
                        this.liftingStatus = LiftingStatus.UP
                        this.destinationFloorNumber = highestFloor.floorNumber
                    } else {
                        this.liftingStatus = LiftingStatus.DOWN
                        this.destinationFloorNumber = lowestFloor.floorNumber
                    }
                } else if (lowestFloor.floorNumber >= this.curFloorNumber) {
                    this.liftingStatus = LiftingStatus.UP
                    this.destinationFloorNumber = highestFloor.floorNumber
                } else if (highestFloor.floorNumber <= this.curFloorNumber) {
                    this.liftingStatus = LiftingStatus.DOWN
                    this.destinationFloorNumber = lowestFloor.floorNumber
                } else {
                    this.liftingStatus = LiftingStatus.IDLE
                    this.destinationFloorNumber = 0
                }
            }
        } else {
            this.liftingStatus = LiftingStatus.IDLE
            this.destinationFloorNumber = 0
        }
    }

    isPassingFloor(): boolean {
        return this.pendingFloorQueue.indexOf(this.curFloorNumber) !== -1
    }

    async lift() {
        if (this.liftingStatus !== LiftingStatus.UP && this.liftingStatus !== LiftingStatus.DOWN) {
            return
        }

        this.floorPanel.updateIcon(this.liftingStatus)
        this.isLifting = true

        liftingLoop: do {
            switch (this.liftingStatus) {
                case LiftingStatus.UP:
                    this.curFloorNumber = Math.min(
                        this.curFloorNumber + 1 === 0 ? 1 : this.curFloorNumber + 1,
                        this.highestFloorNumber
                    )

                    break
                case LiftingStatus.DOWN:
                    this.curFloorNumber = Math.max(
                        this.curFloorNumber - 1 === 0 ? -1 : this.curFloorNumber - 1,
                        this.lowestFloorNumber
                    )

                    break
                default:
                    break liftingLoop
            }

            this.floorPanel.updateFloorNumber(this.curFloorNumber)

            if (this.curFloorNumber === this.destinationFloorNumber) {
                break
            }

            if (
                this.curFloorNumber >= this.highestFloorNumber ||
                this.curFloorNumber <= this.lowestFloorNumber
            ) {
                break
            }

            await sleep(this.liftingInterval)
        } while (!this.isPassingFloor())

        this.pendingFloorQueue.remove(this.curFloorNumber)
        removeElementClass(qs(`.number-button[index="${this.curFloorNumber}"]`), 'button-selected')
        this.isLifting = false
        this.floorPanel.updateIcon(LiftingStatus.IDLE)
    }

    tryStartLifting() {
        this.pendingFloorQueue.remove(this.curFloorNumber)
        this.calcLiftingDirection()

        if (this.canStartLifting()) {
            void this.lift()
        }
    }

    initFloorButtons() {
        this.floorButtons = []

        for (let i = this.highestFloorNumber - 1; i >= 1; i -= 2) {
            this.floorButtons.push([
                new FloorButton(i, i.toString(), true),
                new FloorButton(
                    i + 1,
                    i + 1 === this.highestFloorNumber ? '∞' : (i + 1).toString(),
                    i + 1 !== this.highestFloorNumber
                )
            ])
        }

        for (let i = -2; i >= this.lowestFloorNumber; i -= 2) {
            this.floorButtons.push([
                new FloorButton(i + 1, (i + 1).toString(), true),
                new FloorButton(
                    i,
                    i === this.lowestFloorNumber ? '-∞' : i.toString(),
                    i !== this.lowestFloorNumber
                )
            ])
        }
    }

    renderFloorButtons() {
        const buttonGridElement = qs('#func-buttons')
        const buttonContainerElement = qs('#floor-buttons')

        for (const child of Array.from(buttonContainerElement.children)) {
            if (child.id !== 'func-buttons') {
                buttonContainerElement.removeChild(child)
            }
        }

        this.floorButtons.forEach(floorButtonPair => {
            const buttonRowElement = document.createElement('div')

            buttonRowElement.classList.add('button-row')

            for (const floorButton of floorButtonPair) {
                const buttonElement = document.createElement('div')

                buttonElement.classList.add('button-col', 'no-select', 'number-button')

                if (!floorButton.isAvailable) {
                    buttonElement.classList.add('invisible')
                }

                buttonElement.textContent = floorButton.text
                buttonElement.setAttribute('index', floorButton.floorNumber.toString())
                buttonRowElement.appendChild(buttonElement)
            }

            buttonContainerElement.insertBefore(buttonRowElement, buttonGridElement)
        })
    }

    updateUIText() {
        for (const element of qsa('.l10n-text-ui')) {
            element.textContent = this.uiTextCatalog[element.getAttribute('lkey')!].get(
                this.languageId
            )
        }
    }

    updateText() {
        // avatar
        for (const avatarElement of qsa('.avatar>div[lkey]')) {
            avatarElement.innerHTML =
                PASSENGER_LIST.getById(avatarElement.getAttribute('lkey') ?? '')?.avatarText.get(
                    game.languageId
                ) ?? ''
        }

        // dialog
        for (const dialogueElement of qsa('.dialog-box[lkey]')) {
            const dialogueId = dialogueElement.getAttribute('lkey') ?? ''
            const [_, dialogueBlockId] = Dialogue.splitId(dialogueId)

            dialogueElement.innerHTML =
                (
                    game
                        .getCurrentFloor()
                        ?.dialogueScene.getDialogueBlock(`${dialogueBlockId}_dbk`)
                        ?.getStepById(dialogueId) as Dialogue
                )?.text.get(game.languageId) ?? ''
        }

        // option
        for (const optionElement of qsa('.option-button>div[lkey]')) {
            const optionId = optionElement.getAttribute('lkey') ?? ''
            const [_, choiceId] = ChoiceOption.splitId(optionId)

            optionElement.innerHTML =
                (
                    game
                        .getCurrentFloor()
                        ?.dialogueScene.getCurDialogueBlock()
                        ?.getStepById(`${choiceId}_chc`) as Choice
                )
                    ?.getOptionById(optionId)
                    ?.text.get(game.languageId) ?? ''
        }

        // passenger
        this.passengerPanel.render(this.languageId)
        // task
        this.questPanel.render(this.languageId)
    }

    isFloorButtonAvailable(index: number): boolean {
        const floorButtons = flattenArray(this.floorButtons)
        const buttonIndex = floorButtons.map(button => button.floorNumber).indexOf(index)

        if (buttonIndex === -1) {
            return false
        }

        return floorButtons[buttonIndex].isAvailable
    }

    initialize() {
        this.initFloorButtons()
        this.renderFloorButtons()
        this.languagePanel.setLanguage(this.languageId)
        this.updateUIText()
        this.floorPanel.updateFloorNumber(this.curFloorNumber)
        this.passengerPanel.add(PASSENGER_ME_ID)
        this.passengerPanel.render(this.languageId)
        this.spinner.start()
    }

    getSnapshot(): GameSnapshot {
        return {
            languageId: this.languageId,
            curFloorNumber: this.curFloorNumber,
            floorButtons: flattenArray(this.floorButtons)
                .filter(
                    floorButton =>
                        floorButton.floorNumber === this.highestFloorNumber ||
                        floorButton.floorNumber === this.lowestFloorNumber
                )
                .map(floorButton => floorButton.getSnapshot()),
            passengerIds: this.passengerPanel.getSnapshot(),
            questIds: this.questPanel.getSnapshot()
        }
    }

    toString(): string {
        return JSON.stringify(this.getSnapshot())
    }

    serialize(): string {
        const saveSnapshot: SaveData = {
            signals: SIGNAL_LIST.getSnapshot(),
            quests: QUEST_LIST.getSnapshot(),
            floors: FLOOR_LIST.getSnapshot(),
            game: this.getSnapshot()
        }

        return EncryptionTool.encrypt(JSON.stringify(saveSnapshot))
    }

    deserialize(content: string): boolean {
        let isSuccessful = true

        try {
            // TODO: verify json type
            const jsonData = JSON.parse(EncryptionTool.decipher(content)) as SaveData

            for (const signalSnapshot of jsonData.signals) {
                const signal = SIGNAL_LIST.getById(signalSnapshot.id)

                if (signal !== undefined) {
                    signal.status = Signal.convertToEnum(signalSnapshot.status)
                }
            }

            for (const questSnapshot of jsonData.quests) {
                const quest = QUEST_LIST.getById(questSnapshot.id)

                if (quest !== undefined) {
                    quest.status = Quest.convertToEnum(questSnapshot.status)
                }
            }

            for (const floorSnapshot of jsonData.floors) {
                const floor = FLOOR_LIST.getById(floorSnapshot.id)

                if (floor === undefined) {
                    continue
                }

                if (floor.dialogueScene.id !== floorSnapshot.dialogueScene.id) {
                    continue
                }

                floor.dialogueScene.setCurDialogueBlock(
                    floorSnapshot.dialogueScene.curDialogueBlockId
                )
                floor.dialogueScene.visitedDialogueBlockIds =
                    floorSnapshot.dialogueScene.visitedDialogueBlockIds

                for (const dialogueBlockSnapshot of floorSnapshot.dialogueScene.dialogueBlocks) {
                    const dialogueBlock = floor.dialogueScene.getDialogueBlock(
                        dialogueBlockSnapshot.id
                    )

                    if (dialogueBlock === undefined) {
                        continue
                    }

                    dialogueBlock.curStepIndex = dialogueBlockSnapshot.curStepIndex
                }
            }

            this.languageId = jsonData.game.languageId

            for (const floorButtonPair of this.floorButtons) {
                for (const floorButton of floorButtonPair) {
                    const floorButtonIndex = jsonData.game.floorButtons
                        .map(x => x.floorNumber)
                        .indexOf(floorButton.floorNumber)

                    if (floorButtonIndex === -1) {
                        continue
                    }

                    floorButton.isAvailable =
                        jsonData.game.floorButtons[floorButtonIndex].isAvailable

                    const floorButtonElement = qs(
                        `.number-button[index="${floorButton.floorNumber}"]`
                    )

                    if (floorButtonElement === null) {
                        continue
                    }

                    if (floorButton.isAvailable) {
                        floorButtonElement.classList.remove('invisible')
                    }
                }
            }

            this.curFloorNumber = jsonData.game.curFloorNumber
            this.isLifting = false
            this.liftingStatus = LiftingStatus.IDLE
            this.destinationFloorNumber = 0
            this.pendingFloorQueue.clear()
            qsa('.number-button').forEach(button => {
                button.classList.remove('button-selected')
            })
            this.floorPanel.updateFloorNumber(this.curFloorNumber)
            this.passengerPanel.reset(jsonData.game.passengerIds)
            this.questPanel.reset(jsonData.game.questIds)
            this.languagePanel.setLanguage(this.languageId)
            this.updateUIText()
            this.passengerPanel.render(this.languageId)
            this.questPanel.render(this.languageId)
        } catch (error) {
            isSuccessful = false

            if (error instanceof Error) {
                console.error('Deserialization error:', error.message)
            } else {
                console.error('Unknown error:', error)
            }
        }

        if (isSuccessful) {
            if (this.door.isOpen) {
                this.door.syncStart(MovingMotion.CLOSING)
            }

            Game.hideAdvanceButton()
            Game.hideChoiceGroup()
            clearChildren(qs('#dialog-container'))
        }

        return !isSuccessful
    }

    async debug() {
        qs('#open-button').click()
        qs('#top-arch').click()

        // qs('#go-on-button-row').click()
        // Game.disableFloorButtons()
        // Game.disableSaveButtons()
        // FloorPanel.startFloorNumberScramble()
        // setTimeout(() => {
        //     FloorPanel.stopFloorNumberScramble()
        // }, 2500)
        // this.renderFloor()
        // this.door.syncStart(MovingMotion.OPENING);
        // this.savePanel.syncStart(MovingMotion.OPENING)
        // qs('.number-button[index="5"]').click()
        // Game.hideAdvanceButton()
        // qs('#options-row').style.display = 'none';
        // (qs('#save-text-area') as HTMLTextAreaElement).value = ''
    }
}

async function clickSwitchLangButton(motion: LanguageSwitchMotion) {
    if (!game.languagePanel.isMoving) {
        await game.languagePanel.start(motion)
        game.languageId = game.languagePanel.getLanguageId()
        game.updateUIText()
        game.updateText()
    }
}

function clickAdvanceButton() {
    const dialogueBlock = game.getCurrentFloor()?.dialogueScene.getCurDialogueBlock()

    if (dialogueBlock === undefined) {
        return
    }

    Game.advanceDialogue(dialogueBlock, game.languageId)

    const floor = game.getCurrentFloor()

    if (floor !== undefined) {
        Game.handleDialogueBlockCompletion(floor, dialogueBlock)
    }

    Game.jumpToBottom()
}

const BINDING_BUTTON_INFO_LIST: BindingButtonInfo[] = [
    {
        selector: '.number-button',
        onClick: event => {
            const className = 'button-selected'
            const floorNumber = parseInt((event.target as HTMLElement).getAttribute('index')!)

            if (!game.isFloorButtonAvailable(floorNumber)) {
                return
            }

            if (!game.isLifting && floorNumber === game.curFloorNumber) {
                return
            }

            if ((event.target as HTMLElement).classList.contains(className)) {
                ;(event.target as HTMLElement).classList.remove(className)
                game.pendingFloorQueue.remove(floorNumber)

                if (floorNumber === game.destinationFloorNumber) {
                    game.calcLiftingDirection()
                }
            } else {
                ;(event.target as HTMLElement).classList.add(className)
                game.pendingFloorQueue.add(floorNumber)
            }

            if (!game.isLifting && !game.door.isOpen) {
                game.tryStartLifting()
            }
        }
    },
    {
        selector: '#close-button',
        onClick: async () => {
            if (!game.isLifting && game.door.isOpen && !game.door.isMoving) {
                await game.door.start(MovingMotion.CLOSING)
                game.tryStartLifting()
            }
        }
    },
    {
        selector: '#open-button',
        onClick: async () => {
            if (!game.isLifting && !game.door.isOpen && !game.door.isMoving) {
                game.renderFloor()
                await game.door.start(MovingMotion.OPENING)
            }
        }
    },
    {
        selector: '#top-arch',
        onClick: async () => {
            if (!game.savePanel.isMoving) {
                if (game.savePanel.isOpen) {
                    game.savePanel.start(MovingMotion.CLOSING)
                } else {
                    game.savePanel.start(MovingMotion.OPENING)
                }
            }
        }
    },
    {
        selector: '#save-export-button-wrap',
        onClick: () => {
            let isSuccessful = true

            clearChildren(qs('#save-export-button'))
            clearChildren(qs('#save-import-button'))

            try {
                ;(qs('#save-text-area') as HTMLTextAreaElement).value = game.serialize()
            } catch (error) {
                isSuccessful = false

                if (error instanceof Error) {
                    console.error('Serialization error:', error.message)
                } else {
                    console.error('Unknown error:', error)
                }
            }

            qs('#save-export-button').appendChild(Game.createResultIcon(isSuccessful))
        }
    },
    {
        selector: '#save-import-button-wrap',
        onClick: () => {
            clearChildren(qs('#save-export-button'))
            clearChildren(qs('#save-import-button'))

            const text = (qs('#save-text-area') as HTMLTextAreaElement).value

            qs('#save-import-button').appendChild(Game.createResultIcon(game.deserialize(text)))
        }
    },
    {
        selector: '#save-copy-button',
        onClick: async () => {
            await navigator.clipboard.writeText(
                (qs('#save-text-area') as HTMLTextAreaElement).value
            )
        }
    },
    {
        selector: '#lang-switch-button-l',
        onClick: async () => {
            await clickSwitchLangButton(LanguageSwitchMotion.ROTATING_LEFT)
        }
    },
    {
        selector: '#lang-switch-button-r',
        onClick: async () => {
            await clickSwitchLangButton(LanguageSwitchMotion.ROTATING_RIGHT)
        }
    },
    {
        selector: '#go-on-button-row',
        onClick: () => {
            clickAdvanceButton()
        }
    },
    {
        selector: '#jump-button',
        onClick: () => {
            Game.jumpToBottom()
            Game.hideJumpButton()
        }
    }
]

function bindButtonFunctions() {
    for (const bindingButtonInfo of BINDING_BUTTON_INFO_LIST) {
        for (const buttonElement of Array.from(qsa(bindingButtonInfo.selector))) {
            buttonElement.addEventListener('click', bindingButtonInfo.onClick)
        }
    }
}

function addDialogScrollListener() {
    const dialogueContainerElement = qs('#dialog-container')

    dialogueContainerElement.addEventListener('scroll', () => {
        if (
            dialogueContainerElement.scrollTop + dialogueContainerElement.offsetHeight <=
            dialogueContainerElement.scrollHeight - dialogueContainerElement.offsetHeight / 2
        ) {
            Game.showJumpButton()
        } else {
            Game.hideJumpButton()
        }
    })
}

let longPressTimer: number | undefined
let isKeyZAvailable: boolean = true

document.addEventListener('DOMContentLoaded', () => {
    game.initialize()
    bindButtonFunctions()

    window.addEventListener('keydown', event => {
        if (
            event.code === 'Space' &&
            game.door.isOpen &&
            qs('#go-on-button-row').style.display !== 'none'
        ) {
            if (longPressTimer === undefined) {
                longPressTimer = window.setInterval(clickAdvanceButton, 25)
            }
        }
    })
    window.addEventListener('keyup', event => {
        if (event.code === 'Space') {
            clearInterval(longPressTimer)
            longPressTimer = undefined
        }
    })
    window.addEventListener('keypress', async event => {
        if (event.code === 'KeyZ' && isKeyZAvailable) {
            if (!game.isLifting && !game.door.isMoving) {
                if (game.door.isOpen) {
                    await game.door.start(MovingMotion.CLOSING)
                    game.tryStartLifting()
                } else {
                    game.renderFloor()
                    await game.door.start(MovingMotion.OPENING)
                }
            }
        }
    })

    addDialogScrollListener()
    void game.debug()
})

const DEFAULT_LANGUAGE_ID = 'zh_cn'
const PASSENGER_ME_ID = 'me_psg'
const PASSENGER_NARRATOR_ID = '&_psg'

const UI_TEXT_DEFINITIONS: UITextDefinitions = {
    PERSON_NUM: { zh_cn: '人数', en: 'Persons' },
    COPY: { zh_cn: '复制', en: 'COPY' },
    IMPORT: { zh_cn: '导入', en: 'IMPORT' },
    EXPORT: { zh_cn: '导出', en: 'EXPORT' },
    JUMP_BUTTON: { zh_cn: '跳转至最新对话', en: 'Jump to present' }
}
const BG_COLOR_LIST: Record<string, string> = {
    f1: '#343434',
    f2: '#2D2424',
    f3: '#393232'
}

const LANGUAGE_INFO_LIST = new LanguageInfoList([
    { id: 'zh_cn', name: '中文' },
    { id: 'en', name: 'EN' }
])
const SIGNAL_LIST = new SignalList([
    { id: 'naked.enter_sig', status: SignalStatus.ACTIVE },
    { id: 'naked.meet_sig' },
    { id: 'naked.call_sig' },
    { id: 'naked.mask_sig' },
    { id: 'naked.berserk_sig' },
    { id: 'naked.kill_sig' },
    { id: 'peach_sig', status: SignalStatus.ACTIVE },
    { id: 'bottom.in.naked_sig' }
])
const QUEST_LIST = new QuestList([
    {
        id: 'skate_tsk',
        description: {
            zh_cn: '霜杰想向朋友借一块滑板。',
            en: 'Jacob wants to borrow a skateboard from his friend.'
        }
    }
])
const ACTION_LIST = new ActionList([
    {
        id: 'naked1_act',
        onAct: Action.combineActions(
            Action.getActivateQuestAction('skate_tsk'),
            Action.getAddPassengerAction('jacob_psg'),
            Action.getActivateSignalAction('naked.meet_sig'),
            Action.getAdvancePlotAction('naked_stl')
        )
    },
    {
        id: 'naked2#1_act',
        onAct: Action.combineActions(Action.getRemovePassengerAction('jacob_psg'))
    },
    {
        id: 'naked2#2_act',
        onAct: Action.combineActions(
            Action.getActivateSignalAction('naked.call_sig'),
            Action.getAdvancePlotAction('naked_stl')
        )
    },
    {
        id: 'naked3.1_act',
        onAct: Action.combineActions(
            Action.getAddPassengerAction('jacob_psg'),
            Action.getActivateSignalAction('naked.mask_sig'),
            Action.getAdvancePlotAction('naked_stl')
        )
    },
    {
        id: 'naked3.2_act',
        onAct: Action.combineActions(Action.getDeactivateQuestAction('skate_tsk'))
    },
    {
        id: 'naked4#1_act',
        onAct: Action.combineActions(Action.getRemovePassengerAction('jacob_psg'))
    },
    {
        id: 'naked4#2_act',
        onAct: Action.combineActions(
            Action.getActivateSignalAction('naked.berserk_sig'),
            Action.getAdvancePlotAction('naked_stl')
        )
    },
    {
        id: 'naked5_act',
        onAct: Action.combineActions(
            Action.getAddPassengerAction('jacob_psg'),
            Action.getActivateSignalAction('naked.kill_sig'),
            Action.getAdvancePlotAction('naked_stl')
        )
    },
    {
        id: 'naked6#1_act',
        onAct: Action.combineActions(Action.getRemovePassengerAction('jacob_psg'))
    },
    {
        id: 'naked6#2_act',
        onAct: Action.combineActions(
            Action.getCompleteQuestAction('skate_tsk'),
            Action.getAdvancePlotAction('naked_stl'),
            Action.getActivateSignalAction('bottom.in.naked_sig')
        )
    },
    {
        id: 'peach.start_act',
        onAct: Action.combineActions(
            Game.disableFloorButtons,
            Game.disableSaveButtons,
            FloorPanel.startFloorNumberScramble,
            () => {
                qs('#background')?.classList.add('color-flash')
                isKeyZAvailable = false
            }
        )
    },
    {
        id: 'peach.stop_act',
        onAct: Action.combineActions(
            Game.enableFloorButtons,
            Game.enableSaveButtons,
            FloorPanel.stopFloorNumberScramble,
            () => {
                qs('#background')?.classList.remove('color-flash')
                isKeyZAvailable = true
            }
        )
    },
    {
        id: 'peach.finish_act',
        onAct: Action.combineActions(Action.getAdvancePlotAction('peach_stl'))
    }
])
const PASSENGER_LIST = new PassengerList([
    {
        id: 'me_psg',
        name: { zh_cn: '我', en: 'Me' },
        avatarBgColor: '#1F4690',
        avatarFontColor: 'white',
        avatarText: { zh_cn: '我', en: 'ME' }
    }
])
const FLOOR_LIST = new FloorList([
    {
        id: '1_flr',
        storylineIds: ['naked_plt'],
        background: {
            bgColor: BG_COLOR_LIST['f1'],
            innerHTML: ''
        },
        dialogueScene: {
            id: '1_dsc',
            dialogueBlocks: [
                {
                    id: 'naked1_dbk',
                    incomingSignalIds: ['naked.enter_sig'],
                    dialogues: [
                        {
                            passengerId: 'me_psg',
                            text: { zh_cn: '总觉得', en: 'i always think that' },
                            actionId: ''
                        }
                    ],
                    choice: [
                        {
                            nextDialogueBlockId: 'naked3.1_dbk',
                            text: { zh_cn: '去吧', en: 'Go again' }
                        }
                    ]
                }
            ]
        }
    }
])
const STORYLINE_LIST = new StoryLineList([
    {
        id: 'naked_stl',
        priority: 1001,
        stages: [
            { signalId: 'naked.enter_sig', floorId: '1_flr' },
            { signalId: 'naked.meet_sig', floorId: '3_flr' },
            { signalId: 'naked.call_sig', floorId: '1_flr' },
            { signalId: 'naked.mask_sig', floorId: '3_flr' },
            { signalId: 'naked.berserk_sig', floorId: '1_flr' },
            { signalId: 'naked.kill_sig', floorId: '3_flr' }
        ],
        incomingSignalIds: []
    },
    {
        id: 'peach_stl',
        priority: 101,
        stages: [{ signalId: 'peach_sig', floorId: '2_flr' }],
        incomingSignalIds: []
    }
])

const game = new Game()
