function sleep(time: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, time)
    })
}

function getRandomInt(min: number, max?: number): number {
    if (max === undefined) {
        max = min
        min = 0
    }
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function range(...args: number[]): number[] {
    let start = 0
    let end = 0
    if (args.length <= 0) {
        return []
    } else if (args.length === 1) {
        if (args[0] <= 0) {
            return []
        }
        start = 0
        end = args[0] - 1
    } else {
        start = args[0]
        end = args[1]
    }
    if (start > end) {
        let tmp = end
        end = start
        start = tmp
    }
    let arr: number[] = []
    for (let i = start; i <= end; ++i) {
        arr.push(i)
    }
    return arr
}

type NestedArray<T> = Array<NestedArray<T> | T>

function flattenNestArray<T>(nest_array: NestedArray<T>): T[] {
    function flatten2DArray<S>(array: S[][]): S[] {
        return ([] as S[]).concat(...array)
    }
    return flatten2DArray(nest_array.map(x => Array.isArray(x) ? flattenNestArray(x) : [x]))
}

function clearChildren(elem: HTMLElement) {
    for (let child of Array.from(elem.childNodes)) {
        elem.removeChild(child)
    }
}

function toggleElementClass(elem: HTMLElement, class_name: string) {
    if (elem.classList.contains(class_name)) {
        elem.classList.remove(class_name)
    } else {
        elem.classList.add(class_name)
    }
}

function addElementClass(elem: HTMLElement, class_name: string) {
    if (!elem.classList.contains(class_name)) {
        elem.classList.add(class_name)
    }
}

function removeElementClass(elem: HTMLElement, class_name: string) {
    if (elem.classList.contains(class_name)) {
        elem.classList.remove(class_name)
    }
}

function padLeftZero(num: number): string {
    let num_s = num.toString()
    return /^[0-9]$/.test(num_s) ? '0' + num_s : num_s
}

function getNumFromId(id: string): string {
    let num = id.match(/[^_]+/)
    return num === null || num.length <= 0 ? '' : num[0]
}

const qs = function (selector: any): HTMLElement {
    return document.querySelector(selector as string)!
}

const qsa = function (selector: any): NodeListOf<HTMLElement> {
    return document.querySelectorAll(selector as string)
}

/**
 * @param id - string
 */
interface IdClass {
    id: string
    toString: () => string
}

abstract class AbstractList<T extends IdClass>{
    protected data: T[]

    constructor() {
        this.data = []
    }
    getLength(): number {
        return this.data.length
    }
    isIncluding(id: string): boolean {
        for (let i = 0; i < this.data.length; ++i) {
            if (this.data[i].id === id) {
                return true
            }
        }
        return false
    }
    getById(id: string): T | null {
        for (let item of this.data) {
            if (item.id === id) {
                return item
            }
        }
        return null
    }
    toString(): string {
        return `[${this.data.map(s => s.toString()).join(',')}]`
    }
}

/**
 * @param id - string
 * @param name - string
 */
interface NaturalLanguage {
    id: string
    name: string
}

class LanguageList extends AbstractList<NaturalLanguage>{
    constructor(data: NaturalLanguage[]) {
        super()
        this.data = data
    }
    isKeyIn(id: string): boolean {
        return this.data.map(x => x.id).indexOf(id) !== -1
    }
    indexOfKey(id: string): number {
        if (!this.isKeyIn(id)) {
            return -1
        }
        for (let i of range(this.getLength())) {
            if (this.data[i].id === id) {
                return i
            }
        }
        return -1
    }
    getItemByIndex(index: number): NaturalLanguage {
        if (index < 0) {
            index = 0
        }
        if (index >= this.getLength()) {
            index = this.getLength() - 1
        }
        return this.data[index]
    }
    getItemByKey(id: string): NaturalLanguage | null {
        for (let item of this.data) {
            if (id === item.id) {
                return item
            }
        }
        return null
    }
    getNameByKey(id: string): string {
        if (!this.isKeyIn(id)) {
            return ''
        }
        const item = this.getItemByKey(id)
        return item !== null ? item.name : ''
    }
}

/**
 * @param \[key: string\]: string
 */
interface L10nTextDict {
    [key: string]: string
}

class L10nText {
    private data: L10nTextDict

    constructor(data: L10nTextDict) {
        this.data = data
    }
    get(key: string): string {
        if (key in this.data) {
            return this.data[key]
        }
        return ''
    }
    set(key: string, value: string) {
        if (!game_lang_list.isKeyIn(key)) {
            return
        }
        this.data[key] = value
    }
    toString(): string {
        return '{' + Object.keys(this.data).map(key => `"${key}":"${this.get(key)}"`).join(',') + '}'
    }
}

enum SignatureStatus {
    DEACTIVE = 'deactive',
    ACTIVE = 'active'
}

/**
 * @param id - string(/[^_]+_sig/)
 * @param status - SignatureStatus
 */
interface SignatureObject {
    /**
     * regex: /[^_]+_sig/
     */
    id: string
    status?: SignatureStatus
}

/**
 * @param id - string(/[^_]+_sig/)
 * @param status - string
 */
interface SignatureJSON {
    /**
     * regex: /[^_]+_sig/
     */
    id: string
    status: string
}

class Signature {
    /**
     * regex: /[^_]+_sig/
     */
    public id: string
    public status: SignatureStatus

    constructor(id: string, status: SignatureStatus = SignatureStatus.DEACTIVE) {
        this.id = id
        this.status = status
    }
    activiate() {
        this.status = SignatureStatus.ACTIVE
    }
    /**
     * Set the status of this signature to deactive.
     */
    deactiviate() {
        this.status = SignatureStatus.DEACTIVE
    }
    isActive(): boolean {
        return this.status === SignatureStatus.ACTIVE
    }
    toString(): string {
        return `{"id":"${this.id}","status":"${this.status.toString()}"}`
    }
    static convertStatus(status: string): SignatureStatus {
        return status === 'active' ? SignatureStatus.ACTIVE : SignatureStatus.DEACTIVE
    }
}

class SignatureList extends AbstractList<Signature>{
    constructor(signatures: SignatureObject[]) {
        super()
        for (let signature of signatures) {
            this.data.push(new Signature(
                signature.id,
                signature.status ?? SignatureStatus.DEACTIVE
            ))
        }
    }
    initialize() {
        for (let signarue of this.data) {
            signarue.deactiviate()
        }
    }
    isActiveById(id: string): boolean {
        const signature = this.getById(id)
        return signature !== null && signature.status === SignatureStatus.ACTIVE
    }
    activateById(id: string): boolean {
        const signature = this.getById(id)
        if (signature !== null) {
            signature.activiate()
            return true
        }
        return false
    }
    deactivateById(id: string): boolean {
        const signature = this.getById(id)
        if (signature !== null) {
            signature.deactiviate()
            return true
        }
        return false
    }
}

enum TaskStatus {
    DEACTIVE = 'deactive',
    ACTIVE = 'active',
    FINISHED = 'finished'
}

/**
 * @param id - string(/[^_]+_tsk/)
 * @param description - L10nTextDict
 * @param status - Optional(TaskStatus)
 */
interface GameTaskObject {
    /**
     * regex: /[^_]+_tsk/
     */
    id: string
    description: L10nTextDict
    status?: TaskStatus
}

/**
 * @param id - string(/[^_]+_tsk/)
 * @param status - string
 */
interface GameTaskJSON {
    /**
     * regex: /[^_]+_tsk/
     */
    id: string
    status: string
}

class GameTask {
    /**
     * regex: /[^_]+_tsk/
     */
    public id: string
    public description: L10nText
    public status: TaskStatus

    constructor(id: string, description: L10nText, status: TaskStatus | undefined = TaskStatus.DEACTIVE) {
        this.id = id
        this.description = description
        this.status = status ?? TaskStatus.DEACTIVE
    }
    isActive(): boolean {
        return this.status === TaskStatus.ACTIVE
    }
    isFinished(): boolean {
        return this.status === TaskStatus.FINISHED

    }
    activiate() {
        this.status = TaskStatus.ACTIVE
    }
    finish() {
        this.status = TaskStatus.FINISHED
    }
    deactiviate() {
        this.status = TaskStatus.DEACTIVE
    }
    toString(): string {
        return `{"id":"${this.id}","status":"${this.status.toString()}"}`
    }
    static convertStatus(status: string): TaskStatus {
        return status === 'active' ? TaskStatus.ACTIVE : status === 'finished' ? TaskStatus.FINISHED : TaskStatus.DEACTIVE
    }
}

class GameTaskList extends AbstractList<GameTask>{
    constructor(tasks: GameTaskObject[]) {
        super()
        for (let task of tasks) {
            this.data.push(new GameTask(
                task.id,
                new L10nText(task.description),
                task.status
            ))
        }
    }
    isActiveById(id: string): boolean {
        const task = this.getById(id)
        return task !== null && task.status === TaskStatus.ACTIVE
    }
    isFinishedById(id: string): boolean {
        const task = this.getById(id)
        return task !== null && task.status === TaskStatus.FINISHED
    }
    activateById(id: string): boolean {
        const task = this.getById(id)
        if (task !== null) {
            task.activiate()
            return true
        }
        return false
    }
    deactivateById(id: string): boolean {
        const task = this.getById(id)
        if (task !== null) {
            task.deactiviate()
            return true
        }
        return false
    }
    finishById(id: string): boolean {
        const task = this.getById(id)
        if (task !== null) {
            task.finish()
            return true
        }
        return false
    }
}

class GameAction {
    /**
     * regex: /[^_]+_act/
     */
    public id: string
    public action: () => void

    constructor(id: string, f: () => void = () => { }) {
        this.id = id
        this.action = f
    }
    do() {
        this.action()
    }
    static genDeactivateSignatureAct(id: string): () => void {
        return () => {
            game_signature_list.deactivateById(id)
        }
    }
    static genActivateSignatureAct(id: string): () => void {
        return () => {
            game_signature_list.activateById(id)
        }
    }
    static genDeactivateTaskAct(id: string): () => void {
        return () => {
            game_task_list.deactivateById(id)
            game.task_display.remove(id)
            game.task_display.render(game.lang)
        }
    }
    static genActiveTaskAct(id: string): () => void {
        return () => {
            game_task_list.activateById(id)
            game.task_display.add(id)
            game.task_display.render(game.lang)
        }
    }
    static genFinishTaskAct(id: string): () => void {
        return () => {
            game_task_list.finishById(id)
            game.task_display.render(game.lang)
        }
    }
    static genAddPassengerAct(id: string): () => void {
        return () => {
            game.passenger_display.add(id)
            game.passenger_display.render(game.lang)
        }
    }
    static genRemovePassengerAct(id: string): () => void {
        return () => {
            game.passenger_display.remove(id)
            game.passenger_display.render(game.lang)
        }
    }
    static genStepPlotThredAct(id: string): () => void {
        return () => {
            game_plot_thread_list.getById(id)?.step()
        }
    }
    static polyActs(...fs: Array<() => void>): () => void {
        return () => {
            fs.forEach(f => { f() })
        }
    }
}

/**
 * @param id - string(/[^_]+_act/)
 * @param action - Function(() => void)
 */
interface GameActionObject {
    /**
     * regex: /[^_]+_act/
     */
    id: string
    action: () => void
}

class GameActionList extends AbstractList<GameAction>{
    constructor(actions: GameActionObject[]) {
        super()
        for (let action of actions) {
            this.data.push(new GameAction(action.id, action.action))
        }
    }
}

class Passenger {
    /**
     * regex: /[^_]+_psg/
     */
    public id: string
    public name: L10nText
    public avatar_color: string
    public avatar_font_color: string
    public avatar_text: L10nText
    public is_diaplay: boolean

    constructor(id: string, name: L10nText, avatar_color: string, avatar_font_color: string, avatar_text: L10nText, is_display: boolean = true) {
        this.id = id
        this.name = name
        this.avatar_color = avatar_color
        this.avatar_font_color = avatar_font_color
        this.avatar_text = avatar_text
        this.is_diaplay = is_display
    }
}

/**
 * @param id - string(/[^_]+_psg/)
 * @param name - L10nTextDict
 * @param avatar_color - string
 * @param avatar_font_color - string
 * @param avatar_text - L10nTextDict
 * @param is_display - Optional(boolean)
 */
interface PassengerObject {
    /**
     * regex: /[^_]+_psg/
     */
    id: string
    name: L10nTextDict
    avatar_color: string
    avatar_font_color: string
    avatar_text: L10nTextDict
    is_display?: boolean
}

class PassengerList extends AbstractList<Passenger>{
    constructor(passengers: PassengerObject[]) {
        super()
        for (let passenger of passengers) {
            this.data.push(new Passenger(
                passenger.id,
                new L10nText(passenger.name),
                passenger.avatar_color,
                passenger.avatar_font_color,
                new L10nText(passenger.avatar_text),
                passenger.is_display ?? true
            ))
        }
    }
}

enum DialogBlockItemType {
    DIALOG = 'dialog',
    SELECT = 'select'
}

abstract class DialogBlockItem {
    /**
     * regex: /[^_]+_dlg|[^_]+_slt/
     */
    public id: string
    public item_type: DialogBlockItemType

    constructor(id: string, type: DialogBlockItemType = DialogBlockItemType.DIALOG) {
        this.id = id
        this.item_type = type
    }
    isSelect(): boolean {
        return this.item_type === DialogBlockItemType.SELECT
    }
}

class SelectOption {
    /**
     * regex: /[^_]+_[^_]+_opt/
     */
    public id: string
    /**
     * regex: /[^_]+_dlg/
     */
    public next_dialog_block_id: string
    public text: L10nText

    constructor(id: string, next_id: string, text: L10nText) {
        this.id = id
        this.next_dialog_block_id = next_id
        this.text = text
    }
    static splitId(id: string): [string, string] {
        let arr = id.match(/^([^_]+)_([^_]+)_opt$/)
        let id1 = ''
        let id2 = ''
        if (arr !== null) {
            if (arr.length > 1) {
                id1 = arr[1]
            }
            if (arr.length > 2) {
                id2 = arr[2]
            }
        }
        return [id1, id2]
    }
    toString(): string {
        return `{}`
    }
}

/**
 * @param next - string
 * @param text - L10nTextDict
 */
interface OptionObject {
    /**
     * regex: /[^_]+_dlg/
     */
    next: string
    text: L10nTextDict
}

class BranchSelect extends DialogBlockItem {
    public options: SelectOption[]

    constructor(id: string, options: OptionObject[] = []) {
        super(id, DialogBlockItemType.SELECT)
        this.options = []
        for (let i = 0; i < options.length; ++i) {
            this.options.push(new SelectOption(
                `${padLeftZero(i)}_${getNumFromId(this.id)}_opt`,
                options[i].next,
                new L10nText(options[i].text)
            ))
        }
    }
    getOptionById(id: string): SelectOption | null {
        for (let opt of this.options) {
            if (opt.id === id) {
                return opt
            }
        }
        return null
    }
    toString(): string {
        return `{}`
    }
}

enum DialogLayout {
    LEFT = 'left',
    MIDDLE = 'middle',
    RIGHT = 'right'
}

class Dialog extends DialogBlockItem {
    /**
     * regex: /[^_]+_psg/
     */
    public person_id: string
    public text: L10nText
    public layout: DialogLayout
    public is_having_action: boolean
    /**
     * regex: /[^_]+_act/
     */
    public action_id: string

    constructor(id: string, person_id: string, text: L10nText, layout: DialogLayout, action_id: string = '') {
        super(id)
        this.person_id = person_id
        this.text = text
        this.layout = layout
        this.action_id = action_id
        this.is_having_action = action_id === '' ? false : true
    }
    static splitId(id: string): [string, string] {
        let arr = id.match(/^([^_]+)_([^_]+)_dlg$/)
        let id1 = ''
        let id2 = ''
        if (arr !== null) {
            if (arr.length > 1) {
                id1 = arr[1]
            }
            if (arr.length > 2) {
                id2 = arr[2]
            }
        }
        return [id1, id2]
    }
    doAction() {
        if (this.is_having_action) {
            game_action_list.getById(this.action_id)?.do()
        }
    }
    toString(): string {
        return `{}`
    }
}

/**
 * @param person_id - string(/[^_]+_psg/)
 * @param text - L10nTextDict
 * @param layout - DialogLayout
 * @param action_id - Optional(string)
 */
interface DialogObject {
    /**
     * regex: /[^_]+_psg/
     */
    person_id: string
    text: L10nTextDict
    layout: DialogLayout
    /**
     * regex: /[^_]+_act/
     */
    action_id?: string
}

/**
 * @param options - OptionObject[]
 */
interface SelectObject {
    options: OptionObject[]
}

/**
 * @param id - string
 * @param cur_item_index - number
 */
interface SaveDialogBlockJSON {
    id: string
    cur_item_index: number
}

class DialogBlock {
    /**
     * regex: /[^_]+_dbk/
     */
    public id: string
    public cur_item_index: number
    public in_signatures: string[]
    public data: DialogBlockItem[]

    constructor(id: string, in_signatures: string[], dialogs: DialogObject[], select: SelectObject | null = null) {
        this.id = id
        this.in_signatures = in_signatures
        this.data = []
        for (let i = 0; i < dialogs.length; ++i) {
            this.data.push(new Dialog(
                `${padLeftZero(i)}_${getNumFromId(this.id)}_dlg`,
                dialogs[i].person_id,
                new L10nText(dialogs[i].text),
                dialogs[i].layout,
                dialogs[i].action_id ?? ''
            ))
        }
        if (select !== null) {
            this.data.push(new BranchSelect(
                `${getNumFromId(this.id)}$_slt`,
                select.options
            ))
        }
        this.cur_item_index = 0
    }
    getLength(): number {
        return this.data.length
    }
    getItemByIndex(index: number): DialogBlockItem | null {
        return index < 0 || index >= this.data.length ? null : this.data[index]
    }
    getItemById(id: string): DialogBlockItem | null {
        for (let item of this.data) {
            if (item.id === id) {
                return item
            }
        }
        return null
    }
    getCurItem(): DialogBlockItem | null {
        return this.getItemByIndex(this.cur_item_index)
    }
    resetIndex() {
        this.cur_item_index = 0
    }
    setIndexToEnd() {
        this.cur_item_index = this.data.length
    }
    /**
     * range of `cur_dialog_index` is `[0, length]`, `length` is for the end.
     */
    stepIndex() {
        this.cur_item_index += 1
        if (this.cur_item_index < 0) {
            this.cur_item_index = 0
        }
        if (this.cur_item_index > this.data.length) {
            this.cur_item_index = this.data.length
        }
    }
    isNotFirstLine(): boolean {
        if (this.cur_item_index <= 0 || this.cur_item_index >= this.data.length) {
            return false
        }
        const cur = this.getCurItem()
        const pre = this.getItemByIndex(this.cur_item_index - 1)
        if (cur !== null && pre !== null &&
            !cur.isSelect() && !pre.isSelect() &&
            (cur as Dialog).person_id === (pre as Dialog).person_id &&
            (cur as Dialog).layout === (pre as Dialog).layout) {
            return true
        }
        return false
    }
    isFinished(): boolean {
        return this.cur_item_index >= this.data.length
    }
    isUnlocked(): boolean {
        for (let id of this.in_signatures) {
            const sig = game_signature_list.getById(id)
            if (!sig?.isActive()) {
                return false
            }
        }
        return true
    }
    isLastItemNotSelect(): boolean {
        if (this.data.length <= 0) {
            return false
        }
        return !this.data[this.data.length - 1].isSelect()
    }
    toString(): string {
        return `{"id":"${this.id}","cur_item_index":${this.cur_item_index}}`
    }
}

/**
 * @param id - string(/[^_]+_dbk/)
 * @param dialogs - DialogObject[]
 * @param select - Optional(SelectObject)
 */
interface DialogBlockObject {
    /**
     * regex: /[^_]+_dbk/
     */
    id: string
    in_signatures: string[]
    dialogs: DialogObject[]
    select?: SelectObject
}

/**
 * @param dict_item - {dialog_id: [...signature_id]}
 */
interface DialogInDict {
    [dialog_id: string]: string[]
}

/**
 * @param cur_block_id - string
 * @param visited_blocks - string[]
 * @param dialog_blocks - SaveDialogBlockType[]
 */
interface SaveDialogSceneJSON {
    id: string
    cur_block_id: string
    visited_blocks: string[]
    dialog_blocks: SaveDialogBlockJSON[]
}

class DialogScene {
    /**
     * regex: /[^_]+_dsc/
     */
    public id: string
    public dialog_blocks: DialogBlock[]
    public cur_block_id: string
    public visited_blocks: string[]
    public dialog_in_dict: DialogInDict

    constructor(id: string, blocks: DialogBlockObject[]) {
        this.id = id
        this.dialog_in_dict = {}
        this.dialog_blocks = []
        for (let i = 0; i < blocks.length; ++i) {
            this.dialog_blocks.push(
                new DialogBlock(
                    blocks[i].id,
                    blocks[i].in_signatures,
                    blocks[i].dialogs,
                    blocks[i].select ?? null
                )
            )
            this.dialog_in_dict[blocks[i].id] = blocks[i].in_signatures
        }
        this.cur_block_id = ''
        this.visited_blocks = []
    }
    isInclduingBlock(id: string): boolean {
        for (let block of this.dialog_blocks) {
            if (block.id === id) {
                return true
            }
        }
        return false
    }
    setCurDialogBlock(id: string) {
        if (this.isInclduingBlock(id)) {
            this.cur_block_id = id
        }
    }
    getCurDialogBlock(): DialogBlock | null {
        for (let block of this.dialog_blocks) {
            if (block.id === this.cur_block_id) {
                return block
            }
        }
        return null
    }
    getDialogBlock(id: string): DialogBlock | null {
        for (let block of this.dialog_blocks) {
            if (block.id === id) {
                return block
            }
        }
        return null
    }
    addVisitedBlock(id: string) {
        if (this.visited_blocks.indexOf(id) !== -1) {
            return
        }
        this.visited_blocks.push(id)
    }
    removeVisitedBlock(id: string) {
        const index = this.visited_blocks.indexOf(id)
        if (index === -1) {
            return
        }
        this.visited_blocks.splice(index, 1)
    }
    toString(): string {
        return `{"id":"${this.id}","cur_block_id":"${this.cur_block_id}","visited_blocks":[${this.visited_blocks.map(x => `"${x}"`).join(',')}],"dialog_blocks":[${this.dialog_blocks.map(x => x.toString()).join(',')}]}`
    }
}

/**
 * @param id - string(/[^_]+dsc/)
 * @param blocks - DialogBlockObject[]
 */
interface DialogSceneObject {
    /**
     * regex: /[^_]+_dsc/
     */
    id: string
    blocks: DialogBlockObject[]
}

/**
 * @param bg_color - string
 * @param inner_html - string
 */
interface Background {
    bg_color: string
    inner_html: string
}

/**
 * @param id -string
 * @param dialog_scene - SaveDialogSceneType
 */
interface SaveFloorJSON {
    id: string
    dialog_scene: SaveDialogSceneJSON
}

class Floor {
    /**
     * regex: /[^_]+_flr/
     */
    public id: string
    public dialog_scene: DialogScene
    public plot_id_list: string[]
    public background: Background

    constructor(id: string, scene: DialogSceneObject, plot_id_list: string[], background: Background | null = null) {
        this.id = id
        this.dialog_scene = new DialogScene(scene.id, scene.blocks)
        this.plot_id_list = plot_id_list
        this.background = background ?? { bg_color: 'rgba(0, 0, 0, .7)', inner_html: '' }
    }
    checkPlotThreads(): boolean {
        let selected_block_id: string = ''
        let max_prioeity = -Infinity
        for (let plot_id of this.plot_id_list) {
            const plot = game_plot_thread_list.getById(plot_id)
            if (plot === null || !plot.isUnlocked() || plot.isFinished() || plot.getCurFloorId() !== this.id) {
                continue
            }
            let signature_id = plot.getCurSignatureId()
            let is_set = false
            for (let block_id of Object.keys(this.dialog_scene.dialog_in_dict)) {
                // check if in_list of block includes certain signarue
                // console.log(plot_id, signature_id, block_id)
                if (this.dialog_scene.dialog_in_dict[block_id].indexOf(signature_id) === -1) {
                    continue
                }
                // check if block is unlocked and not finished
                const block = this.dialog_scene.getDialogBlock(block_id)
                if (block === null || !block.isUnlocked() || this.dialog_scene.cur_block_id === block.id) {
                    continue
                }
                // TODO: need step?
                // if plot's current corresponding block finished, step plot to next
                if (block.isFinished()) {
                    plot.step()
                    continue
                }
                // priority of [...plot.signature] is MAX([...plot.priority])
                if (plot.priority > max_prioeity && !is_set) {
                    selected_block_id = block.id
                    max_prioeity = plot.priority
                    is_set = true
                }
            }
        }
        console.log(`slt: ${selected_block_id},\ncur: ${this.dialog_scene.cur_block_id},\nis_cur_finish: ${this.dialog_scene.getCurDialogBlock()?.isFinished()}`)
        // only if cur block finished, new block can be set
        if (this.dialog_scene.cur_block_id === '' || (this.dialog_scene.getCurDialogBlock()?.isFinished() && this.dialog_scene.getCurDialogBlock()?.isLastItemNotSelect())) {
            if (this.dialog_scene.cur_block_id !== '') {
                this.dialog_scene.addVisitedBlock(this.dialog_scene.cur_block_id)
            }
            this.dialog_scene.setCurDialogBlock(selected_block_id)
        }

        return selected_block_id !== ''
    }
    toString(): string {
        return `{"id":"${this.id}","dialog_scene":${this.dialog_scene.toString()}}`
    }
}

/**
 * @param id - string(/[^_]+_flr/)
 * @param dialog_scene - DialogSceneObject
 * @param plot_id_list - string[]
 * @param background - Optional(Background)
 */
interface FloorObject {
    /**
     * regex: /[^_]+_flr/
     */
    id: string
    dialog_scene: DialogSceneObject
    plot_id_list: string[]
    background?: Background
}

class FloorList extends AbstractList<Floor>{
    constructor(floors: FloorObject[]) {
        super()
        for (let floor of floors) {
            this.data.push(new Floor(
                floor.id,
                floor.dialog_scene,
                floor.plot_id_list,
                floor.background ?? null
            ))
        }
    }
}

/**
 * @param dict_item - {signature_id: floor_id}
 */
interface SignatureFloorDict {
    [signature_id: string]: string
}

/**
 * @param signature - string(/[^_]+_sig/)
 * @param floor - string(/[^_]+_flr/)
 */
interface SignatureFloorItem {
    /**
     * regex: /[^_]+_sig/
     */
    signature: string
    /**
     * regex: /[^_]+_flr/
     */
    floor: string
}

/**
 * floor check plot, plot 
 */
class PlotThread {
    /**
     * regex: /[^_]+_plt/
     */
    public id: string
    public priority: number
    public signature_floor_dict: SignatureFloorDict
    public signatures: string[]
    public in_signatures: string[]
    public cur_signature_index: number

    constructor(id: string, priority: number, signature_floor_list: SignatureFloorItem[], in_signatures: string[] = []) {
        this.id = id
        this.priority = priority
        this.signature_floor_dict = {}
        this.signatures = []
        for (let item of signature_floor_list) {
            this.signature_floor_dict[item.signature] = item.floor
            this.signatures.push(item.signature)
        }
        this.in_signatures = in_signatures
        this.cur_signature_index = 0
    }
    step() {
        this.cur_signature_index += 1
        if (this.cur_signature_index < 0) {
            this.cur_signature_index = 0
        }
        if (this.cur_signature_index > this.signatures.length) {
            this.cur_signature_index = this.signatures.length
        }
    }
    getCurFloorId(): string {
        if (this.cur_signature_index < 0 ||
            this.cur_signature_index >= this.signatures.length ||
            Object.keys(this.signature_floor_dict).indexOf(this.signatures[this.cur_signature_index]) === -1) {
            return ''
        }
        return this.signature_floor_dict[this.signatures[this.cur_signature_index]]
    }
    getCurSignatureId(): string {
        if (this.cur_signature_index < 0 ||
            this.cur_signature_index >= this.signatures.length) {
            return ''
        }

        return this.signatures[this.cur_signature_index]
    }
    getSignatureById(index: number): Signature | null {
        if (index < 0 || index >= this.signatures.length) {
            return null
        }
        return game_signature_list.getById(this.signatures[index])
    }
    getCurSignature(): Signature | null {
        return this.getSignatureById(this.cur_signature_index)
    }
    isUnlocked(): boolean {
        if (this.in_signatures.length <= 0) {
            return true
        }
        for (let id of this.in_signatures) {
            const signature = game_signature_list.getById(id)
            if (signature !== null) {
                if (!signature.isActive()) {
                    return false
                }
            }
        }
        return true
    }
    isFinished(): boolean {
        if (this.signatures.length <= 0) {
            return true
        }
        if (this.cur_signature_index < this.signatures.length) {
            return false
        }
        for (let id of this.signatures) {
            const signature = game_signature_list.getById(id)
            if (signature !== null) {
                if (!signature.isActive()) {
                    return false
                }
            }
        }
        return true
    }
}

/**
 * @param id - string(/[^_]+_plt/)
 * @param priority - number
 * @param signature_floor_list - SignatureFloorItem[]
 * @param in_signatures - string[]
 */
interface PlotThreadObject {
    /**
     * regex: /[^_]+_plt/
     */
    id: string
    priority: number
    signature_floor_list: SignatureFloorItem[]
    in_signatures: string[]
}

class PlotThreadList extends AbstractList<PlotThread>{
    constructor(threads: PlotThreadObject[]) {
        super()
        this.data = []
        for (let thread of threads) {
            this.data.push(new PlotThread(
                thread.id,
                thread.priority,
                thread.signature_floor_list,
                thread.in_signatures
            ))
        }
    }
    getById(id: string): PlotThread | null {
        for (let thread of this.data) {
            if (thread.id === id) {
                return thread
            }
        }
        return null
    }
}

enum DotColor {
    DARK = 'dark',
    LIGHT = 'light'
}

class WaitingDotsAnimation {
    private dots: HTMLElement[]
    private orders: DotColor[][]
    private step: number
    private timer: number | undefined
    private interval: number

    constructor() {
        this.dots = []
        this.orders = []
        this.step = 0
        this.timer = undefined
        this.interval = 250
    }
    generateOrders(num: number): DotColor[][] {
        if (num === 0) {
            return []
        }
        let res: number[][] = []
        for (let i of range(num * 2)) {
            if (i === 0) {
                res.push(Array(num).fill(0))
            } else {
                let order = [...res[i - 1]]
                let is_all_same = true
                for (let j of range(order.length)) {
                    if (j !== 0) {
                        if (order[j - 1] !== order[j]) {
                            order[j] = order[j - 1]
                            is_all_same = false
                            break
                        }
                    }
                }
                if (is_all_same) {
                    order[0] ^= 1
                }
                res.push(order)
            }
        }
        return res.map(i => i.map(j => j === 0 ? DotColor.DARK : DotColor.LIGHT))
    }
    toggle(dot: HTMLElement, color_type: DotColor) {
        switch (color_type) {
            case DotColor.DARK:
                removeElementClass(dot, 'light-dot')
                addElementClass(dot, 'dark-dot')
                break
            case DotColor.LIGHT:
                removeElementClass(dot, 'dark-dot')
                addElementClass(dot, 'light-dot')
                break
            default:
                break
        }
    }
    start() {
        this.dots = Array.from(qsa('#sheng-lue-dots .sl-dot'))
        this.orders = this.generateOrders(this.dots.length)
        clearInterval(this.timer)
        this.timer = setInterval(() => {
            for (let i of range(this.orders[this.step].length)) {
                this.toggle(this.dots[i], this.orders[this.step][i])
            }
            this.step = (this.step + 1) % this.orders.length
        }, this.interval)
    }
    stop() {
        clearInterval(this.timer)
    }
}

class FloorButton {
    public index: number
    public text: string
    public is_available: boolean
    // public selected: boolean

    constructor(index: number, text: string, is_available: boolean) {
        this.index = index
        this.text = text
        this.is_available = is_available
        // this.selected = false
    }
}

enum DoorDir {
    OPEN = 'open',
    CLOSE = 'close'
}

class Door {
    public is_moving: boolean
    public is_open: boolean
    private direction: DoorDir
    private timer_count: number
    private sleep_time: number
    private l_part: HTMLElement
    private r_part: HTMLElement
    private step: number

    constructor() {
        this.is_moving = false
        this.is_open = false
        this.direction = DoorDir.OPEN
        this.timer_count = 20
        this.sleep_time = 6
        this.l_part = {} as HTMLElement
        this.r_part = {} as HTMLElement
        this.step = 0
    }
    stop() {
        this.is_moving = false
        switch (this.direction) {
            case DoorDir.OPEN:
                this.is_open = true
                this.direction = DoorDir.CLOSE
                qs('#elev-door').style.display = 'none'
                break
            case DoorDir.CLOSE:
                this.is_open = false
                this.direction = DoorDir.OPEN
                break
            default:
                break
        }
    }
    move() {
        const l_part_left = parseInt(this.l_part.style.left)
        const r_part_left = parseInt(this.r_part.style.left)
        switch (this.direction) {
            case DoorDir.OPEN:
                this.l_part.style.left = `${l_part_left - this.step}px`
                this.r_part.style.left = `${r_part_left + this.step}px`
                break
            case DoorDir.CLOSE:
                this.l_part.style.left = `${l_part_left + this.step}px`
                this.r_part.style.left = `${r_part_left - this.step}px`
                break
            default:
                break
        }
    }
    syncStart(direction: DoorDir) {
        this.direction = direction
        this.is_moving = true
        this.l_part = qs('#elev-door>div:nth-child(1)')
        this.r_part = qs('#elev-door>div:nth-child(2)')
        qs('#elev-door').style.display = 'flex'
        this.step = Math.ceil(this.l_part.clientWidth / this.timer_count)
        for (let _ in range(this.timer_count)) {
            this.move()
        }
        this.stop()
    }
    async start(direction: DoorDir) {
        this.direction = direction
        this.is_moving = true
        this.l_part = qs('#elev-door>div:nth-child(1)')
        this.r_part = qs('#elev-door>div:nth-child(2)')
        qs('#elev-door').style.display = 'flex'
        this.step = Math.ceil(this.l_part.clientWidth / this.timer_count)
        for (let _ in range(this.timer_count)) {
            this.move()
            await sleep(this.sleep_time)
        }
        this.stop()
    }
}

/**
 * @param index - number
 * @param floor - number
 */
interface PendingFloor {
    index: number
    floor: number
}

class PendingQueue {
    public data: PendingFloor[]

    constructor() {
        this.data = []
    }
    clear() {
        this.data = []
    }
    sort() {
        for (let i = 0; i < this.data.length; i++) {
            this.data[i].index = i
        }
    }
    length(): number {
        return this.data.length
    }
    indexOf(value: number): number {
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].floor === value) {
                return i
            }
        }
        return -1
    }
    add(value: number) {
        if (this.indexOf(value) === -1) {
            this.data.push({ floor: value, index: this.data.length })
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
    getMax(): PendingFloor {
        if (this.data.length <= 0) {
            return { floor: 0, index: -1 }
        }
        let k = 0
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].floor > this.data[k].floor) {
                k = i
            }
        }
        return this.data[k]
    }
    getMin(): PendingFloor {
        if (this.data.length <= 0) {
            return { floor: 0, index: -1 }
        }
        let k = 0
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].floor < this.data[k].floor) {
                k = i
            }
        }
        return this.data[k]
    }
}

