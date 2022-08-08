/* TODO: main
 * - [ ] save function
 */

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
        return id in this.data.map(value => value.id)
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
        return `{}`
    }
}

enum SignatureStatus {
    DEACTIVE = 'deactive',
    ACTIVE = 'active'
}

class Signature {
    /**
     * regex: /\d+_sig/
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
        return `{}`
    }
}

/**
 * @param id - string(/\d+_sig/)
 * @param status - SignatureStatus
 */
interface SignatureObject {
    /**
     * regex: /\d+_sig/
     */
    id: string
    status: SignatureStatus
}

class SignatureList extends AbstractList<Signature>{
    constructor(signatures: SignatureObject[]) {
        super()
        for (let signature of signatures) {
            this.data.push(new Signature(
                signature.id,
                signature.status
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

class GameTask {
    /**
     * regex: /\d+_tsk/
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
}

/**
 * @param id - string(/\d+_tsk/)
 * @param description - L10nTextDict
 * @param status - Optional(TaskStatus)
 */
interface GameTaskObject {
    /**
     * regex: /\d+_tsk/
     */
    id: string
    description: L10nTextDict
    status?: TaskStatus
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
}

class GameAction {
    /**
     * regex: /\d+_act/
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
    toString(): string {
        return `{}`
    }
}

/**
 * @param id - string(/\d+_act/)
 * @param action - Function(() => void)
 */
interface GameActionObject {
    /**
     * regex: /\d+_act/
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
     * regex: /\d+_psg/
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
    toString(): string {
        return `{}`
    }
}

/**
 * @param id - string(/\d+_psg/)
 * @param name - L10nTextDict
 * @param avatar_color - string
 * @param avatar_font_color - string
 * @param avatar_text - L10nTextDict
 * @param is_display - Optional(boolean)
 */
interface PassengerObject {
    /**
     * regex: /\d+_psg/
     */
    id: string,
    name: L10nTextDict,
    avatar_color: string,
    avatar_font_color: string,
    avatar_text: L10nTextDict,
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
     * regex: /\d+_dlg|\d+_slt/
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
     * regex: /\d+_\d+_opt/
     */
    public id: string
    /**
     * regex: /\d+_dlg/
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
     * regex: /\d+_dlg/
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
     * regex: /\d+_psg/
     */
    public person_id: string
    public text: L10nText
    public layout: DialogLayout
    public is_having_action: boolean
    /**
     * regex: /\d+_act/
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
 * @param person_id - string(/\d+_psg/)
 * @param text - L10nTextDict
 * @param layout - DialogLayout
 * @param action_id - Optional(string)
 */
interface DialogObject {
    /**
     * regex: /\d+_psg/
     */
    person_id: string,
    text: L10nTextDict,
    layout: DialogLayout,
    /**
     * regex: /\d+_act/
     */
    action_id?: string
}

/**
 * @param options - OptionObject[]
 */
interface SelectObject {
    options: OptionObject[]
}

class DialogBlock {
    /**
     * regex: /\d+_dbk/
     */
    public id: string
    public cur_item_index: number
    public data: DialogBlockItem[]

    constructor(id: string, dialogs: DialogObject[], select: SelectObject | null = null) {
        this.id = id
        this.cur_item_index = 0
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
    toString(): string {
        return `{}`
    }
}

/**
 * @param id - string(/\d+_dbk/)
 * @param dialogs - DialogObject[]
 * @param select - Optional(SelectObject)
 */
interface DialogBlockObject {
    /**
     * regex: /\d+_dbk/
     */
    id: string,
    dialogs: DialogObject[],
    select?: SelectObject
}

class DialogScene {
    /**
     * regex: /\d+_dsc/
     */
    public id: string
    public dialog_blocks: DialogBlock[]
    public cur_block_id: string
    public visited_blocks: string[]

    constructor(id: string, blocks: DialogBlockObject[]) {
        this.id = id
        this.dialog_blocks = []
        for (let i = 0; i < blocks.length; ++i) {
            this.dialog_blocks.push(
                new DialogBlock(
                    blocks[i].id,
                    blocks[i].dialogs,
                    blocks[i].select ?? null
                )
            )
        }
        // TODO: init cur block id
        this.cur_block_id = this.dialog_blocks[0].id
        this.visited_blocks = []
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
        return `{}`
    }
}

/**
 * @param id - string(/\d+dsc/)
 * @param blocks - DialogBlockObject[]
 */
interface DialogSceneObject {
    /**
     * regex: /\d+_dsc/
     */
    id: string,
    blocks: DialogBlockObject[]
}

/**
 * @param bg_color - string
 * @param bg_color - string
 */
interface Background {
    bg_color: string,
    inner_html: string
}

class Floor {
    /**
     * regex: /\d+_flr/
     */
    public id: string
    public dialog_scene: DialogScene
    public plot_id_list: string[]
    public background: Background

    constructor(id: string, scene: DialogSceneObject, background: Background | null = null) {
        this.id = id
        this.dialog_scene = new DialogScene(scene.id, scene.blocks)
        this.plot_id_list = []
        this.background = background ?? { bg_color: 'rgba(0, 0, 0, .7)', inner_html: '' }
    }
}

/**
 * @param id - string(/\d+_flr/)
 * @param dialog_scene - DialogSceneObject
 * @param background - Optional(Background)
 */
interface FloorObject {
    /**
     * regex: /\d+_flr/
     */
    id: string
    dialog_scene: DialogSceneObject
    background?: Background
}

class FloorList extends AbstractList<Floor>{
    constructor(floors: FloorObject[]) {
        super()
        for (let floor of floors) {
            this.data.push(new Floor(
                floor.id,
                floor.dialog_scene,
                floor.background ?? null
            ))
        }
    }
}

class PlotThread {
    /**
     * regex: /\d+_plt/
     */
    public id: string
    public priority: number
    public signatures: string[]
    public passengers: string[]
    public floors: number[]
    public in_signatures: string[]
    public cur_signature_index: number

    constructor(id: string, priority: number, signatures: string[], passengers: string[], floors: number[], in_signatures: string[] = []) {
        this.id = id
        this.priority = priority
        this.signatures = signatures
        this.passengers = passengers
        this.floors = floors
        this.in_signatures = in_signatures
        this.cur_signature_index = 0
    }
    step() {
        this.cur_signature_index += 1
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

// TODO: PlotThread fields
interface PlotThreadObject {

}

class PlotThreadList extends AbstractList<PlotThread>{
    constructor(data: PlotThread[]) {
        super()
        this.data = data
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
    public available: boolean
    public selected: boolean

    constructor(index: number, text: string, available: boolean) {
        this.index = index
        this.text = text
        this.available = available
        this.selected = false
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
                div.classList.add('passenger-item')
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

interface SaveDataType {

}

/**
 * @param status - boolean
 * @param data - SaveDataType
 */
interface SaveRootType {
    status: boolean
    data: SaveDataType
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
            floor.dialog_scene.cur_block_id = next;
            const block = floor.dialog_scene.getCurDialogBlock()
            if (block === null) {
                return
            }
            block.resetIndex()
            Game.stepDialog(block, game.lang)
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
    static stepDialog(block: DialogBlock, lang: string) {
        const item = block.getCurItem()
        if (item === null) {
            Game.hideOptions()
            block.stepIndex()
            Game.showGoOnButton()
            return
        }
        if (item.isSelect()) {
            Game.renderSelect(item as BranchSelect, lang)
            block.setIndexToEnd()
        } else {
            Game.hideOptions()
            Game.renderDialog(item as Dialog, lang, block.isNotFirstLine());
            (item as Dialog).doAction()
            block.stepIndex()
            Game.showGoOnButton()
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
                    Game.stepDialog(block, lang)
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
                Game.showGoOnButton()
            }
        }
    }
    renderFloor() {
        // TODO: select block by thread
        Game.hideGoOnButton()
        Game.hideOptions()
        const floor = this.getCurrentFloor()
        clearChildren(qs('#dialog-container') as HTMLElement)
        if (floor === null) {
            return
        }
        // render visited blocks
        for (let block_id of floor.dialog_scene.visited_blocks) {
            const vis_block = floor.dialog_scene.getDialogBlock(block_id)
            if (vis_block !== null) {
                Game.renderBlock(vis_block, this.lang)
            }
        }
        //render current block
        const cur_block = floor.dialog_scene.getCurDialogBlock()
        if (cur_block !== null) {
            Game.renderBlock(cur_block, this.lang, false)
        }
        const bg: HTMLElement = qs('#background')
        bg.style.backgroundColor = floor.background.bg_color
        bg.innerHTML = floor.background.inner_html
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
        const func_button_row = qs('#func-buttons')
        const button_container = qs('#floor-buttons')
        for (let child of Array.from(button_container.children)) {
            if (child.id !== 'func-buttons') {
                button_container.removeChild(child)
            }
        }
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
        this.floor_buttons.forEach(button_row => {
            let row = document.createElement('div')
            row.classList.add('button-row')
            for (let button of button_row) {
                let col = document.createElement('div')
                col.classList.add('button-col', 'unselectable', 'number-button')
                if (!button.available) {
                    col.classList.add('invisible')
                }
                col.textContent = button.text
                col.setAttribute('index', button.index.toString())
                row.appendChild(col)
            }
            button_container.insertBefore(row, func_button_row)
        })
    }
    encrypt() {

    }
    decipher() {

    }
    serializate(): string {
        return JSON.stringify({ status: true, data: {} })
    }
    deserializate(data: string): boolean {
        data = data
        return false
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
        // task
    }
    initialize() {
        this.createFloorButtons()
        // this.renderFloor()
        this.language_display.set(this.lang)
        this.switchUiLanguge()
        this.dots_animation.start()
    }
    async debug() {
        this.renderFloor()
        this.door.syncStart(DoorDir.OPEN);
        // this.save_panel.syncStart('open')
        // qs('.number-button[index="5"]').click()
        Game.hideGoOnButton()
        qs('#options-row').style.display = 'none';
        (qs('#save-text-area') as HTMLTextAreaElement).value = ''
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
        selector: '#go-on-button-row',
        is_single: true,
        func: () => { }
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
            const res = <SaveRootType>JSON.parse(game.serializate())
            qs('#save-export-button').appendChild(Game.getTFIcon(res.status))
            if (res.status) {
                (qs('#save-text-area') as HTMLTextAreaElement).value = JSON.stringify(res.data)
            }
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

// main
document.addEventListener('DOMContentLoaded', () => {
    game.initialize()
    bindButtonFunctions()
    // game.debug()
})

const game_lang_list = new LanguageList([
    { id: 'zh_cn', name: '中文' },
    { id: 'en', name: 'EN' }
])
const game_default_lang = 'zh_cn'
const game_signature_list = new SignatureList([])
// TODO: generate function
const game_action_list = new GameActionList([])
const game_task_list = new GameTaskList([])
const game_passenger_list = new PassengerList([
    {
        id: 'me_psg',
        name: { zh_cn: '我', en: 'Me' },
        avatar_color: 'black',
        avatar_font_color: 'white',
        avatar_text: { zh_cn: '我', en: 'ME' },
    },
    {
        id: 'jacob_psg',
        name: { zh_cn: '邓霜杰', en: 'Jacob Derek' },
        avatar_color: 'black',
        avatar_font_color: 'white',
        avatar_text: { zh_cn: '杰', en: 'JD' },
    },
])
const game_plot_thread_list = new PlotThreadList([])
const game_floor_list = new FloorList([
    {
        id: '1_flr',
        dialog_scene: {
            id: '1_dsc',
            blocks: [
                {
                    id: 'A01_dbk',
                    dialogs: [
                        {
                            person_id: 'me_psg',
                            text: { zh_cn: '我超', en: 'ong' },
                            layout: DialogLayout.RIGHT
                        }, {
                            person_id: 'me_psg',
                            text: { zh_cn: '什么情况', en: 'wat happened' },
                            layout: DialogLayout.RIGHT
                        }, {
                            person_id: 'me_psg',
                            text: { zh_cn: '电脑爆炸力', en: 'my pc folded' },
                            layout: DialogLayout.RIGHT
                        }, {
                            person_id: 'me_psg',
                            text: { zh_cn: '哦草', en: 'f word' },
                            layout: DialogLayout.RIGHT
                        },
                    ],
                    select: {
                        options: [
                            {
                                next: 'A02_dbk',
                                text: { zh_cn: '打胶', en: 'fap' }
                            },
                            {
                                next: 'A02_dbk',
                                text: { zh_cn: '炉管', en: 'jerk' }
                            }
                        ]
                    }
                },
                {
                    id: 'A02_dbk',
                    dialogs: [
                        {
                            person_id: 'jacob_psg',
                            text: { zh_cn: '好似喵', en: 'nice dead' },
                            layout: DialogLayout.LEFT
                        }
                    ],
                }
            ]
        }
    }
])
const game_ui_string_raw: UiStringDictRaw = {
    'PERSON_NUM': { zh_cn: '人数', en: 'Persons' },
    'COPY': { zh_cn: '复制', en: 'COPY' },
    'IMPORT': { zh_cn: '导入', en: 'IMP' },
    'EXPORT': { zh_cn: '导出', en: 'EXP' }
}
const game = new Game()