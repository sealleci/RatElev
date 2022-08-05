/*TODO:
 *存档功能
 *分支选项
 */

function sleep(time: number): Promise<unknown> {
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

interface NaturalLanguage {
    key: string | symbol
    name: string
}

class LanguageList {
    private data: NaturalLanguage[]

    constructor(data: NaturalLanguage[]) {
        this.data = data
    }

    length(): number {
        return this.data.length
    }

    isKeyIn(key: string | symbol): boolean {
        return key in this.data.map(value => value.key)
    }

    indexOfKey(key: string | symbol): number {
        if (!this.isKeyIn(key)) {
            return -1
        }
        for (let i of range(this.length())) {
            if (this.data[i].key === key) {
                return i
            }
        }
        return -1
    }

    getItemByIndex(index: number): NaturalLanguage {
        if (index < 0) {
            index = 0
        }
        if (index >= this.length()) {
            index = this.length() - 1
        }
        return this.data[index]
    }

    getItemByKey(key: string | symbol): NaturalLanguage | null {
        for (let item of this.data) {
            if (key === item.key) {
                return item
            }
        }
        return null
    }

    getNameByKey(key: string | symbol): string {
        if (!this.isKeyIn(key)) {
            return ''
        }
        let item = this.getItemByKey(key)
        return item !== null ? item.name : ''
    }
}



//TODO: replace any
interface L10nTextDict {
    [key: string | symbol]: string
}

class L10nText {
    private data: L10nTextDict

    constructor(data: L10nTextDict) {
        this.data = data
    }

    get(key: string | symbol): string {
        if (key in this.data) {
            return this.data[key]
        }
        return this.data[game_default_lang]
    }

    set(key: string | symbol, value: string) {
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

class SignatureList {
    private data: Signature[]

    constructor(signatures: SignatureObject[]) {
        this.data = []
        for (let signature of signatures) {
            this.data.push(new Signature(
                signature.id,
                signature.status
            ))
        }
    }

    isIncluding(id: string): boolean {
        for (let i = 0; i < this.data.length; ++i) {
            if (this.data[i].id === id) {
                return true
            }
        }
        return false
    }

    getById(id: string): Signature | null {
        for (let signature of this.data) {
            if (signature.id === id) {
                return signature
            }
        }
        return null
    }

    isActive(id: string): boolean {
        let signature = this.getById(id)
        return signature !== null && signature.status === SignatureStatus.ACTIVE
    }

    activate(id: string): boolean {
        let signature = this.getById(id)
        if (signature !== null) {
            signature.activiate()
            return true
        }
        return false
    }

    deactivate(id: string): boolean {
        let signature = this.getById(id)
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

    constructor(id: string, description: L10nText) {
        this.id = id
        this.description = description
        this.status = TaskStatus.DEACTIVE
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

class GameActionList {
    public data: GameAction[]

    constructor(actions: GameActionObject[]) {
        this.data = []
        for (let action of actions) {
            this.data.push(new GameAction(action.id, action.action))
        }
    }

    getById(id: string): GameAction | null {
        for (let action of this.data) {
            if (action.id === id) {
                return action
            }
        }
        return null
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

class PassengerList {
    public data: Passenger[]

    constructor(passengers: PassengerObject[]) {
        this.data = []
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

    getById(id: string): Passenger | null {
        for (let passenger of this.data) {
            if (passenger.id === id) {
                return passenger
            }
        }
        return null
    }
}

enum DialogBlockItemType {
    DIALOG = 'dialog',
    SELECT = 'select'
}

abstract class DialogBlockItem {
    public id: string
    public type: DialogBlockItemType

    constructor(id: string, type: DialogBlockItemType = DialogBlockItemType.DIALOG) {
        this.id = id
        this.type = type
    }

    isSelect(): boolean {
        return this.type === DialogBlockItemType.SELECT
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
    public id: number
    public dialog_scene: DialogScene
    public plot_id_list: string[]
    public background: Background

    constructor(id: number, scene: DialogSceneObject, background: Background | null = null) {
        this.id = id
        this.dialog_scene = new DialogScene(scene.id, scene.blocks)
        this.plot_id_list = []
        this.background = background ?? { bg_color: 'rgba(0, 0, 0, .7)', inner_html: '' }
    }
}

interface FloorObject {
    id: number
    dialog_scene: DialogSceneObject
    background?: Background
}

class FloorList {
    public data: Floor[]

    constructor(floors: FloorObject[]) {
        this.data = []
        for (let floor of floors) {
            this.data.push(new Floor(
                floor.id,
                floor.dialog_scene,
                floor.background ?? null
            ))
        }
    }

    getById(id: number): Floor | null {
        for (let thread of this.data) {
            if (thread.id === id) {
                return thread
            }
        }
        return null
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
            let signature = game_signature_list.getById(id)
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
            let signature = game_signature_list.getById(id)
            if (signature !== null) {
                if (!signature.isActive()) {
                    return false
                }
            }
        }
        return true
    }
}

class PlotThreadList {
    public data: PlotThread[]

    constructor(data: PlotThread[]) {
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

class WaitingDotsAnimation {
    private dots: HTMLElement[]
    private orders: number[][]
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
    generateOrders(num: number): number[][] {
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
                    // order[0] = order[0] === 0 ? 1 : 0
                    order[0] ^= 1
                }
                res.push(order)
            }
        }
        return res
    }
    toggle(dot: HTMLElement, type: number) {
        switch (type) {
            case 0: //dark
                removeElementClass(dot, 'light-dot')
                addElementClass(dot, 'dark-dot')
                break
            case 1: //light
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

class Door {
    public is_moving: boolean
    public is_open: boolean
    private direction: string
    private timer_count: number
    private sleep_time: number
    private l_part: HTMLElement
    private r_part: HTMLElement
    private step: number

    constructor() {
        this.is_moving = false
        this.is_open = false
        this.direction = 'open'
        this.timer_count = 20
        this.sleep_time = 6
        this.l_part = {} as HTMLElement
        this.r_part = {} as HTMLElement
        this.step = 0
    }
    stop() {
        this.is_moving = false
        switch (this.direction) {
            case 'open':
                this.is_open = true
                this.direction = 'close'
                qs('#elev-door').style.display = 'none'
                break
            case 'close':
                this.is_open = false
                this.direction = 'open'
                break
            default:
                break
        }
    }
    move() {
        let l_part_left = parseInt(this.l_part.style.left)
        let r_part_left = parseInt(this.r_part.style.left)
        switch (this.direction) {
            case 'open':
                this.l_part.style.left = `${l_part_left - this.step}px`
                this.r_part.style.left = `${r_part_left + this.step}px`
                break
            case 'close':
                this.l_part.style.left = `${l_part_left + this.step}px`
                this.r_part.style.left = `${r_part_left - this.step}px`
                break
            default:
                break
        }
    }
    syncStart(direction: string) {
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
    async start(direction: string) {
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
        let i = this.indexOf(value)
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
    updateIcon(state: string) { // up down none both
        if (this.up_icon !== {} as HTMLElement) {
            this.up_icon = qs('#up-icon')
        }
        if (this.down_icon !== {} as HTMLElement) {
            this.down_icon = qs('#down-icon')
        }
        let class_name = 'invisible'
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

class SavePanel {
    public is_moving: boolean
    public is_open: boolean
    private direction: string
    private timer_count: number
    private sleep_time: number
    private cover: HTMLElement
    private step: number

    constructor() {
        this.is_moving = false
        this.is_open = false
        this.direction = 'open'
        this.timer_count = 15
        this.sleep_time = 5
        this.cover = {} as HTMLElement
        this.step = 0
    }
    stop() {
        this.is_moving = false
        switch (this.direction) {
            case 'open':
                this.is_open = true
                this.direction = 'close'
                break
            case 'close':
                this.is_open = false
                this.direction = 'open'
                break
            default:
                break
        }
    }
    move() {
        let cover_top = parseInt(this.cover.style.top)
        switch (this.direction) {
            case 'open':
                this.cover.style.top = `${cover_top - this.step}px`
                break
            case 'close':
                this.cover.style.top = `${cover_top + this.step}px`
                break
            default:
                break
        }
    }
    syncStart(direction: string) {
        this.direction = direction
        this.is_moving = true
        this.cover = qs('#save-panel-cover')
        this.step = Math.ceil(this.cover.clientHeight / this.timer_count)
        for (let _ in range(this.timer_count)) {
            this.move()
        }
        this.stop()
    }
    async start(direction: string) {
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

class LanguageDisplay {
    // private language_list: string[]
    private index: number
    private next_index: number
    public is_moving: boolean
    private direction: string
    private angle: number
    private ori_angle: number
    private timer_count: number
    private sleep_time: number
    private spin: HTMLElement
    private step: number
    private counter: number

    constructor() {
        // this.language_list = ['zh_cn', 'en']
        this.index = 0
        this.next_index = 0
        this.is_moving = false
        this.direction = ''
        this.angle = 90
        this.ori_angle = -45
        this.timer_count = 15
        this.sleep_time = 8
        this.spin = {} as HTMLElement
        this.step = 0
        this.counter = 0
    }
    // getLanguageName(key: string): string {
    //     switch (key) {
    //         case 'zh_cn':
    //             return '中文'
    //         case 'en':
    //             return 'EN'
    //         case 'ru':
    //             return 'РУ'
    //         default:
    //             return ''
    //     }
    // }
    stop() {
        this.is_moving = false
        this.direction = ''
        this.counter = 0
        this.index = this.next_index
        qs('#lang-name-prev>.lang-name-text').textContent = ''
        // qs('#lang-name-cur>.lang-name-text').textContent = this.getLanguageName(this.language_list[this.index])
        qs('#lang-name-cur>.lang-name-text').textContent = game_lang_list.getItemByIndex(this.index).name
        qs('#lang-name-next>.lang-name-text').textContent = ''
        this.spin.style.transform = `rotate(${this.ori_angle}deg)`
    }
    move() {
        this.counter += 1
        switch (this.direction) {
            case 'left':
                this.spin.style.transform = `rotate(${this.ori_angle - this.step * this.counter}deg)`
                break
            case 'right':
                this.spin.style.transform = `rotate(${this.ori_angle + this.step * this.counter}deg)`
                break
            default:
                break
        }
    }
    syncStart(direction: string) {
        this.direction = direction
        this.is_moving = true
        this.spin = qs('#lang-name-body')
        this.step = Math.ceil(this.angle / this.timer_count)
        switch (this.direction) {
            case 'right':
                // this.next_index = (this.index - 1 + this.language_list.length) % this.language_list.length
                this.next_index = (this.index - 1 + game_lang_list.length()) % game_lang_list.length()
                // qs('#lang-name-prev>.lang-name-text').textContent = this.getLanguageName(this.language_list[this.next_index])
                qs('#lang-name-prev>.lang-name-text').textContent = game_lang_list.getItemByIndex(this.next_index).name
                qs('#lang-name-next>.lang-name-text').textContent = ''
                break
            case 'left':
                // this.next_index = (this.index + 1) % this.language_list.length
                this.next_index = (this.index + 1) % game_lang_list.length()
                qs('#lang-name-prev>.lang-name-text').textContent = ''
                // qs('#lang-name-next>.lang-name-text').textContent = this.getLanguageName(this.language_list[this.next_index])
                qs('#lang-name-next>.lang-name-text').textContent = game_lang_list.getItemByIndex(this.next_index).name
                break
            default:
                break
        }
        for (let _ in range(this.timer_count)) {
            this.move()
        }
        this.stop()
    }
    async start(direction: string) {
        this.direction = direction
        this.is_moving = true
        this.spin = qs('#lang-name-body')
        this.step = Math.ceil(this.angle / this.timer_count)
        switch (this.direction) {
            case 'right':
                // this.next_index = (this.index - 1 + this.language_list.length) % this.language_list.length
                this.next_index = (this.index - 1 + game_lang_list.length()) % game_lang_list.length()
                // qs('#lang-name-prev>.lang-name-text').textContent = this.getLanguageName(this.language_list[this.next_index])
                qs('#lang-name-prev>.lang-name-text').textContent = game_lang_list.getItemByIndex(this.next_index).name
                qs('#lang-name-next>.lang-name-text').textContent = ''
                break
            case 'left':
                // this.next_index = (this.index + 1) % this.language_list.length
                this.next_index = (this.index + 1) % game_lang_list.length()
                qs('#lang-name-prev>.lang-name-text').textContent = ''
                // qs('#lang-name-next>.lang-name-text').textContent = this.getLanguageName(this.language_list[this.next_index])
                qs('#lang-name-next>.lang-name-text').textContent = game_lang_list.getItemByIndex(this.next_index).name
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
    set(key: string | symbol) {
        // let i = this.language_list.indexOf(key)
        let i = game_lang_list.indexOfKey(key)
        if (i === -1) {
            i = 0
        }
        this.index = i
        qs('#lang-name-prev>.lang-name-text').textContent = ''
        // qs('#lang-name-cur>.lang-name-text').textContent = this.getLanguageName(this.language_list[this.index])
        qs('#lang-name-cur>.lang-name-text').textContent = game_lang_list.getItemByIndex(this.index).name
        qs('#lang-name-next>.lang-name-text').textContent = ''
    }
    get(): string | symbol {
        // return this.language_list[this.index]
        return game_lang_list.getItemByIndex(this.index).key
    }
}

class PassengerDisplay {

}

class TaskDisplay {

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
    public lang: string | symbol
    public floor_buttons: FloorButton[][]
    public cur_floor_id: number
    public max_floor: number
    public min_floor: number
    public is_lifting: boolean
    private lift_interval: number
    private lift_direction: string
    public cur_dest: number
    public pending_queue: PendingQueue
    public door: Door
    // public floors: Floor[]
    public dots_animation: WaitingDotsAnimation
    public floor_display: FloorDisplay
    public save_panel: SavePanel
    public language_display: LanguageDisplay
    // public characters: Passenger[]
    public ui_string: UiStringDict
    public passenger_display: PassengerDisplay
    public task_display: TaskDisplay

    constructor() {
        this.lang = game_default_lang
        this.floor_buttons = []
        this.cur_floor_id = 1
        this.max_floor = 6
        this.min_floor = -2
        this.is_lifting = false
        this.lift_interval = 200
        this.lift_direction = '' //up down
        this.cur_dest = 0
        this.pending_queue = new PendingQueue()
        this.door = new Door()
        // this.floors = []
        // for (let i of range(-2, 6)) {
        //     if (i !== 0) {
        //         this.floors.push(new Floor(i))
        //     }
        // }
        this.dots_animation = new WaitingDotsAnimation()
        this.floor_display = new FloorDisplay()
        this.save_panel = new SavePanel()
        this.language_display = new LanguageDisplay()
        // this.characters = [
        //     new Passenger("0", new L10nText({ zh_cn: '我', en: 'Me' }), '', '', new L10nText({ zh_cn: '我', en: 'ME' }))
        // ]
        this.ui_string = {}
        for (let key of Object.keys(game_ui_string_raw)) {
            this.ui_string[key] = new L10nText(game_ui_string_raw[key])
        }
        this.passenger_display = new PassengerDisplay()
        this.task_display = new TaskDisplay()
    }
    getTFIcon(type: boolean): HTMLElement {
        if (type) {
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
    // getFloorById(id: number): Floor | null {
    //     for (let floor of this.floors) {
    //         if (floor.id === id) {
    //             return floor
    //         }
    //     }
    //     return null
    // }
    renderFloor() {
        let dialog_container = qs('#dialog-container')
        let floor = game_floor_list.getById(this.cur_floor_id)
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
            this.cur_dest === this.cur_floor_id)
    }
    calcLiftDirection() {
        if (this.pending_queue.length() > 0) {
            if (this.pending_queue.length() === 1) {
                let dest = this.pending_queue.getMax().floor
                this.lift_direction = dest > this.cur_floor_id ? 'up' : (dest < this.cur_floor_id ? 'down' : '')
                this.cur_dest = dest
            } else {
                let top = this.pending_queue.getMax()
                let bottom = this.pending_queue.getMin()
                if (top.floor >= this.cur_floor_id &&
                    this.cur_floor_id >= bottom.floor) {
                    if (top.index <= bottom.index) {
                        this.lift_direction = 'up'
                        this.cur_dest = top.floor
                    } else {
                        this.lift_direction = 'down'
                        this.cur_dest = bottom.floor
                    }
                } else if (bottom.floor >= this.cur_floor_id) {
                    this.lift_direction = 'up'
                    this.cur_dest = top.floor
                } else if (top.floor <= this.cur_floor_id) {
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
        return this.pending_queue.indexOf(this.cur_floor_id) !== -1
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
                    this.cur_floor_id = Math.min(this.cur_floor_id + 1 === 0 ? 1 : this.cur_floor_id + 1, this.max_floor)
                    break
                case 'down':
                    this.cur_floor_id = Math.max(this.cur_floor_id - 1 === 0 ? -1 : this.cur_floor_id - 1, this.min_floor)
                    break
                default:
                    break lift_loop
            }
            this.floor_display.updateNumber(this.cur_floor_id)
            if (this.cur_floor_id === this.cur_dest) {
                break
            }
            if (this.cur_floor_id >= this.max_floor || this.cur_floor_id <= this.min_floor) {
                break
            }
            await sleep(this.lift_interval)
        } while (!this.checkPassingFloor())
        this.pending_queue.remove(this.cur_floor_id)
        removeElementClass(qs(`.number-button[index="${this.cur_floor_id}"]`), 'button-selected')
        this.is_lifting = false
        this.floor_display.updateIcon('none')
    }
    checkBeforeLift() {
        this.pending_queue.remove(this.cur_floor_id)
        this.calcLiftDirection()
        if (this.isLiftable()) {
            this.lift()
        }
    }
    createFloorButtons() {
        let func_button_row = qs('#func-buttons')
        let button_container = qs('#floor-buttons')
        for (let child of Array.from(button_container.children)) {
            if (child.id !== 'func-buttons') {
                button_container.removeChild(child)
            }
        }
        this.floor_buttons = []
        for (let i = this.max_floor - 1; i >= 1; i -= 2) { //地上部分
            this.floor_buttons.push([
                new FloorButton(i, i.toString(), true),
                new FloorButton(
                    i + 1,
                    (i + 1) === this.max_floor ? '∞' : (i + 1).toString(),
                    (i + 1) !== this.max_floor
                )
            ])
        }
        for (let i = -2; i >= this.min_floor; i -= 2) { //地下部分
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
    updateUIStrings() {
        for (let e of Array.from(qsa('.l10n-text-ui'))) {
            e.textContent = this.ui_string[e.getAttribute('lkey')!].get(this.lang)
        }
    }
    initialize() {
        this.createFloorButtons()
        this.renderFloor()
        this.language_display.set(this.lang)
        this.updateUIStrings()
    }
    async debug() {
        this.door.syncStart('open');
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

const binding_buttons: BindingButton[] = [
    {
        selector: '.number-button',
        is_single: false,
        func: (event) => {
            let class_name = 'button-selected'
            let index = parseInt((event.target as HTMLElement).getAttribute('index')!)
            if (!game.is_lifting && index === game.cur_floor_id) {
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
                await game.door.start('close')
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
                await game.door.start('open')
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
                    game.save_panel.start('close')
                } else {
                    game.save_panel.start('open')
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
            let res = <SaveRootType>JSON.parse(game.serializate())
            qs('#save-export-button').appendChild(game.getTFIcon(res.status))
        }
    },
    {
        selector: '#save-import-button-warp',
        is_single: true,
        func: () => {
            clearChildren(qs('#save-export-button'))
            clearChildren(qs('#save-import-button'))
            let text = (qs('#save-text-area') as HTMLTextAreaElement).value
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
            if (!game.language_display.is_moving) {
                await game.language_display.start('left')
                game.lang = game.language_display.get()
                game.updateUIStrings()
            }
        }

    },
    {
        selector: '#lang-switch-button-r',
        is_single: true,
        func: async () => {
            if (!game.language_display.is_moving) {
                await game.language_display.start('right')
                game.lang = game.language_display.get()
                game.updateUIStrings()
            }
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

const game_lang_list = new LanguageList([{ key: 'zh_cn', name: '中文' }, { key: 'en', name: 'EN' }])
const game_default_lang = 'zh_cn'
const game_signature_list = new SignatureList([])
const game_action_list = new GameActionList([])
const game_passenger_list = new PassengerList([])
const game_plot_thread_list = new PlotThreadList([])
const game_floor_list = new FloorList([])
const game_ui_string_raw: UiStringDictRaw = {
    'PERSON_NUM': { zh_cn: '人数', en: 'Persons' },
    'COPY': { zh_cn: '复制', en: 'COPY' },
    'IMPORT': { zh_cn: '导入', en: 'IMP' },
    'EXPORT': { zh_cn: '导出', en: 'EXP' },
}
const game = new Game()