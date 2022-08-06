/* TODO: main
 * save function
 * branch select
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

const qs = function (selector: any): HTMLElement {
    return document.querySelector(selector as string)!
}

const qsa = function (selector: any): NodeListOf<HTMLElement> {
    return document.querySelectorAll(selector as string)
}

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
        return this.data[game_default_lang]
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

interface SignatureObject {
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

interface GameTaskObject {
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

interface GameActionObject {
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

interface PassengerObject {
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
    public next_dialog_block_id: string
    public text: L10nText

    constructor(next_id: string, text: L10nText) {
        this.next_dialog_block_id = next_id
        this.text = text
    }

    toString(): string {
        return `{}`
    }
}

interface OptionObject {
    next: string
    text: L10nTextDict
}

class BranchSelect extends DialogBlockItem {
    public options: SelectOption[]

    constructor(id: string, options: OptionObject[] = []) {
        super(id, DialogBlockItemType.SELECT)
        this.options = []
        for (let option of options) {
            this.options.push(new SelectOption(option.next, new L10nText(option.text)))
        }
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
    public person_id: number
    public text: L10nText
    public layout: DialogLayout
    public is_having_action: boolean
    public action_id: string

    constructor(id: string, person_id: number, text: L10nText, layout: DialogLayout, action_id: string = '') {
        super(id)
        this.person_id = person_id
        this.text = text
        this.layout = layout
        this.action_id = action_id
        this.is_having_action = action_id === '' ? false : true
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

interface DialogObject {
    person_id: number,
    text: L10nTextDict,
    layout: DialogLayout,
    action_id?: string
}

interface SelectObject {
    options: OptionObject[]
}

class DialogBlock {
    public id: string
    public cur_dialog_index: number
    public data: DialogBlockItem[]

    constructor(id: string, dialogs: DialogObject[], select: SelectObject | null = null) {
        this.id = id
        this.cur_dialog_index = 0
        this.data = []
        for (let i = 0; i < dialogs.length; ++i) {
            this.data.push(new Dialog(
                this.id + i.toString(),
                dialogs[i].person_id,
                new L10nText(dialogs[i].text),
                dialogs[i].layout,
                dialogs[i].action_id ?? ''
            ))
        }
        if (select !== null) {
            this.data.push(new BranchSelect(this.id, select.options))
        }
    }

    toString(): string {
        return `{}`
    }
}


interface DialogBlockObject {
    id: string,
    dialogs: DialogObject[],
    select?: SelectObject
}

class DialogScene {
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
        this.cur_block_id = ''
        this.visited_blocks = []
    }

    getDialogBlock(id: string): DialogBlock | null {
        for (let block of this.dialog_blocks) {
            if (block.id === id) {
                return block
            }
        }
        return null
    }

    toString(): string {
        return `{}`
    }
}

interface DialogSceneObject {
    id: string,
    blocks: DialogBlockObject[]
}

interface Background {
    bg_color: string,
    inner_html: string
}

class Floor {
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

interface FloorObject {
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

interface PlotThreadObject {

}

class PlotThreadList extends AbstractList<PlotThread>{

    constructor(data: PlotThread[]) {
        // TODO: PlotThreadObject
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
     * @param state 
     * string
     */
    updateIcon(state: "up" | "down" | "none" | "both") {
        if (this.up_icon !== {} as HTMLElement) {
            this.up_icon = qs('#up-icon')
        }
        if (this.down_icon !== {} as HTMLElement) {
            this.down_icon = qs('#down-icon')
        }
        const class_name = 'invisible'
        switch (state) {
            case 'up':
                removeElementClass(this.up_icon, class_name)
                addElementClass(this.down_icon, class_name)
                break
            case 'down':
                removeElementClass(this.down_icon, class_name)
                addElementClass(this.up_icon, class_name)
                break
            case 'none':
                addElementClass(this.up_icon, class_name)
                addElementClass(this.down_icon, class_name)
                break
            case 'both':
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
            case LangBtnDir.NONE:
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
            case LangBtnDir.NONE:
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
            case LangBtnDir.NONE:
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
        if (index !== -1) {
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

interface UiStringDictRaw {
    [key: string]: L10nTextDict
}

interface UiStringDict {
    [key: string]: L10nText
}

interface SaveDataType {

}

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
    private lift_direction: string
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
        this.lift_direction = '' // up down
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
    getTFIcon(icon_type: boolean): HTMLElement {
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
    renderFloor() {
        const dialog_container = qs('#dialog-container')
        const floor = game_floor_list.getById(this.cur_floor.toString())
        clearChildren(dialog_container)
        if (floor !== null) {
            let dialog_item = document.createElement('div')
            let dialog_text = document.createElement('div')
            dialog_item.classList.add('dialog-row', 'mid-dialog-row')
            dialog_text.classList.add('dialog-box', 'mid-dialog-box')
            // TODO: redener dialog
            // dialog_text.textContent = floor.dialogs[0].data[0].text.get(this.lang)
            dialog_text.textContent = ''
            dialog_item.appendChild(dialog_text)
            dialog_container.appendChild(dialog_item)
        }
    }
    isLiftable(): boolean {
        return !(this.pending_queue.length() <= 0 ||
            this.lift_direction !== 'up' && this.lift_direction !== 'down' ||
            this.cur_dest > this.max_floor ||
            this.cur_dest < this.min_floor ||
            this.cur_dest === 0 ||
            this.cur_dest === this.cur_floor)
    }
    calcLiftDirection() {
        if (this.pending_queue.length() > 0) {
            if (this.pending_queue.length() === 1) {
                const dest = this.pending_queue.getMax().floor
                this.lift_direction = dest > this.cur_floor ? 'up' : (dest < this.cur_floor ? 'down' : '')
                this.cur_dest = dest
            } else {
                const top = this.pending_queue.getMax()
                const bottom = this.pending_queue.getMin()
                if (top.floor >= this.cur_floor &&
                    this.cur_floor >= bottom.floor) {
                    if (top.index <= bottom.index) {
                        this.lift_direction = 'up'
                        this.cur_dest = top.floor
                    } else {
                        this.lift_direction = 'down'
                        this.cur_dest = bottom.floor
                    }
                } else if (bottom.floor >= this.cur_floor) {
                    this.lift_direction = 'up'
                    this.cur_dest = top.floor
                } else if (top.floor <= this.cur_floor) {
                    this.lift_direction = 'down'
                    this.cur_dest = bottom.floor
                } else {
                    this.lift_direction = ''
                    this.cur_dest = 0
                }
            }
        } else {
            this.lift_direction = ''
            this.cur_dest = 0
        }
    }
    checkPassingFloor(): boolean {
        return this.pending_queue.indexOf(this.cur_floor) !== -1
    }
    async lift() {
        if (this.lift_direction !== 'up' && this.lift_direction !== 'down') {
            return
        }
        this.floor_display.updateIcon(this.lift_direction)
        this.is_lifting = true
        lift_loop: do {
            switch (this.lift_direction) {
                case 'up':
                    this.cur_floor = Math.min(this.cur_floor + 1 === 0 ? 1 : this.cur_floor + 1, this.max_floor)
                    break
                case 'down':
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
        this.floor_display.updateIcon('none')
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
        for (let e of Array.from(qsa('.l10n-text-ui'))) {
            e.textContent = this.ui_string[e.getAttribute('lkey')!].get(this.lang)
        }
    }
    switchTextLanguage() {

    }
    initialize() {
        this.createFloorButtons()
        // this.renderFloor()
        this.language_display.set(this.lang)
        this.switchUiLanguge()
    }
    async debug() {
        this.renderFloor()
        this.door.syncStart(DoorDir.OPEN);
        // this.save_panel.syncStart('open')
        // qs('.number-button[index="5"]').click()
        qs('#sheng-lue-dots').style.display = 'none'
        qs('#go-on-button-row').style.display = 'none'
        qs('#options-row').style.display = 'none';
        (qs('#save-text-area') as HTMLTextAreaElement).value = ''
        this.dots_animation.start()
    }
}

interface BindingButton {
    selector: string
    is_single: boolean
    func(this: HTMLElement, event: MouseEvent): void
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
            qs('#save-export-button').appendChild(game.getTFIcon(res.status))
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
            qs('#save-import-button').appendChild(game.getTFIcon(game.deserializate(text)))
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
            // if (!game.language_display.is_moving) {
            //     await game.language_display.start('left')
            //     game.lang = game.language_display.get()
            //     game.switchUiLanguge()
            //     game.switchTextLanguage()

            // }
        }

    },
    {
        selector: '#lang-switch-button-r',
        is_single: true,
        func: async () => {
            await clickSwitchLangButton(LangBtnDir.RIGHT)
            // if (!game.language_display.is_moving) {
            //     await game.language_display.start('right')
            //     game.lang = game.language_display.get()
            //     game.switchUiLanguge()
            //     game.switchTextLanguage()
            // }
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
    game.debug()
})

const game_lang_list = new LanguageList([
    { id: 'zh_cn', name: '中文' },
    { id: 'en', name: 'EN' }
])
const game_default_lang = 'zh_cn'
const game_signature_list = new SignatureList([])
const game_action_list = new GameActionList([])
const game_task_list = new GameTaskList([])
const game_passenger_list = new PassengerList([])
const game_plot_thread_list = new PlotThreadList([])
const game_floor_list = new FloorList([])
const game_ui_string_raw: UiStringDictRaw = {
    'PERSON_NUM': { zh_cn: '人数', en: 'Persons' },
    'COPY': { zh_cn: '复制', en: 'COPY' },
    'IMPORT': { zh_cn: '导入', en: 'IMP' },
    'EXPORT': { zh_cn: '导出', en: 'EXP' }
}
const game = new Game()