enum FloorLiftStatus {
    UP = 'up',
    DOWN = 'down',
    NONE = 'none',
    BOTH = 'both'
}

class FloorDisplay {
    private display_number: HTMLElement | null
    private up_icon: HTMLElement | null
    private down_icon: HTMLElement | null
    private static random_timer: number | undefined
    private static pre_number: number | undefined

    constructor() {
        this.display_number = null
        this.up_icon = null
        this.down_icon = null
        FloorDisplay.random_timer = undefined
        FloorDisplay.pre_number = undefined
    }
    /**
     * 
     * @param status 
     * string
     */
    updateIcon(status: FloorLiftStatus) {
        if (this.up_icon === null) {
            this.up_icon = qs('#up-icon')
        }
        if (this.down_icon === null) {
            this.down_icon = qs('#down-icon')
        }
        const class_name = 'invisible'
        switch (status) {
            case FloorLiftStatus.UP:
                removeElementClass(this.up_icon, class_name)
                addElementClass(this.down_icon, class_name)
                break
            case FloorLiftStatus.DOWN:
                removeElementClass(this.down_icon, class_name)
                addElementClass(this.up_icon, class_name)
                break
            case FloorLiftStatus.NONE:
                addElementClass(this.up_icon, class_name)
                addElementClass(this.down_icon, class_name)
                break
            case FloorLiftStatus.BOTH:
                removeElementClass(this.up_icon, class_name)
                removeElementClass(this.down_icon, class_name)
                break
            default:
                break
        }
    }
    updateNumber(num: number) {
        if (this.display_number === null) {
            this.display_number = qs('#display-number')
        }
        this.display_number.textContent = num.toString()
    }
    static startRandomDisplay() {
        FloorDisplay.pre_number = parseInt(qs('#display-number').textContent ?? '') ?? 0
        FloorDisplay.random_timer = setInterval(() => {
            const display = qs('#display-number')
            if (display !== null) {
                display.textContent = getRandomInt(-99, 99).toString()
            }
        }, 200)
    }
    static stopRandomDisplay() {
        if (FloorDisplay.random_timer) {
            clearInterval(FloorDisplay.random_timer)
            const display = qs('#display-number')
            if (display !== null) {
                display.textContent = (FloorDisplay.pre_number ?? 0).toString()
            }
        }
    }
}

