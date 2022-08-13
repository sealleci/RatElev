function sleep(time: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, time)
    })
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
            (cur as Dialog).person_id === (pre as Dialog).person_id) {
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
                // if plot's current corresponding block is finished, step plot to next
                if (block.isFinished()) {
                    plot.step()
                    continue
                }
                // priority of [...signature of plot] is MAX([...plot.priority])
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
    private display_number: HTMLElement
    private up_icon: HTMLElement
    private down_icon: HTMLElement

    constructor() {
        this.display_number = {} as HTMLElement
        this.up_icon = {} as HTMLElement
        this.down_icon = {} as HTMLElement
    }
    /**
     * 
     * @param status 
     * string
     */
    updateIcon(status: FloorLiftStatus) {
        if (this.up_icon !== {} as HTMLElement) {
            this.up_icon = qs('#up-icon')
        }
        if (this.down_icon !== {} as HTMLElement) {
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
        if (this.display_number !== {} as HTMLElement) {
            this.display_number = qs('#display-number')
        }
        this.display_number.textContent = num.toString()
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
    public floor_buttons: FloorButton[][]
    public cur_floor: number
    public max_floor: number
    public min_floor: number
    public is_lifting: boolean
    private lift_interval: number
    private lift_direction: FloorLiftStatus
    public cur_dest: number
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
                Game.hideGoOnButton()
            }
        }
    }
    /**
     * 
     * @param block 
     * @param is_render_all - if true, will not render select; if false, render to `cur_item_index`
     */
    static renderBlock(block: DialogBlock, lang: string, is_render_all: boolean = true) {
        let pre_id = ''
        for (let i = 0; i < block.data.length; ++i) {
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
    }
    renderFloor() {
        Game.hideGoOnButton()
        Game.hideOptions()
        clearChildren(qs('#dialog-container') as HTMLElement)
        const floor = this.getCurrentFloor()
        if (floor === null) {
            return
        }
        floor.checkPlotThreads()
        const bg: HTMLElement = qs('#background')
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
            if (!game.is_lifting && index === game.cur_floor) {
                return
            }
            if ((event.target as HTMLElement).classList.contains(class_name)) {
                (event.target as HTMLElement).classList.remove(class_name)
                game.pending_queue.remove(index)
                if (index === game.cur_dest) {
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
        selector: '#save-export-button-warp',
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
        selector: '#save-import-button-warp',
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
            for (let button of Array.from(qsa(bind.selector)) as HTMLElement[]) {
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
const game_signature_list = new SignatureList([
    { id: 'I1_sig', status: SignatureStatus.ACTIVE },
    { id: 'I1.1_sig' },
    { id: 'I1.2_sig', status: SignatureStatus.ACTIVE }

])
const game_action_list = new GameActionList([
    {
        id: 'to2_act',
        action: GameAction.polyActs(
            GameAction.genActivateSignatureAct('I1.1_sig'),
            GameAction.genStepPlotThredAct('I1_plt'),
            GameAction.genFinishTaskAct('t1_tsk')
        )
    },
    {
        id: 't1_act',
        action: GameAction.genActiveTaskAct('t1_tsk')
    }
])
const game_task_list = new GameTaskList([
    {
        id: 't1_tsk',
        description: { zh_cn: '你好老鼠', en: 'hello world' },
    }
])
const game_plot_thread_list = new PlotThreadList([
    {
        id: 'I1_plt',
        priority: 10,
        signature_floor_list: [
            { signature: 'I1_sig', floor: '1_flr' },
            { signature: 'I1.1_sig', floor: '2_flr' },
            // { signature: 'I1.2_sig', floor: '1_flr' },
        ],
        in_signatures: []
    },
    {
        id: 'I2_plt',
        priority: 1,
        signature_floor_list: [
            { signature: 'I1.2_sig', floor: '1_flr' }
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
])
const game_passenger_me = 'me_psg'
const game_floor_list = new FloorList([
    {
        id: '1_flr',
        plot_id_list: ['I1_plt', 'I2_plt'],
        background: {
            bg_color: '#73A9AD',
            inner_html: ''
        },
        dialog_scene: {
            id: '1_dsc',
            blocks: [
                {
                    id: 'A01_dbk',
                    in_signatures: ['I1_sig'],
                    dialogs: [
                        {
                            person_id: 'me_psg',
                            text: { zh_cn: '老鼠老鼠', en: 'rat rat' },
                            layout: DialogLayout.RIGHT,
                            action_id: 't1_act'

                        },
                        {
                            person_id: 'me_psg',
                            text: { zh_cn: '老鼠在哪里', en: 'where the rat is' },
                            layout: DialogLayout.RIGHT,
                        },
                        {
                            person_id: 'me_psg',
                            text: { zh_cn: '我去', en: 'ong' },
                            layout: DialogLayout.RIGHT
                        },
                        {
                            person_id: 'me_psg',
                            text: { zh_cn: '这素在', en: 'wat is that' },
                            layout: DialogLayout.RIGHT
                        },
                    ],
                    select: {
                        options: [
                            {
                                next: 'A02_dbk',
                                text: { zh_cn: '我是0', en: 'im bottom' }
                            },
                            {
                                next: 'A02_dbk',
                                text: { zh_cn: '我是1', en: 'im top' }
                            }
                        ]
                    }
                },
                {
                    id: 'A02_dbk',
                    in_signatures: [],
                    dialogs: [
                        {
                            person_id: 'jacob_psg',
                            text: { zh_cn: '不要南通', en: 'no homo' },
                            layout: DialogLayout.LEFT,
                            action_id: 'to2_act'
                        }
                    ],
                },
                {
                    id: 'A04_dbk',
                    in_signatures: ['I1.2_sig'],
                    dialogs: [
                        {
                            person_id: 'me_psg',
                            text: { zh_cn: '紧随其后', en: 'following' },
                            layout: DialogLayout.MIDDLE
                        }
                    ],
                }
            ]
        }
    },
    {
        id: '2_flr',
        plot_id_list: ['I1_plt'],
        dialog_scene: {
            id: '2_dsc',
            blocks: [
                {
                    id: 'A03_dbk',
                    in_signatures: ['I1.1_sig'],
                    dialogs: [
                        {
                            person_id: 'me_psg',
                            text: { zh_cn: '测试', en: 'test' },
                            layout: DialogLayout.MIDDLE
                        },
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