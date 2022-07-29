function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time)
    })
}

function range() {
    let start = 0
    let end = 0
    if (arguments.length <= 0) {
        return []
    } else if (arguments.length === 1) {
        if (arguments[0] <= 0) {
            return []
        }
        start = 0
        end = arguments[0] - 1
    } else {
        start = arguments[0]
        end = arguments[1]
    }
    if (start > end) {
        let tmp = end
        end = start
        start = tmp
    }
    let arr = []
    for (let i = start; i <= end; ++i) {
        arr.push(i)
    }
    return arr
}

function clearChildren(elem) {
    for (let child of Array.from(elem.childNodes)) {
        elem.removeChild(child)
    }
}

function toggleElementClass(elem, class_name) {
    if (elem.classList.contains(class_name)) {
        elem.classList.remove(class_name)
    } else {
        elem.classList.add(class_name)
    }
}

function addElementClass(elem, class_name) {
    if (!elem.classList.contains(class_name)) {
        elem.classList.add(class_name)
    }
}

function removeElementClass(elem, class_name) {
    if (elem.classList.contains(class_name)) {
        elem.classList.remove(class_name)
    }
}

const qs = function (v) {
    return document.querySelector(v)
}

const qsa = function (v) {
    return document.querySelectorAll(v)
}

class WaitingDotsAnimation {
    constructor() {
        this.dots = []
        this.orders = []
        this.step = 0
        this.timer = undefined
        this.interval = 250
    }
    generateOrders(num) {
        if (num === 0) {
            return []
        }
        let res = []
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
    toggle(dot, type) {
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
    constructor(index, text, available) {
        this.index = index //number
        this.text = text //string
        this.available = available //bool
        this.selected = false //bool
    }
}

class Door {
    constructor() {
        this.is_moving = false
        this.is_open = false
        this.direction = 'open'
        this.timer_count = 20
        this.sleep_time = 6
        this.l_part = undefined
        this.r_part = undefined
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
    syncStart(direction) {
        this.direction = direction
        this.is_moving = true
        this.l_part = qs('#elev-door>div:nth-child(1)')
        this.r_part = qs('#elev-door>div:nth-child(2)')
        qs('#elev-door').style.display = 'flex'
        this.step = Math.ceil(this.l_part.clientWidth / this.timer_count)
        for (let i in range(this.timer_count)) {
            this.move()
        }
        this.stop()
    }
    async start(direction) {
        this.direction = direction
        this.is_moving = true
        this.l_part = qs('#elev-door>div:nth-child(1)')
        this.r_part = qs('#elev-door>div:nth-child(2)')
        qs('#elev-door').style.display = 'flex'
        this.step = Math.ceil(this.l_part.clientWidth / this.timer_count)
        for (let i in range(this.timer_count)) {
            this.move()
            await sleep(this.sleep_time)
        }
        this.stop()
    }
}

const supported_langs = ['zh_cn', 'en']

class L10nText {
    constructor(data) {
        this.data = data
        return new Proxy(this, {
            get: (obj, key) => {
                if (typeof (key) === 'string' && supported_langs.indexOf(key) !== -1) {
                    return obj.data[key]
                }
                return ''
            },
            set: (obj, key, v) => {
                if (typeof (key) === 'string' && supported_langs.indexOf(key) !== -1) {
                    return obj.data[key] = v
                }
                return ''
            }
        })
    }
}

class Passenger {
    constructor(id, name, color, font_color, avatar_text) {
        this.id = id
        this.name = name
        this.avatar_color = color
        this.avatar_font_color = font_color
        this.avatar_text = avatar_text
    }
}

class Dialog {
    constructor(id, text) {
        this.person_id = id
        this.text = text
    }
}

class DialogBlock {
    constructor() {
        this.data = []
    }
}

class Task {
    constructor() { }
}

class Floor {
    constructor() {
        this.dialogs = {}
        for (let i of range(-2, 6)) {
            if (i !== 0) {
                this.dialogs[i] = `这里是${i}层`
            }
        }
    }
}

class PendingQueue {
    constructor() {
        this.data = []
    }
    sort() {
        for (let i = 0; i < this.data.length; i++) {
            this.data[i].index = i
        }
    }
    length() {
        return this.data.length
    }
    indexOf(value) {
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].floor === value) {
                return i
            }
        }
        return -1
    }
    add(value) {
        if (this.indexOf(value) === -1) {
            this.data.push({ floor: value, index: this.data.length })
            this.sort()
        }
    }
    remove(value) {
        let i = this.indexOf(value)
        if (i !== -1) {
            this.data.splice(i, 1)
            this.sort()
        }
    }
    getMax() {
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
    getMin() {
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
    constructor() {
        this.display_number = undefined
        this.up_icon = undefined
        this.down_icon = undefined
    }
    updateIcon(state) { // up down none both
        if (!this.up_icon) {
            this.up_icon = qs('#up-icon')
        }
        if (!this.down_icon) {
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
    updateNumber(num) {
        if (!this.display_number) {
            this.display_number = qs('#display-number')
        }
        this.display_number.textContent = num.toString()
    }
}

class SavePanel {
    constructor() {
        this.is_moving = false
        this.is_open = false
        this.direction = 'open'
        this.timer_count = 15
        this.sleep_time = 5
        this.cover = undefined
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
    syncStart(direction) {
        this.direction = direction
        this.is_moving = true
        this.cover = qs('#save-panel-cover')
        this.step = Math.ceil(this.cover.clientHeight / this.timer_count)
        for (let i in range(this.timer_count)) {
            this.move()
        }
        this.stop()
    }
    async start(direction) {
        this.direction = direction
        this.is_moving = true
        this.cover = qs('#save-panel-cover')
        this.step = Math.ceil(this.cover.clientHeight / this.timer_count)
        for (let i in range(this.timer_count)) {
            this.move()
            await sleep(this.sleep_time)
        }
        this.stop()
    }
}

class LanguageDisplay {
    constructor() {
        this.language_list = ['zh_cn', 'en']
        this.index = 0
        this.next_index = 0
        this.is_moving = false
        this.direction = ''
        this.angle = 90
        this.ori_angle = -45
        this.timer_count = 15
        this.sleep_time = 8
        this.spin = undefined
        this.step = 0
        this.counter = 0
    }
    getLanguageName(key) {
        switch (key) {
            case 'zh_cn':
                return '中文'
            case 'en':
                return 'EN'
            case 'ru':
                return 'РУ'
            default:
                return ''
        }
    }
    stop() {
        this.is_moving = false
        this.direction = ''
        this.counter = 0
        this.index = this.next_index
        qs('#lang-name-prev>.lang-name-text').textContent = ''
        qs('#lang-name-cur>.lang-name-text').textContent = this.getLanguageName(this.language_list[this.index])
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
    syncStart(direction) {
        this.direction = direction
        this.is_moving = true
        this.spin = qs('#lang-name-body')
        this.step = Math.ceil(this.angle / this.timer_count)
        switch (this.direction) {
            case 'right':
                this.next_index = (this.index - 1 + this.language_list.length) % this.language_list.length
                qs('#lang-name-prev>.lang-name-text').textContent = this.getLanguageName(this.language_list[this.next_index])
                qs('#lang-name-next>.lang-name-text').textContent = ''
                break
            case 'left':
                this.next_index = (this.index + 1) % this.language_list.length
                qs('#lang-name-prev>.lang-name-text').textContent = ''
                qs('#lang-name-next>.lang-name-text').textContent = this.getLanguageName(this.language_list[this.next_index])
                break
            default:
                break
        }
        for (let i in range(this.timer_count)) {
            this.move()
        }
        this.stop()
    }
    async start(direction) {
        this.direction = direction
        this.is_moving = true
        this.spin = qs('#lang-name-body')
        this.step = Math.ceil(this.angle / this.timer_count)
        switch (this.direction) {
            case 'right':
                this.next_index = (this.index - 1 + this.language_list.length) % this.language_list.length
                qs('#lang-name-prev>.lang-name-text').textContent = this.getLanguageName(this.language_list[this.next_index])
                qs('#lang-name-next>.lang-name-text').textContent = ''
                break
            case 'left':
                this.next_index = (this.index + 1) % this.language_list.length
                qs('#lang-name-prev>.lang-name-text').textContent = ''
                qs('#lang-name-next>.lang-name-text').textContent = this.getLanguageName(this.language_list[this.next_index])
                break
            default:
                break
        }
        for (let i in range(this.timer_count)) {
            this.move()
            await sleep(this.sleep_time)
        }
        this.stop()
    }
    set(key) {
        let i = this.language_list.indexOf(key)
        if (i === -1) {
            i = 0
        }
        this.index = i
        qs('#lang-name-prev>.lang-name-text').textContent = ''
        qs('#lang-name-cur>.lang-name-text').textContent = this.getLanguageName(this.language_list[this.index])
        qs('#lang-name-next>.lang-name-text').textContent = ''
    }
    get() {
        return this.language_list[this.index]
    }
}

const binding_buttons = [{
    selector: '.number-button',
    is_single: false,
    func: (event) => {
        let class_name = 'button-selected'
        let index = parseInt(event.target.getAttribute('index'))
        if (!game.is_lifting && index === game.cur_floor) {
            return
        }
        if (event.target.classList.contains(class_name)) {
            event.target.classList.remove(class_name)
            game.pending_queue.remove(index)
            if (index === game.cur_dest) {
                game.calcLiftDirection()
            }
        } else {
            event.target.classList.add(class_name)
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
        let res = game.serializate()
        qs('#save-export-button').appendChild(game.getTFIcon(res.status))
    }
},
{
    selector: '#save-import-button-warp',
    is_single: true,
    func: () => {
        clearChildren(qs('#save-export-button'))
        clearChildren(qs('#save-import-button'))
        qs('#save-import-button').appendChild(game.getTFIcon(game.deserializate()))
    }
},
{
    selector: '#save-copy-button',
    is_single: true,
    func: async () => {
        await navigator.clipboard.writeText(qs('#save-text-area').value)
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

class Game {
    constructor() {
        this.lang = 'zh_cn'
        this.floor_buttons = []
        this.cur_floor = 1
        this.max_floor = 6
        this.min_floor = -2
        this.is_lifting = false
        this.lift_interval = 200
        this.lift_direction = '' //up down
        this.cur_dest = 0
        this.pending_queue = new PendingQueue()
        this.door = new Door()
        this.floors = new Floor()
        this.dots_animation = new WaitingDotsAnimation()
        this.floor_display = new FloorDisplay()
        this.save_panel = new SavePanel()
        this.language_display = new LanguageDisplay()
        this.characters = [
            new Passenger(0, new L10nText({ zh_cn: '我', en: 'Me' }), '', '', new L10nText({ zh_cn: '我', en: 'ME' }))
        ]
        this.ui_string = {
            'PERSON_NUM': new L10nText({ zh_cn: '人数', en: 'Persons' }),
            'COPY': new L10nText({ zh_cn: '复制', en: 'COPY' }),
            'IMPORT': new L10nText({ zh_cn: '导入', en: 'IMP' }),
            'EXPORT': new L10nText({ zh_cn: '导出', en: 'EXP' }),
        }
    }
    getTFIcon(type) {
        switch (type) {
            case true:
                let icon_t = document.createElement('div')
                icon_t.classList.add('save-opration-succ')
                for (let i in range(2)) {
                    icon_t.appendChild(document.createElement('div'))
                }
                return icon_t
            case false:
                let icon_f = document.createElement('div')
                icon_f.classList.add('save-opration-fail')
                for (let i in range(2)) {
                    icon_f.appendChild(document.createElement('div'))
                }
                return icon_f
            default:
                return undefined
        }
    }
    renderFloor() {
        let dialog_container = qs('#dialog-container')
        let dialog_item = document.createElement('div')
        let dialog_text = document.createElement('div')
        clearChildren(dialog_container)
        dialog_item.classList.add('dialog-row', 'mid-dialog-row')
        dialog_text.classList.add('dialog-box', 'mid-dialog-box')
        dialog_text.textContent = this.floors.dialogs[this.cur_floor]
        dialog_item.appendChild(dialog_text)
        dialog_container.appendChild(dialog_item)
    }
    isLiftable() {
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
                let dest = this.pending_queue.getMax().floor
                this.lift_direction = dest > this.cur_floor ? 'up' : (dest < this.cur_floor ? 'down' : '')
                this.cur_dest = dest
            } else {
                let top = this.pending_queue.getMax()
                let bottom = this.pending_queue.getMin()
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
    checkPassingFloor() {
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
            if (this.cur_floor === this.dest) {
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
        let func_button_row = qs('#func-buttons')
        let button_container = qs('#floor-buttons')
        for (let child of Array.from(button_container.childNodes)) {
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
                col.setAttribute('index', button.index)
                row.appendChild(col)
            }
            button_container.insertBefore(row, func_button_row)
        });
    }
    bindFunctionToButtons() {
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
    encrypt() {

    }
    decipher() {

    }
    serializate() {
        return { status: true, data: {} }
    }
    deserializate() {
        return false
    }
    updateUIStrings() {
        for (let e of Array.from(qsa('.l10n-text-ui'))) {
            e.textContent = this.ui_string[e.getAttribute('lkey')][this.lang]
        }
    }
    initialize() {
        this.createFloorButtons()
        this.bindFunctionToButtons()
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
        qs('#options-row').style.display = 'none'
        qs('#save-text-area').value = ''
        this.dots_animation.start()
    }
}

const game = new Game()

document.addEventListener("DOMContentLoaded", () => {
    game.initialize()
    game.debug()
})