enum SavePanelDir {
    OPEN = 'open',
    CLOSE = 'close'
}

class SavePanel {
    public is_moving: boolean
    public is_open: boolean
    private direction: SavePanelDir
    private timer_count: number
    private sleep_time: number
    private cover: HTMLElement
    private step: number

    constructor() {
        this.is_moving = false
        this.is_open = false
        this.direction = SavePanelDir.OPEN
        this.timer_count = 15
        this.sleep_time = 5
        this.cover = {} as HTMLElement
        this.step = 0
    }
    stop() {
        this.is_moving = false
        switch (this.direction) {
            case SavePanelDir.OPEN:
                this.is_open = true
                this.direction = SavePanelDir.CLOSE
                break
            case SavePanelDir.CLOSE:
                this.is_open = false
                this.direction = SavePanelDir.OPEN
                break
            default:
                break
        }
    }
    move() {
        const cover_top = parseInt(this.cover.style.top)
        switch (this.direction) {
            case SavePanelDir.OPEN:
                this.cover.style.top = `${cover_top - this.step}px`
                break
            case SavePanelDir.CLOSE:
                this.cover.style.top = `${cover_top + this.step}px`
                break
            default:
                break
        }
    }
    syncStart(direction: SavePanelDir) {
        this.direction = direction
        this.is_moving = true
        this.cover = qs('#save-panel-cover')
        this.step = Math.ceil(this.cover.clientHeight / this.timer_count)
        for (let _ in range(this.timer_count)) {
            this.move()
        }
        this.stop()
    }
    async start(direction: SavePanelDir) {
        this.direction = direction
        this.is_moving = true
        this.cover = qs('#save-panel-cover')
        this.step = Math.ceil(this.cover.clientHeight / this.timer_count)
        for (let _ in range(this.timer_count)) {
            this.move()
            await sleep(this.sleep_time)
        }
        this.stop()
    }
}

enum LangBtnDir {
    LEFT = 'left',
    RIGHT = 'right',
    NONE = 'none'
}

class LanguageDisplay {
    private index: number
    private next_index: number
    public is_moving: boolean
    private direction: LangBtnDir
    private angle: number
    private ori_angle: number
    private timer_count: number
    private sleep_time: number
    private spin: HTMLElement
    private step: number
    private counter: number

    constructor() {
        this.index = 0
        this.next_index = 0
        this.is_moving = false
        this.direction = LangBtnDir.NONE
        this.angle = 90
        this.ori_angle = -45
        this.timer_count = 15
        this.sleep_time = 8
        this.spin = {} as HTMLElement
        this.step = 0
        this.counter = 0
    }
    stop() {
        this.is_moving = false
        this.direction = LangBtnDir.NONE
        this.counter = 0
        this.index = this.next_index
        qs('#lang-name-prev>.lang-name-text').textContent = ''
        qs('#lang-name-cur>.lang-name-text').textContent = game_lang_list.getItemByIndex(this.index).name
        qs('#lang-name-next>.lang-name-text').textContent = ''
        this.spin.style.transform = `rotate(${this.ori_angle}deg)`
    }
    move() {
        this.counter += 1
        switch (this.direction) {
            case LangBtnDir.LEFT:
                this.spin.style.transform = `rotate(${this.ori_angle - this.step * this.counter}deg)`
                break
            case LangBtnDir.RIGHT:
                this.spin.style.transform = `rotate(${this.ori_angle + this.step * this.counter}deg)`
                break
            default:
                break
        }
    }
    syncStart(direction: LangBtnDir) {
        this.direction = direction
        this.is_moving = true
        this.spin = qs('#lang-name-body')
        this.step = Math.ceil(this.angle / this.timer_count)
        switch (this.direction) {
            case LangBtnDir.LEFT:
                this.next_index = (this.index + 1) % game_lang_list.getLength()
                qs('#lang-name-prev>.lang-name-text').textContent = ''
                qs('#lang-name-next>.lang-name-text').textContent = game_lang_list.getItemByIndex(this.next_index).name
                break
            case LangBtnDir.RIGHT:
                this.next_index = (this.index - 1 + game_lang_list.getLength()) % game_lang_list.getLength()
                qs('#lang-name-prev>.lang-name-text').textContent = game_lang_list.getItemByIndex(this.next_index).name
                qs('#lang-name-next>.lang-name-text').textContent = ''
                break
            default:
                break
        }
        for (let _ in range(this.timer_count)) {
            this.move()
        }
        this.stop()
    }
    async start(direction: LangBtnDir) {
        this.direction = direction
        this.is_moving = true
        this.spin = qs('#lang-name-body')
        this.step = Math.ceil(this.angle / this.timer_count)
        switch (this.direction) {
            case LangBtnDir.LEFT:
                this.next_index = (this.index + 1) % game_lang_list.getLength()
                qs('#lang-name-prev>.lang-name-text').textContent = ''
                qs('#lang-name-next>.lang-name-text').textContent = game_lang_list.getItemByIndex(this.next_index).name
                break
            case LangBtnDir.RIGHT:
                this.next_index = (this.index - 1 + game_lang_list.getLength()) % game_lang_list.getLength()
                qs('#lang-name-prev>.lang-name-text').textContent = game_lang_list.getItemByIndex(this.next_index).name
                qs('#lang-name-next>.lang-name-text').textContent = ''
                break
            default:
                break
        }
        for (let _ in range(this.timer_count)) {
            this.move()
            await sleep(this.sleep_time)
        }
        this.stop()
    }
    set(id: string) {
        let i = game_lang_list.indexOfKey(id)
        if (i === -1) {
            i = 0
        }
        this.index = i
        qs('#lang-name-prev>.lang-name-text').textContent = ''
        qs('#lang-name-cur>.lang-name-text').textContent = game_lang_list.getItemByIndex(this.index).name
        qs('#lang-name-next>.lang-name-text').textContent = ''
    }
    get(): string {
        return game_lang_list.getItemByIndex(this.index).id
    }
}

abstract class ListDisplay<T> {
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
    toString(): string {
        return `[${this.data.map(x => `"${x}"`).join(',')}]`
    }
    reset(data: string[]) {
        this.data = data
    }
    abstract getValidCount(): number
    abstract getByIndex(index: number): T | null
    abstract render(lang: string): void
}

class PassengerDisplay extends ListDisplay<Passenger> {
    constructor(id_list: string[] = []) {
        super(id_list)
    }
    getValidCount(): number {
        let count = 0
        for (let id of this.data) {
            const psg = game_passenger_list.getById(id)
            if (psg !== null && psg.is_diaplay) {
                count += 1
            }
        }
        return count
    }
    getByIndex(index: number): Passenger | null {
        if (index < 0 || index >= this.data.length) {
            return null
        }
        return game_passenger_list.getById(this.data[index])
    }
    render(lang: string) {
        const psg_list = qs('#passenger-list')
        const psg_count = qs('#passenger-display-count')

        psg_count.innerHTML = this.getValidCount().toString()

        clearChildren(psg_list)
        for (let id of this.data) {
            const psg = game_passenger_list.getById(id)
            if (psg !== null && psg.is_diaplay) {
                let div = document.createElement('div')
                div.classList.add('passenger-item', 'noscrollbar')
                div.innerHTML = psg.name.get(lang)
                psg_list.appendChild(div)
            }
        }
    }
}

class TaskDisplay extends ListDisplay<GameTask> {
    constructor(id_list: string[] = []) {
        super(id_list)
    }
    getValidCount(): number {
        let count = 0
        for (let id of this.data) {
            const tsk = game_task_list.getById(id)
            if (tsk !== null && (tsk.isActive() || tsk.isFinished())) {
                count += 1
            }
        }
        return count
    }
    getByIndex(index: number): GameTask | null {
        if (index < 0 || index >= this.data.length) {
            return null
        }
        return game_task_list.getById(this.data[index])
    }
    render(lang: string) {
        const tsk_container = qs('#task-container')
        clearChildren(tsk_container)
        for (let id of this.data) {
            const tsk = game_task_list.getById(id)
            if (tsk !== null && (tsk.isActive() || tsk.isFinished)) {
                let div = document.createElement('div')
                div.classList.add('task-item')
                if (tsk.isFinished()) {
                    div.classList.add('task-done-item')
                }
                div.innerHTML = tsk.description.get(lang)
                tsk_container.appendChild(div)
            }
        }
    }
}

/**
 * @param \[key: string\]: L10nTextDict
 */
interface UiStringDictRaw {
    [key: string]: L10nTextDict
}

/**
 * @param \[key: string\]: L10nText
 */
interface UiStringDict {
    [key: string]: L10nText
}

/**
 * @param index - number
 * @param is_available - boolean
 */
interface SaveFloorButtonJSON {
    index: number
    is_available: boolean
}

/**
 * @param lang - string
 * @param cur_floor - number
 * @param floor_buttons - SaveFloorButtonType[]
 * @param passenger_display - string[]
 * @param task_display - string[]
 */
interface SaveGameJSON {
    lang: string
    cur_floor: number
    floor_buttons: SaveFloorButtonJSON[]
    passenger_display: string[]
    task_display: string[]
}

/**
 * @param signatures - SignatureJSON[]
 * @param tasks - GameTaskJSON[]
 * @param floors - string[]
 * @param game - SaveGameJSON
 */
interface SaveDataJSON {
    signatures: SignatureJSON[]
    tasks: GameTaskJSON[]
    floors: SaveFloorJSON[]
    game: SaveGameJSON
}

/**
 * @param status - boolean
 * @param data - SaveDataType
 */
interface SaveRootJSON {
    status: boolean
    data: SaveDataJSON
}

class EncryptTool {
    static encrypt(raw: string): string {
        return btoa(encodeURIComponent(raw))
    }
    static decipher(encrypted: string): string {
        return decodeURIComponent(atob(encrypted))
    }
}

class Game {
    public lang: string
    private floor_buttons: FloorButton[][]
    public cur_floor: number
    public max_floor: number
    public min_floor: number
    public is_lifting: boolean
    private lift_interval: number
    private lift_direction: FloorLiftStatus
    private cur_dest: number
    public pending_queue: PendingQueue
    public door: Door
    public dots_animation: WaitingDotsAnimation
    public floor_display: FloorDisplay
    public save_panel: SavePanel
    public language_display: LanguageDisplay
    public ui_string: UiStringDict
    public passenger_display: PassengerDisplay
    public task_display: TaskDisplay

    constructor() {
        this.lang = game_default_lang
        this.floor_buttons = []
        this.cur_floor = 1
        this.max_floor = 6
        this.min_floor = -2
        this.is_lifting = false
        this.lift_interval = 200
        this.lift_direction = FloorLiftStatus.NONE
        this.cur_dest = 0
        this.pending_queue = new PendingQueue()
        this.door = new Door()
        this.dots_animation = new WaitingDotsAnimation()
        this.floor_display = new FloorDisplay()
        this.save_panel = new SavePanel()
        this.language_display = new LanguageDisplay()
        this.ui_string = {}
        for (let key of Object.keys(game_ui_string_raw)) {
            this.ui_string[key] = new L10nText(game_ui_string_raw[key])
        }
        this.passenger_display = new PassengerDisplay([])
        this.task_display = new TaskDisplay([])
    }
    static jumpToBottom() {
        const dlg_cn = qs('#dialog-container')
        dlg_cn.scrollTop = dlg_cn.scrollHeight
    }
    static hideJumpButton() {
        qs('#jump-button').style.display = 'none'
    }
    static showJumpButton() {
        qs('#jump-button').style.display = 'flex'
    }
    static hideGoOnButton() {
        qs('#sheng-lue-dots').style.display = 'none'
        qs('#go-on-button-row').style.display = 'none'
    }
    static showGoOnButton() {
        qs('#sheng-lue-dots').style.display = 'flex'
        qs('#go-on-button-row').style.display = 'flex'
    }
    static hideOptions() {
        qs('#options-row').style.display = 'none'
    }
    static showOptions() {
        qs('#options-row').style.display = 'flex'
    }
    getCurrentFloor(): Floor | null {
        return game_floor_list.getById(`${this.cur_floor}_flr`)
    }
    static disableFloorButtons() {
        qsa('.button-col').forEach(button => {
            button.classList.add('unclickable')
        })
    }
    static enableFloorButtons() {
        qsa('.button-col').forEach(button => {
            button.classList.remove('unclickable')
        })
    }
    static disableSaveButtons() {
        qsa('.save-button-wrap').forEach(button => {
            button.classList.add('unclickable')
        })
    }
    static enableSaveButtons() {
        qsa('.save-button-wrap').forEach(button => {
            button.classList.remove('unclickable')
        })
    }
    static getTFIcon(icon_type: boolean): HTMLElement {
        if (icon_type) {
            let icon_t = document.createElement('div')
            icon_t.classList.add('save-opration-succ')
            for (let _ in range(2)) {
                icon_t.appendChild(document.createElement('div'))
            }
            return icon_t
        }
        else {
            let icon_f = document.createElement('div')
            icon_f.classList.add('save-opration-fail')
            for (let _ in range(2)) {
                icon_f.appendChild(document.createElement('div'))
            }
            return icon_f
        }
    }
    static checkWhenBlockFinish(floor: Floor, block: DialogBlock) {
        if (block.isFinished() && block.isLastItemNotSelect()) {
            Game.hideOptions()
            if (floor.checkPlotThreads()) {
                Game.showGoOnButton()
            } else {
                Game.hideGoOnButton()
            }
            if (block.id !== floor.dialog_scene.cur_block_id) {
                floor.dialog_scene.addVisitedBlock(block.id)
            }
        }
    }
    static createAvatar(psg_id: string, lang: string): HTMLElement {
        const psg = game_passenger_list.getById(psg_id)
        let pfp: HTMLElement = document.createElement('div')
        pfp.classList.add('avatar')
        let pfp_text: HTMLElement = document.createElement('div')
        pfp_text.classList.add('unselectable')
        if (psg !== null) {
            pfp_text.style.backgroundColor = psg.avatar_color
            pfp_text.style.color = psg.avatar_font_color
            pfp_text.innerHTML = psg.avatar_text.get(lang)
            pfp_text.setAttribute('lkey', psg.id)
        }
        pfp.appendChild(pfp_text)
        return pfp
    }
    static createDialogElement(dialog: Dialog, lang: string, is_not_first: boolean = true): HTMLElement | null {
        switch (dialog.layout) {
            case DialogLayout.LEFT:
                let l: HTMLElement = document.createElement('div')
                l.classList.add('dialog-row', 'left-dialog-row')
                let l_box: HTMLElement = document.createElement('div')
                l_box.classList.add('dialog-box', 'left-dialog-box')
                if (is_not_first) {
                    l_box.classList.add('left-not-first-line')
                }
                l_box.innerHTML = dialog.text.get(lang)
                l_box.setAttribute('lkey', dialog.id)
                if (!is_not_first) {
                    l.append(Game.createAvatar(dialog.person_id, lang))
                }
                l.append(l_box)
                return l
            case DialogLayout.RIGHT:
                let r: HTMLElement = document.createElement('div')
                r.classList.add('dialog-row', 'right-dialog-row')
                let r_box: HTMLElement = document.createElement('div')
                r_box.classList.add('dialog-box', 'right-dialog-box')
                if (is_not_first) {
                    r_box.classList.add('right-not-first-line')
                }
                r_box.innerHTML = dialog.text.get(lang)
                r_box.setAttribute('lkey', dialog.id)
                r.append(r_box)
                if (!is_not_first) {
                    r.append(Game.createAvatar(dialog.person_id, lang))
                }
                return r
            case DialogLayout.MIDDLE:
                let m: HTMLElement = document.createElement('div')
                m.classList.add('dialog-row', 'mid-dialog-row')
                let m_box: HTMLElement = document.createElement('div')
                m_box.classList.add('dialog-box', 'mid-dialog-box')
                m_box.innerHTML = dialog.text.get(lang)
                m_box.setAttribute('lkey', dialog.id)
                m.appendChild(m_box)
                return m
            default:
                return null
        }
    }
    static createOptionElement(opt: SelectOption, lang: string): HTMLElement {
        let opt_btn = document.createElement('div')
        opt_btn.classList.add('option-button', 'noscrollbar')
        opt_btn.setAttribute('next', opt.next_dialog_block_id)
        let opt_text = document.createElement('div')
        opt_text.classList.add('unselectable')
        opt_text.innerHTML = opt.text.get(lang)
        opt_text.setAttribute('lkey', opt.id)
        opt_btn.appendChild(opt_text)
        opt_btn.addEventListener('click', () => {
            Game.hideOptions()
            const next = opt_btn.getAttribute('next')
            const floor = game.getCurrentFloor()
            if (floor === null || next === null) {
                return
            }
            Game.renderBrElement()
            floor.dialog_scene.addVisitedBlock(floor.dialog_scene.cur_block_id)
            floor.dialog_scene.setCurDialogBlock(next)
            const block = floor.dialog_scene.getCurDialogBlock()
            if (block === null) {
                return
            }
            block.resetIndex()
            Game.stepDialog(block, game.lang)
            Game.checkWhenBlockFinish(floor, block)
            Game.jumpToBottom()
        })
        return opt_btn
    }
    static renderDialog(dialog: Dialog, lang: string, is_not_first: boolean = true): boolean {
        const dialog_container = qs('#dialog-container')
        const dialog_ele = Game.createDialogElement(dialog, lang, is_not_first)
        if (dialog_ele !== null) {
            dialog_container.appendChild(dialog_ele)
            return true
        }
        return false
    }
    static renderSelect(select: BranchSelect, lang: string) {
        Game.hideGoOnButton()
        const opt_row: HTMLElement = qs('#options-row')
        clearChildren(opt_row)
        for (let opt of select.options) {
            opt_row.appendChild(Game.createOptionElement(opt, lang))
        }
        Game.showOptions()
    }
    static stepDialog(block: DialogBlock, lang: string, is_do_action: boolean = true) {
        const item = block.getCurItem()
        if (item === null) {
            if (!block.isFinished()) {
                Game.hideOptions()
                block.stepIndex()
                Game.showGoOnButton()
            } else {
                Game.hideOptions()
                Game.hideGoOnButton()
            }
            return
        }
        if (item.isSelect()) {
            Game.renderSelect(item as BranchSelect, lang)
            block.setIndexToEnd()
        } else {
            Game.hideOptions()
            Game.renderDialog(item as Dialog, lang, block.isNotFirstLine())
            if (is_do_action) {
                (item as Dialog).doAction()
            }
            block.stepIndex()
            if (!block.isFinished()) {
                Game.showGoOnButton()
            } else {
                Game.renderBrElement()
                Game.hideGoOnButton()
            }
        }
    }
    /**
     * 
     * @param block 
     * @param is_render_all - if true, will not render select; if false, render to `cur_item_index`
     */
    static renderBrElement() {
        let br_row = document.createElement('div')
        br_row.classList.add('dialog-row', 'mid-dialog-row')
        let br_element = document.createElement('div')
        br_element.classList.add('block-br')
        br_row.appendChild(br_element)
        qs('#dialog-container').appendChild(br_row)
    }
    static renderBlock(block: DialogBlock, lang: string, is_render_all: boolean = true) {
        let pre_id = ''
        for (let i = 0; i < block.getLength(); ++i) {
            if (!is_render_all && i >= block.cur_item_index) {
                if (i === 0) {
                    // this block haven't been rendered, so render the first dialog
                    // Game.stepDialog(block, lang)
                    Game.hideOptions()
                    if (!is_render_all) {
                        Game.showGoOnButton()
                    }
                }
                break
            }
            const item = block.getItemByIndex(i)
            if (item === null) {
                break
            }
            if (item.isSelect()) {
                if (!is_render_all) {
                    Game.renderSelect(item as BranchSelect, lang)
                    break
                }
            } else {
                Game.hideOptions()
                if (Game.renderDialog(item as Dialog, lang, pre_id === (item as Dialog).person_id)) {
                    pre_id = (item as Dialog).person_id
                }
                if (!is_render_all) {
                    Game.showGoOnButton()
                }
            }
        }
        if (block.getLength() > 0 && is_render_all) {
            Game.renderBrElement()
        }
    }
    getCurDestination(): number {
        return this.cur_dest
    }
    renderFloor() {
        Game.hideGoOnButton()
        Game.hideOptions()
        clearChildren(qs('#dialog-container') as HTMLElement)
        const bg: HTMLElement = qs('#background')
        const floor = this.getCurrentFloor()
        if (floor === null) {
            bg.style.backgroundColor = ''
            bg.innerHTML = ''
            return
        }
        floor.checkPlotThreads()
        bg.style.backgroundColor = floor.background.bg_color
        bg.innerHTML = floor.background.inner_html
        // render visited blocks
        for (let block_id of floor.dialog_scene.visited_blocks) {
            const vis_block = floor.dialog_scene.getDialogBlock(block_id)
            if (vis_block !== null) {
                Game.renderBlock(vis_block, this.lang)
            }
        }
        //render current block
        const cur_block = floor.dialog_scene.getCurDialogBlock()
        if (cur_block !== null && floor.dialog_scene.visited_blocks.indexOf(cur_block.id) === -1) {
            Game.renderBlock(cur_block, this.lang, false)
            if (cur_block.isFinished()) {
                Game.hideGoOnButton()
                if (cur_block.isLastItemNotSelect()) {
                    Game.renderBrElement()
                }
            }
        }
        Game.hideJumpButton()
        Game.jumpToBottom()
    }
    isLiftable(): boolean {
        return !(this.pending_queue.length() <= 0 ||
            this.lift_direction !== FloorLiftStatus.UP && this.lift_direction !== FloorLiftStatus.DOWN ||
            this.cur_dest > this.max_floor ||
            this.cur_dest < this.min_floor ||
            this.cur_dest === 0 ||
            this.cur_dest === this.cur_floor)
    }
    calcLiftDirection() {
        if (this.pending_queue.length() > 0) {
            if (this.pending_queue.length() === 1) {
                const dest = this.pending_queue.getMax().floor
                this.lift_direction = dest > this.cur_floor ? FloorLiftStatus.UP : (dest < this.cur_floor ? FloorLiftStatus.DOWN : FloorLiftStatus.NONE)
                this.cur_dest = dest
            } else {
                const top = this.pending_queue.getMax()
                const bottom = this.pending_queue.getMin()
                if (top.floor >= this.cur_floor &&
                    this.cur_floor >= bottom.floor) {
                    if (top.index <= bottom.index) {
                        this.lift_direction = FloorLiftStatus.UP
                        this.cur_dest = top.floor
                    } else {
                        this.lift_direction = FloorLiftStatus.DOWN
                        this.cur_dest = bottom.floor
                    }
                } else if (bottom.floor >= this.cur_floor) {
                    this.lift_direction = FloorLiftStatus.UP
                    this.cur_dest = top.floor
                } else if (top.floor <= this.cur_floor) {
                    this.lift_direction = FloorLiftStatus.DOWN
                    this.cur_dest = bottom.floor
                } else {
                    this.lift_direction = FloorLiftStatus.NONE
                    this.cur_dest = 0
                }
            }
        } else {
            this.lift_direction = FloorLiftStatus.NONE
            this.cur_dest = 0
        }
    }
    checkPassingFloor(): boolean {
        return this.pending_queue.indexOf(this.cur_floor) !== -1
    }
    async lift() {
        if (this.lift_direction !== FloorLiftStatus.UP && this.lift_direction !== FloorLiftStatus.DOWN) {
            return
        }
        this.floor_display.updateIcon(this.lift_direction)
        this.is_lifting = true
        lift_loop: do {
            switch (this.lift_direction) {
                case FloorLiftStatus.UP:
                    this.cur_floor = Math.min(this.cur_floor + 1 === 0 ? 1 : this.cur_floor + 1, this.max_floor)
                    break
                case FloorLiftStatus.DOWN:
                    this.cur_floor = Math.max(this.cur_floor - 1 === 0 ? -1 : this.cur_floor - 1, this.min_floor)
                    break
                default:
                    break lift_loop
            }
            this.floor_display.updateNumber(this.cur_floor)
            if (this.cur_floor === this.cur_dest) {
                break
            }
            if (this.cur_floor >= this.max_floor || this.cur_floor <= this.min_floor) {
                break
            }
            await sleep(this.lift_interval)
        } while (!this.checkPassingFloor())
        this.pending_queue.remove(this.cur_floor)
        removeElementClass(qs(`.number-button[index="${this.cur_floor}"]`), 'button-selected')
        this.is_lifting = false
        this.floor_display.updateIcon(FloorLiftStatus.NONE)
    }
    checkBeforeLift() {
        this.pending_queue.remove(this.cur_floor)
        this.calcLiftDirection()
        if (this.isLiftable()) {
            this.lift()
        }
    }
    createFloorButtons() {
        this.floor_buttons = []
        for (let i = this.max_floor - 1; i >= 1; i -= 2) { // on ground
            this.floor_buttons.push([
                new FloorButton(i, i.toString(), true),
                new FloorButton(
                    i + 1,
                    (i + 1) === this.max_floor ? '∞' : (i + 1).toString(),
                    (i + 1) !== this.max_floor
                )
            ])
        }
        for (let i = -2; i >= this.min_floor; i -= 2) { // under ground
            this.floor_buttons.push([
                new FloorButton(i + 1, (i + 1).toString(), true),
                new FloorButton(
                    i,
                    i === this.min_floor ? '-∞' : i.toString(),
                    i !== this.min_floor
                )
            ])
        }
    }
    renderFloorButtons() {
        const func_button_row = qs('#func-buttons')
        const button_container = qs('#floor-buttons')
        for (let child of Array.from(button_container.children)) {
            if (child.id !== 'func-buttons') {
                button_container.removeChild(child)
            }
        }
        this.floor_buttons.forEach(button_row => {
            let row = document.createElement('div')
            row.classList.add('button-row')
            for (let button of button_row) {
                // if (!button.is_available) {
                //     continue
                // }
                let col = document.createElement('div')
                col.classList.add('button-col', 'unselectable', 'number-button')
                if (!button.is_available) {
                    col.classList.add('invisible')
                }
                col.textContent = button.text
                col.setAttribute('index', button.index.toString())
                row.appendChild(col)
            }
            button_container.insertBefore(row, func_button_row)
        })
    }
    serializate(): string {
        return EncryptTool.encrypt(`{"signatures":${game_signature_list.toString()},"tasks":${game_task_list.toString()},"floors":${game_floor_list.toString()},"game":${this.toString()}}`)
    }
    deserializate(encrypted: string): boolean {
        let is_catch = false
        try {
            const json_data = <SaveDataJSON>JSON.parse(EncryptTool.decipher(encrypted))
            // console.log(json_data)
            for (let signature_json of json_data.signatures) {
                const signature = game_signature_list.getById(signature_json.id)
                if (signature !== null) {
                    signature.status = Signature.convertStatus(signature_json.status)
                }
            }
            for (let task_json of json_data.tasks) {
                const task = game_task_list.getById(task_json.id)
                if (task !== null) {
                    task.status = GameTask.convertStatus(task_json.status)
                }
            }
            for (let floor_json of json_data.floors) {
                const floor = game_floor_list.getById(floor_json.id)
                if (floor === null) {
                    continue
                }
                if (floor.dialog_scene.id !== floor_json.dialog_scene.id) {
                    continue
                }
                floor.dialog_scene.setCurDialogBlock(floor_json.dialog_scene.cur_block_id)
                floor.dialog_scene.visited_blocks = floor_json.dialog_scene.visited_blocks
                for (let block_json of floor_json.dialog_scene.dialog_blocks) {
                    const block = floor.dialog_scene.getDialogBlock(block_json.id)
                    if (block === null) {
                        continue
                    }
                    block.cur_item_index = block_json.cur_item_index
                }
            }
            this.lang = json_data.game.lang
            for (let rows of this.floor_buttons) {
                for (let number_button of rows) {
                    let position = json_data.game.floor_buttons.map(x => x.index).indexOf(number_button.index)
                    if (position === -1) {
                        continue
                    }
                    number_button.is_available = json_data.game.floor_buttons[position].is_available
                    const num_btn = qs(`.number-button[index="${number_button.index}"]`)
                    if (num_btn === null) {
                        continue
                    }
                    if (number_button.is_available) {
                        num_btn.classList.remove('invisible')
                    }
                }
            }
            this.cur_floor = json_data.game.cur_floor
            this.is_lifting = false
            this.lift_direction = FloorLiftStatus.NONE
            this.cur_dest = 0
            this.pending_queue.clear()
            qsa('.number-button').forEach(button => { button.classList.remove('button-selected') })
            this.floor_display.updateNumber(this.cur_floor)
            this.passenger_display.reset(json_data.game.passenger_display)
            this.task_display.reset(json_data.game.task_display)

            this.language_display.set(this.lang)
            this.switchUiLanguge()
            this.passenger_display.render(this.lang)
            this.task_display.render(this.lang)
        }
        catch (err) {
            is_catch = true
            console.log(`Deserialization error: ${(err as Error).message}`)
        }
        if (!is_catch) {
            if (this.door.is_open) {
                this.door.syncStart(DoorDir.CLOSE)
            }
            Game.hideGoOnButton()
            Game.hideOptions()
            clearChildren(qs('#dialog-container') as HTMLElement)
        }
        return !is_catch
    }
    switchUiLanguge() {
        for (let e of qsa('.l10n-text-ui')) {
            e.textContent = this.ui_string[e.getAttribute('lkey')!].get(this.lang)
        }
    }
    switchTextLanguage() {
        // avatar
        for (let e of qsa('.avatar>div[lkey]')) {
            e.innerHTML = game_passenger_list.getById(e.getAttribute('lkey') ?? '')?.avatar_text.get(game.lang) ?? ''
        }
        // dialog
        for (let e of qsa('.dialog-box[lkey]')) {
            const dlg_id = e.getAttribute('lkey') ?? ''
            const [_, dbk_num] = Dialog.splitId(dlg_id)
            e.innerHTML =
                (game.getCurrentFloor()?.
                    dialog_scene.getDialogBlock(`${dbk_num}_dbk`)?.
                    getItemById(dlg_id) as Dialog)?.text.get(game.lang) ?? ''
        }
        // option
        for (let e of qsa('.option-button>div[lkey]')) {
            const opt_id = e.getAttribute('lkey') ?? ''
            const [_, slt_num] = SelectOption.splitId(opt_id)
            e.innerHTML =
                (game.getCurrentFloor()?.
                    dialog_scene.getCurDialogBlock()?.
                    getItemById(`${slt_num}_slt`) as BranchSelect)?.
                    getOptionById(opt_id)?.text.get(game.lang) ?? ''
        }
        // passenger
        this.passenger_display.render(this.lang)
        // task
        this.task_display.render(this.lang)
    }
    isFloorButtonAvailableByIndex(index: number): boolean {
        const flatten_arr = flattenNestArray(this.floor_buttons)
        const find_index = flatten_arr.map(x => x.index).indexOf(index)
        if (find_index === -1) {
            return false
        }
        return flatten_arr[find_index].is_available
    }
    initialize() {
        this.createFloorButtons()
        this.renderFloorButtons()
        this.language_display.set(this.lang)
        this.switchUiLanguge()
        this.floor_display.updateNumber(this.cur_floor)
        this.passenger_display.add(game_passenger_me)
        this.passenger_display.render(this.lang)
        this.dots_animation.start()
    }
    async debug() {
        qs('#open-button').click()
        qs('#top-arch').click()
        qs('#go-on-button-row').click()
        // Game.disableFloorButtons()
        // Game.disableSaveButtons()
        // FloorDisplay.startRandomDisplay()
        // setTimeout(() => {
        //     FloorDisplay.stopRandomDisplay()
        // }, 2500)
        // this.renderFloor()
        // this.door.syncStart(DoorDir.OPEN);
        // this.save_panel.syncStart('open')
        // qs('.number-button[index="5"]').click()
        // Game.hideGoOnButton()
        // qs('#options-row').style.display = 'none';
        // (qs('#save-text-area') as HTMLTextAreaElement).value = ''
    }
    toString(): string {
        return `{"lang":"${this.lang}","cur_floor": ${this.cur_floor},"floor_buttons": [${flattenNestArray(this.floor_buttons).filter(x => x.index === this.max_floor || x.index === this.min_floor).map(x => `{"index":${x.index},"is_available":${x.is_available}}`).join(',')}],"passenger_display":${this.passenger_display.toString()},"task_display":${this.task_display.toString()}}`
    }
}

/**
 * @param selector - string
 * @param is_single - boolean
 * @param func - Function((this: HTMLElement, event: MouseEvent) => void)
 */
interface BindingButton {
    selector: string
    is_single: boolean
    func: (this: HTMLElement, event: MouseEvent) => void
}

async function clickSwitchLangButton(dir: LangBtnDir) {
    if (!game.language_display.is_moving) {
        await game.language_display.start(dir)
        game.lang = game.language_display.get()
        game.switchUiLanguge()
        game.switchTextLanguage()
    }
}

const binding_buttons: BindingButton[] = [
    {
        selector: '.number-button',
        is_single: false,
        func: (event) => {
            const class_name = 'button-selected'
            const index = parseInt((event.target as HTMLElement).getAttribute('index')!)
            if (!game.isFloorButtonAvailableByIndex(index)) {
                return
            }
            if (!game.is_lifting && index === game.cur_floor) {
                return
            }
            if ((event.target as HTMLElement).classList.contains(class_name)) {
                (event.target as HTMLElement).classList.remove(class_name)
                game.pending_queue.remove(index)
                if (index === game.getCurDestination()) {
                    game.calcLiftDirection()
                }
            } else {
                (event.target as HTMLElement).classList.add(class_name)
                game.pending_queue.add(index)
            }
            if (!game.is_lifting && !game.door.is_open) {
                game.checkBeforeLift()
            }
        }
    },
    {
        selector: '#close-button',
        is_single: true,
        func: async () => {
            if (!game.is_lifting &&
                game.door.is_open &&
                !game.door.is_moving) {
                await game.door.start(DoorDir.CLOSE)
                game.checkBeforeLift()
            }
        }
    },
    {
        selector: '#open-button',
        is_single: true,
        func: async () => {
            if (!game.is_lifting &&
                !game.door.is_open &&
                !game.door.is_moving) {
                game.renderFloor()
                await game.door.start(DoorDir.OPEN)
            }
        }
    },
    {
        selector: '#top-arch',
        is_single: true,
        func: async () => {
            if (!game.save_panel.is_moving) {
                if (game.save_panel.is_open) {
                    game.save_panel.start(SavePanelDir.CLOSE)
                } else {
                    game.save_panel.start(SavePanelDir.OPEN)
                }
            }
        }
    },
    {
        selector: '#save-export-button-wrap',
        is_single: true,
        func: () => {
            clearChildren(qs('#save-export-button'))
            clearChildren(qs('#save-import-button'))
            // const res = <SaveRootJSON>JSON.parse(game.serializate())
            // qs('#save-export-button').appendChild(Game.getTFIcon(res.status));
            // if (res.status) {
            //     (qs('#save-text-area') as HTMLTextAreaElement).value = JSON.stringify(res.data)
            // }
            let is_catch = false
            try {
                (qs('#save-text-area') as HTMLTextAreaElement).value = game.serializate()
            } catch (err) {
                is_catch = true
                console.log(`Serialization error: ${(err as Error).message}`)
            }
            qs('#save-export-button').appendChild(Game.getTFIcon(!is_catch));
        }
    },
    {
        selector: '#save-import-button-wrap',
        is_single: true,
        func: () => {
            clearChildren(qs('#save-export-button'))
            clearChildren(qs('#save-import-button'))
            const text = (qs('#save-text-area') as HTMLTextAreaElement).value
            qs('#save-import-button').appendChild(Game.getTFIcon(game.deserializate(text)))
        }
    },
    {
        selector: '#save-copy-button',
        is_single: true,
        func: async () => {
            await navigator.clipboard.writeText((qs('#save-text-area') as HTMLTextAreaElement).value)
        }
    },
    {
        selector: '#lang-switch-button-l',
        is_single: true,
        func: async () => {
            await clickSwitchLangButton(LangBtnDir.LEFT)
        }

    },
    {
        selector: '#lang-switch-button-r',
        is_single: true,
        func: async () => {
            await clickSwitchLangButton(LangBtnDir.RIGHT)
        }

    },
    {
        selector: '#go-on-button-row',
        is_single: true,
        func: () => {
            const block = game.getCurrentFloor()?.dialog_scene.getCurDialogBlock()
            if (!block) {
                return
            }
            Game.stepDialog(block, game.lang)
            const cur_floor = game.getCurrentFloor()
            if (cur_floor !== null) {
                Game.checkWhenBlockFinish(cur_floor, block)
            }
            // if (block.isFinished() && block.isLastItemNotSelect()) {
            //     Game.hideOptions()
            //     const cur_floor = game.getCurrentFloor()
            //     if (cur_floor !== null) {
            //         if (cur_floor.checkPlotThreads()) {
            //             Game.showGoOnButton()
            //         } else {
            //             Game.hideGoOnButton()
            //         }
            //         if (block.id !== cur_floor.dialog_scene.cur_block_id) {
            //             cur_floor.dialog_scene.addVisitedBlock(block.id)
            //         }
            //     }
            // }
            Game.jumpToBottom()
        }
    },
    {
        selector: '#jump-button',
        is_single: true,
        func: () => {
            Game.jumpToBottom()
            Game.hideJumpButton()
        }
    }
]

function bindButtonFunctions() {
    for (let bind of binding_buttons) {
        if (bind.is_single) {
            qs(bind.selector).addEventListener('click', bind.func)
        } else {
            for (let button of Array.from(qsa(bind.selector))) {
                button.addEventListener('click', bind.func)
            }
        }
    }
}

function addDialogScrollListener() {
    const dialog_container = qs('#dialog-container')
    dialog_container.addEventListener('scroll', () => {
        // console.log(dialog_container.scrollTop, dialog_container.offsetHeight, dialog_container.scrollHeight)
        if (dialog_container.scrollTop + dialog_container.offsetHeight <= dialog_container.scrollHeight - dialog_container.offsetHeight / 2) {
            Game.showJumpButton()
        } else {
            Game.hideJumpButton()
        }
    })
}

// main
document.addEventListener('DOMContentLoaded', () => {
    game.initialize()
    bindButtonFunctions()
    addDialogScrollListener()
    game.debug()
})

const game_lang_list = new LanguageList([
    { id: 'zh_cn', name: '中文' },
    { id: 'en', name: 'EN' }
])
const game_default_lang = 'zh_cn'
const game_task_list = new GameTaskList([
    {
        id: 'skate_tsk',
        description: { zh_cn: '霜杰想向朋友借一块滑板。', en: 'Jacob wants to borrow a skateboard from his friend.' },
    }
])
const game_action_list = new GameActionList([
    {
        id: 'naked1_act',
        action: GameAction.polyActs(
            GameAction.genActiveTaskAct('skate_tsk'),
            GameAction.genAddPassengerAct('jacob_psg'),
            GameAction.genActivateSignatureAct('naked.meet_sig'),
            GameAction.genStepPlotThredAct('naked_plt')
        )
    },
    {
        id: 'naked2#1_act',
        action: GameAction.polyActs(
            GameAction.genRemovePassengerAct('jacob_psg')
        )
    },
    {
        id: 'naked2#2_act',
        action: GameAction.polyActs(
            GameAction.genActivateSignatureAct('naked.call_sig'),
            GameAction.genStepPlotThredAct('naked_plt')
        )
    },
    {
        id: 'naked3.1_act',
        action: GameAction.polyActs(
            GameAction.genAddPassengerAct('jacon_psg'),
            GameAction.genActivateSignatureAct('naked.mask_sig'),
            GameAction.genStepPlotThredAct('naked_plt')
        )
    },
    {
        id: 'naked3.2_act',
        action: GameAction.polyActs(
            GameAction.genFinishTaskAct('skate_tsk')
        )
    },
    {
        id: 'peach.start_act',
        action: GameAction.polyActs(
            Game.disableFloorButtons,
            Game.disableSaveButtons,
            FloorDisplay.startRandomDisplay,
            () => { qs('#background')?.classList.add('color-flash') }
        )
    },
    {
        id: 'peach.stop_act',
        action: GameAction.polyActs(
            Game.enableFloorButtons,
            Game.enableSaveButtons,
            FloorDisplay.stopRandomDisplay,
            () => { qs('#background')?.classList.remove('color-flash') }
        )
    },
    {
        id: 'peach.finish_act',
        action: GameAction.polyActs(
            GameAction.genStepPlotThredAct('peach_plt')
        )
    }
])
const game_signature_list = new SignatureList([
    { id: 'naked.enter_sig', status: SignatureStatus.ACTIVE },
    { id: 'naked.meet_sig' },
    { id: 'naked.call_sig' },
    { id: 'naked.mask_sig' },
    { id: 'naked.berserk_sig' },
    { id: 'naked.kill_sig' },
    { id: 'peach_sig', status: SignatureStatus.ACTIVE }
])
const game_plot_thread_list = new PlotThreadList([
    {
        id: 'naked_plt',
        priority: 1001,
        signature_floor_list: [
            { signature: 'naked.enter_sig', floor: '1_flr' },
            { signature: 'naked.meet_sig', floor: '3_flr' },
            { signature: 'naked.call_sig', floor: '1_flr' },
            { signature: 'naked.mask_sig', floor: '3_flr' },
            { signature: 'naked.berserk_sig', floor: '1_flr' },
            { signature: 'naked.kill_sig', floor: '3_flr' },
        ],
        in_signatures: []
    },
    {
        id: 'peach_plt',
        priority: 101,
        signature_floor_list: [
            { signature: 'peach_sig', floor: '2_flr' }
        ],
        in_signatures: []
    }
])
const game_passenger_list = new PassengerList([
    {
        id: 'me_psg',
        name: { zh_cn: '我', en: 'Me' },
        avatar_color: '#1F4690',
        avatar_font_color: 'white',
        avatar_text: { zh_cn: '我', en: 'ME' },
    },
    {
        id: 'jacob_psg',
        name: { zh_cn: '邓霜杰', en: 'Jacob Derek' },
        avatar_color: '#80558C',
        avatar_font_color: 'white',
        avatar_text: { zh_cn: '杰', en: 'JD' },
    },
    {
        id: 'woman_psg',
        name: { zh_cn: '无名女子', en: 'Unkown Woman' },
        avatar_color: '#FCE2DB',
        avatar_font_color: '#B270A2',
        avatar_text: { zh_cn: '女', en: 'UK' },
    },
    {
        id: 'peach_psg',
        name: { zh_cn: '桃乐乐', en: 'Happy Peach' },
        avatar_color: '#BAFFB4',
        avatar_font_color: '#FF6363',
        avatar_text: { zh_cn: '桃', en: 'HP' }
    },
    {
        id: 'mike_psg',
        name: { zh_cn: '罗迈', en: 'Mike Robert' },
        avatar_color: 'white',
        avatar_font_color: 'black',
        avatar_text: { zh_cn: '罗', en: 'MR' }
    }
])
const game_passenger_me = 'me_psg'
const bg_colors: { [name: string]: string } = {
    f1: '#343434',
    f2: '#2D2424',
    f3: '#393232'
}
const game_floor_list = new FloorList([
    {
        id: '1_flr',
        plot_id_list: ['naked_plt'],
        background: {
            bg_color: bg_colors['f1'],
            inner_html: ''
        },
        dialog_scene: {
            id: '1_dsc',
            blocks: [
                {
                    id: 'naked1_dbk',
                    in_signatures: ['naked.enter_sig'],
                    dialogs: [
                        {
                            person_id: 'me_psg',
                            text: { zh_cn: '总觉得', en: 'i always think that' },
                            layout: DialogLayout.RIGHT
                        },
                        {
                            person_id: 'me_psg',
                            text: { zh_cn: '万事开头难呢', en: 'taking your first step is the hardest part' },
                            layout: DialogLayout.RIGHT
                        },
                        {
                            person_id: 'jacob_psg',
                            text: { zh_cn: '直巴', en: 'straight' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'jacob_psg',
                            text: { zh_cn: '七<br/>七<br/>七<br/>七<br/>七<br/>七<br/>七<br/>', en: '7<br/>7<br/>7<br/>7<br/>7<br/>7<br/>7<br/>' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'me_psg',
                            text: { zh_cn: '我去', en: 'ong' },
                            layout: DialogLayout.RIGHT
                        },
                        {
                            person_id: 'me_psg',
                            text: { zh_cn: '什么动静', en: 'wat happened' },
                            layout: DialogLayout.RIGHT
                        },
                        {
                            person_id: 'jacob_psg',
                            text: { zh_cn: '在游戏里练枪练累了', en: 'tired of practicing my shooting skill in game' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'jacob_psg',
                            text: { zh_cn: '去滑板公园玩玩', en: 'wanna go to skateboard park' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'me_psg',
                            text: { zh_cn: '滑板小鸟啊', en: 'skatebird' },
                            layout: DialogLayout.RIGHT
                        },
                        {
                            person_id: 'me_psg',
                            text: { zh_cn: '试过手指滑板吗？', en: 'have you tried the fingerboard?' },
                            layout: DialogLayout.RIGHT
                        },
                        {
                            person_id: 'jacob_psg',
                            text: { zh_cn: '手指滑板牛的', en: 'fingerboard meta' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'jacob_psg',
                            text: { zh_cn: '我兜里就有一个', en: 'there is one in my pocket' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: '&_psg',
                            text: { zh_cn: '说着他从兜里掏出来一块手指滑板，其外形精致小巧', en: 'He took out a fingerboard from his pocket, which was small and exquisite' },
                            layout: DialogLayout.MIDDLE
                        },
                        {
                            person_id: '&_psg',
                            text: { zh_cn: '然后他匍匐在地面上，将中指和无名指立在手指滑板上', en: 'Then he crawled on the floor and placed his middle finger and ring finger on the fingerboard' },
                            layout: DialogLayout.MIDDLE
                        },
                        {
                            person_id: '&_psg',
                            text: { zh_cn: '在几次尝试后完成了一次漂亮的板翻', en: 'After several attempts he finally succeeded to make a perfect flip' },
                            layout: DialogLayout.MIDDLE
                        },
                        {
                            person_id: 'me_psg',
                            text: { zh_cn: '我去，厉害', en: 'ong super meta' },
                            layout: DialogLayout.RIGHT
                        },
                        {
                            person_id: 'me_psg',
                            text: { zh_cn: '滑板大师', en: 'very pro' },
                            layout: DialogLayout.RIGHT
                        },
                        {
                            person_id: 'jacob_psg',
                            text: { zh_cn: '对了', en: 'btw' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'jacob_psg',
                            text: { zh_cn: '我叫霜杰', en: 'you can call me Jacob' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'me_psg',
                            text: { zh_cn: '你好啊小杰', en: 'hello Jacob' },
                            layout: DialogLayout.RIGHT
                        },
                        {
                            person_id: 'me_psg',
                            text: { zh_cn: '祝你滑得开心', en: 'have fun with skateboard' },
                            layout: DialogLayout.RIGHT
                        },
                        {
                            person_id: 'jacob_psg',
                            text: { zh_cn: '呃', en: 'uh' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'jacob_psg',
                            text: { zh_cn: '其实我的滑板坏了，笑死', en: 'in fact my skateboard was broken lol' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'me_psg',
                            text: { zh_cn: '那咋办', en: 'what\'s your plan' },
                            layout: DialogLayout.RIGHT
                        },
                        {
                            person_id: 'jacob_psg',
                            text: { zh_cn: '我打算想向朋友借滑板一用', en: 'im gonna borrow a skateboard from my fren' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'jacob_psg',
                            text: { zh_cn: '朋友家就在三楼', en: 'his room is on the 3rd floor' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'me_psg',
                            text: { zh_cn: '好呢', en: 'cool' },
                            layout: DialogLayout.RIGHT
                        },
                        {
                            person_id: 'me_psg',
                            text: { zh_cn: '走走走', en: 'gogogo' },
                            layout: DialogLayout.RIGHT
                        },
                        {
                            person_id: 'jacob_psg',
                            text: { zh_cn: '来哩', en: 'hop on' },
                            layout: DialogLayout.LEFT,
                            action_id: 'naked1_act'
                        }
                    ]
                },
                {
                    id: 'naked3_dbk',
                    in_signatures: ['naked.call_sig'],
                    dialogs: [
                        {
                            person_id: 'me_psg',
                            text: { zh_cn: '', en: '' },
                            layout: DialogLayout.RIGHT

                        }
                    ],
                    select: {
                        options: [
                            {
                                next: 'naked3.1_dbk',
                                text: { zh_cn: '去吧', en: 'Go to check again' }
                            },
                            {
                                next: 'naked3.2_dbk',
                                text: { zh_cn: '别去了', en: 'Don\'t go' }
                            },
                        ]
                    }
                },
                {
                    id: 'naked3.1_dbk',
                    in_signatures: [],
                    dialogs: [
                        {
                            person_id: 'me_psg',
                            text: { zh_cn: '', en: '' },
                            layout: DialogLayout.RIGHT

                        }
                    ]
                },
                {
                    id: 'naked3.2_dbk',
                    in_signatures: [],
                    dialogs: [
                        {
                            person_id: 'me_psg',
                            text: { zh_cn: '', en: '' },
                            layout: DialogLayout.RIGHT

                        }
                    ]
                }
            ]
        }
    },
    {
        id: '2_flr',
        plot_id_list: ['peach_plt'],
        background: {
            bg_color: bg_colors['f2'],
            inner_html: ''
        },
        dialog_scene: {
            id: '2_dsc',
            blocks: [
                {
                    id: 'peach_dbk',
                    in_signatures: ['peach_sig'],
                    dialogs: [
                        {
                            person_id: '&_psg',
                            text: { zh_cn: '在电梯门打开后，你看到了一位身材矮小的小女孩', en: 'After the elevator door opened, you saw a little girl' },
                            layout: DialogLayout.MIDDLE
                        },
                        {
                            person_id: '&_psg',
                            text: { zh_cn: '这个小女孩有着粉色的头发，而且身着粉色的连衣裙，头上还戴着浅绿色的猫耳', en: 'This little girl had pink hair, and she was wearing a pink dress and light green cat ears on her head' },
                            layout: DialogLayout.MIDDLE
                        },
                        {
                            person_id: '&_psg',
                            text: { zh_cn: '小女孩正看着你，不知道她有何打算', en: 'The little girl was looking at you, nobody knew what she was going to do' },
                            layout: DialogLayout.MIDDLE
                        },
                        {
                            person_id: 'peach_psg',
                            text: { zh_cn: '七七', en: 'chi chi' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'me_psg',
                            text: { zh_cn: '什么？', en: 'what?' },
                            layout: DialogLayout.RIGHT
                        },
                        {
                            person_id: 'peach_psg',
                            text: { zh_cn: '七七七莫七莫', en: 'chi chi chi mo chi mo' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'me_psg',
                            text: { zh_cn: '什么歌儿？', en: 'what song?' },
                            layout: DialogLayout.RIGHT
                        },
                        {
                            person_id: 'peach_psg',
                            text: { zh_cn: '米七诺七莫西', en: 'mi chi no chi mo shi' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: '&_psg',
                            text: { zh_cn: '在小女孩唱出第一句歌词后，你发觉电梯轿厢里的重力减弱了', en: 'After the little girl sang the first lyrics, you found that the gravity in the elevator was reduced' },
                            layout: DialogLayout.MIDDLE,
                            action_id: 'peach.start_act'
                        },
                        {
                            person_id: '&_psg',
                            text: { zh_cn: '楼层显示板上的数值开始浮动，而且所有按钮都失效了', en: 'The floor display panel began to show random numbers, and all the buttons didn\'t work anymore' },
                            layout: DialogLayout.MIDDLE
                        },
                        {
                            person_id: '&_psg',
                            text: { zh_cn: '然后你发现在电梯的镜子里，也有一个镜像猫耳小女孩在疯狂地跳舞', en: 'Then you found that in the mirror of the elevator, there was another little girl dancing crazily' },
                            layout: DialogLayout.MIDDLE
                        },
                        {
                            person_id: 'me_psg',
                            text: { zh_cn: '我去……', en: 'ong...' },
                            layout: DialogLayout.RIGHT
                        },
                        {
                            person_id: 'peach_psg',
                            text: { zh_cn: '七七七莫七莫', en: 'chi chi chi mo chi mo' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: '&_psg',
                            text: { zh_cn: '只见小女孩边唱边跳，几束粉色的激光从她身上向外射出', en: 'The little girl sang and danced, and several pink lasers shot out from her' },
                            layout: DialogLayout.MIDDLE
                        },
                        {
                            person_id: '&_psg',
                            text: { zh_cn: '粉色激光充斥了整个电梯轿厢，一切都被浸润在粉色的闪烁之中', en: 'The pink lasers filled the whole elevator, and everything was soaked in the pink light' },
                            layout: DialogLayout.MIDDLE
                        },
                        {
                            person_id: '&_psg',
                            text: { zh_cn: '在被激光射中后，你的身体也开始起舞，如同脱缰的野马，一发不可收拾', en: 'After being shot by lasers, your body also started to dance, like a runaway wild horse, totally out of control' },
                            layout: DialogLayout.MIDDLE
                        },
                        {
                            person_id: 'peach_psg',
                            text: { zh_cn: '绯红文档好玩喵', en: 'Scarlet Documentation is a good game nya' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'peach_psg',
                            text: { zh_cn: '鼠蕾娜可爱喵', en: 'Ratrena is cute nya' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'me_psg',
                            text: { zh_cn: '我去……', en: 'ong...' },
                            layout: DialogLayout.RIGHT
                        },
                        {
                            person_id: 'peach_psg',
                            text: { zh_cn: '七七七莫七莫~', en: 'chi chi chi mo chi mo~' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: '&_psg',
                            text: { zh_cn: '小女孩歌声让整个电梯都在颤抖，而炫光更是强化了这一震感', en: 'The little girl\'s voice made the whole elevator tremble, and the pink lasers strengthened the the feeling of shock' },
                            layout: DialogLayout.MIDDLE
                        },
                        {
                            person_id: '&_psg',
                            text: { zh_cn: '你担心电梯会在某一时刻坠落，但你的舞步却重重地踏在电梯的地板上', en: 'You worried that the elevator would fall at a certain moment, but your dance steps were heavily on the floor of the elevator' },
                            layout: DialogLayout.MIDDLE
                        },
                        {
                            person_id: '&_psg',
                            text: { zh_cn: '小女孩越跳越起劲，节奏不断加快，你的舞蹈节奏也随之加快', en: 'The little girl danced harder and harder, and her rhythm kept accelerating, so did your dancing rhythm' },
                            layout: DialogLayout.MIDDLE
                        },
                        {
                            person_id: 'peach_psg',
                            text: { zh_cn: '喵呐~', en: 'nya na~' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'me_psg',
                            text: { zh_cn: '不要二次元……', en: 'no more anime...' },
                            layout: DialogLayout.RIGHT
                        },
                        {
                            person_id: '&_psg',
                            text: { zh_cn: '一切戛然而止', en: 'Everything suddenly stopped' },
                            layout: DialogLayout.MIDDLE,
                            action_id: 'peach.stop_act'
                        },
                        {
                            person_id: '&_psg',
                            text: { zh_cn: '歌声消失了，炫光消失了，舞蹈消失了，小女孩也消失了', en: 'The song disappeared, the pink light disappeared, the dance disappeared, and the little girl disappeared' },
                            layout: DialogLayout.MIDDLE
                        },
                        {
                            person_id: '&_psg',
                            text: { zh_cn: '电梯也回到了原来安全的样子，不再那么摇摇欲坠了', en: 'The elevator had also returned to the safe state and was no longer dangerous' },
                            layout: DialogLayout.MIDDLE
                        },
                        {
                            person_id: '&_psg',
                            text: { zh_cn: '只留下你一个人在原地迷茫', en: 'And you were thrown into confusion' },
                            layout: DialogLayout.MIDDLE
                        },
                        {
                            person_id: 'me_psg',
                            text: { zh_cn: '刚刚是什么动静……', en: 'what just happened...' },
                            layout: DialogLayout.RIGHT,
                            action_id: 'peach.finish_act'
                        }
                    ]
                }
            ]
        }
    },
    {
        id: '3_flr',
        plot_id_list: ['naked_plt'],
        background: {
            bg_color: bg_colors['f3'],
            inner_html: ''
        },
        dialog_scene: {
            id: '3_dsc',
            blocks: [
                {
                    id: 'naked2_dbk',
                    in_signatures: ['naked.meet_sig'],
                    dialogs: [
                        {
                            person_id: 'jacob_psg',
                            text: { zh_cn: '不知道朋友在不在家', en: 'idk whether my fren is at home or not' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'me_psg',
                            text: { zh_cn: '你没提前打招呼啊', en: 'didn\'t you tell him in advance' },
                            layout: DialogLayout.RIGHT
                        },
                        {
                            person_id: 'jacob_psg',
                            text: { zh_cn: '没有', en: 'nope' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'jacob_psg',
                            text: { zh_cn: '他一般都在家的', en: 'he is usually at home' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'jacob_psg',
                            text: { zh_cn: '我敲个门先', en: 'let me have a look' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: '&_psg',
                            text: { zh_cn: '霜杰走出电梯轿厢，然后径直地向前走去，在正对着电梯门的那扇门前停了下来', en: 'Jacob walked out of the elevator, then walked straight forward and stopped in front of the door facing the elevator' },
                            layout: DialogLayout.MIDDLE,
                            action_id: 'naked2#1_act'
                        },
                        {
                            person_id: '&_psg',
                            text: { zh_cn: '霜杰按下了门铃，在等了两分钟后有人打开了门', en: 'Jacob rang the doorbell, after two minutes someone opened the door' },
                            layout: DialogLayout.MIDDLE
                        },
                        {
                            person_id: 'jacob_psg',
                            text: { zh_cn: '嘿我就知道你在家', en: 'i know you are at home' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'woman_psg',
                            text: { zh_cn: '你好', en: 'hello' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'jacob_psg',
                            text: { zh_cn: '？？？', en: '???' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'jacob_psg',
                            text: { zh_cn: '你是谁', en: 'who are you' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: '&_psg',
                            text: { zh_cn: '打开门的是一位女士，霜杰似乎不认识她', en: 'it was a lady who opened the door, but it seemed that Jacob didn\'t know her' },
                            layout: DialogLayout.MIDDLE
                        },
                        {
                            person_id: '&_psg',
                            text: { zh_cn: '那位女士现在只把头探了出来', en: 'That lady only stretched out her head now' },
                            layout: DialogLayout.MIDDLE
                        },
                        {
                            person_id: 'woman_psg',
                            text: { zh_cn: '什么叫我是谁', en: 'wdym who am i' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'woman_psg',
                            text: { zh_cn: '我一直住在这里', en: 'i\' ve always lived here' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'jacob_psg',
                            text: { zh_cn: '我朋友呢？', en: 'where is my fren?' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'woman_psg',
                            text: { zh_cn: '哦，你是指……', en: 'oh, you mean...' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'woman_psg',
                            text: { zh_cn: '我刚刚吃的热狗？', en: 'the hotdog i just ate?' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'jacob_psg',
                            text: { zh_cn: '啥玩意？！', en: 'wtf?!' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: '&_psg',
                            text: { zh_cn: '那位女士把门完全打开，露出了一丝不挂的全身', en: 'That lady opened the door completely, and showed her naked body' },
                            layout: DialogLayout.MIDDLE
                        },
                        {
                            person_id: '&_psg',
                            text: { zh_cn: '霜杰惊恐地看着这一景象，然后用双手把自己的眼睛遮住', en: 'Jacob looked at this scene in horror, then covered his eyes with hands' },
                            layout: DialogLayout.MIDDLE
                        },
                        {
                            person_id: 'jacob_psg',
                            text: { zh_cn: '啊啊啊什么东西', en: 'ahhh what the hell' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'woman_psg',
                            text: { zh_cn: '我把你朋友吃了', en: 'i ate your friend' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'woman_psg',
                            text: { zh_cn: '加了许多辣酱', en: 'with a lot of chili sauce' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'woman_psg',
                            text: { zh_cn: '口感还是比较嫩的', en: 'but it tasted good' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'jacob_psg',
                            text: { zh_cn: '太怪了', en: 'too weird' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'woman_psg',
                            text: { zh_cn: '确实', en: 'fr' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'jacob_psg',
                            text: { zh_cn: '为什么要放很多辣酱？', en: 'why with too much hot sauce?' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'woman_psg',
                            text: { zh_cn: '呃，因为你朋友尝起来比较酸，人肉都这样', en: 'uh, because your friend tasted sour, human flesh is always like that' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'jacob_psg',
                            text: { zh_cn: '我怕辣，一提到辣的就浑身不自在', en: 'i\'m afraid of spicy food, and i will feel uncomfortable when someone mentions that' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'woman_psg',
                            text: { zh_cn: '遗憾', en: 'rip' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'jacob_psg',
                            text: { zh_cn: '我先溜了', en: 'i get to go first' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: '&_psg',
                            text: { zh_cn: '霜杰头也不回地跑向楼梯间，然后大步流星地下楼去了', en: 'Jacob ran to the stairwell without looking back, and went downstairs with great strides' },
                            layout: DialogLayout.MIDDLE
                        },
                        {
                            person_id: 'woman_psg',
                            text: { zh_cn: '没意思，这就跑了', en: 'so boring, he is just ruuning away' },
                            layout: DialogLayout.LEFT,
                            action_id: 'naked2#2_act'
                        }
                    ]
                }
            ]
        }
    }
])
const game_ui_string_raw: UiStringDictRaw = {
    'PERSON_NUM': { zh_cn: '人数', en: 'Persons' },
    'COPY': { zh_cn: '复制', en: 'COPY' },
    'IMPORT': { zh_cn: '导入', en: 'IMPORT' },
    'EXPORT': { zh_cn: '导出', en: 'EXPORT' },
    'JUMP_BUTTON': { zh_cn: '跳转至最新对话', en: 'Jump to present' }
}
const game = new Game()