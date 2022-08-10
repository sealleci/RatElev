"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}
function range(...args) {
    let start = 0;
    let end = 0;
    if (args.length <= 0) {
        return [];
    }
    else if (args.length === 1) {
        if (args[0] <= 0) {
            return [];
        }
        start = 0;
        end = args[0] - 1;
    }
    else {
        start = args[0];
        end = args[1];
    }
    if (start > end) {
        let tmp = end;
        end = start;
        start = tmp;
    }
    let arr = [];
    for (let i = start; i <= end; ++i) {
        arr.push(i);
    }
    return arr;
}
function clearChildren(elem) {
    for (let child of Array.from(elem.childNodes)) {
        elem.removeChild(child);
    }
}
function toggleElementClass(elem, class_name) {
    if (elem.classList.contains(class_name)) {
        elem.classList.remove(class_name);
    }
    else {
        elem.classList.add(class_name);
    }
}
function addElementClass(elem, class_name) {
    if (!elem.classList.contains(class_name)) {
        elem.classList.add(class_name);
    }
}
function removeElementClass(elem, class_name) {
    if (elem.classList.contains(class_name)) {
        elem.classList.remove(class_name);
    }
}
function padLeftZero(num) {
    let num_s = num.toString();
    return /^[0-9]$/.test(num_s) ? '0' + num_s : num_s;
}
function getNumFromId(id) {
    let num = id.match(/[^_]+/);
    return num === null || num.length <= 0 ? '' : num[0];
}
const qs = function (selector) {
    return document.querySelector(selector);
};
const qsa = function (selector) {
    return document.querySelectorAll(selector);
};
class AbstractList {
    constructor() {
        this.data = [];
    }
    getLength() {
        return this.data.length;
    }
    isIncluding(id) {
        for (let i = 0; i < this.data.length; ++i) {
            if (this.data[i].id === id) {
                return true;
            }
        }
        return false;
    }
    getById(id) {
        for (let item of this.data) {
            if (item.id === id) {
                return item;
            }
        }
        return null;
    }
}
class LanguageList extends AbstractList {
    constructor(data) {
        super();
        this.data = data;
    }
    isKeyIn(id) {
        return id in this.data.map(value => value.id);
    }
    indexOfKey(id) {
        if (!this.isKeyIn(id)) {
            return -1;
        }
        for (let i of range(this.getLength())) {
            if (this.data[i].id === id) {
                return i;
            }
        }
        return -1;
    }
    getItemByIndex(index) {
        if (index < 0) {
            index = 0;
        }
        if (index >= this.getLength()) {
            index = this.getLength() - 1;
        }
        return this.data[index];
    }
    getItemByKey(id) {
        for (let item of this.data) {
            if (id === item.id) {
                return item;
            }
        }
        return null;
    }
    getNameByKey(id) {
        if (!this.isKeyIn(id)) {
            return '';
        }
        const item = this.getItemByKey(id);
        return item !== null ? item.name : '';
    }
}
class L10nText {
    constructor(data) {
        this.data = data;
    }
    get(key) {
        if (key in this.data) {
            return this.data[key];
        }
        return '';
    }
    set(key, value) {
        if (!game_lang_list.isKeyIn(key)) {
            return;
        }
        this.data[key] = value;
    }
    toString() {
        return `{}`;
    }
}
var SignatureStatus;
(function (SignatureStatus) {
    SignatureStatus["DEACTIVE"] = "deactive";
    SignatureStatus["ACTIVE"] = "active";
})(SignatureStatus || (SignatureStatus = {}));
class Signature {
    constructor(id, status = SignatureStatus.DEACTIVE) {
        this.id = id;
        this.status = status;
    }
    activiate() {
        this.status = SignatureStatus.ACTIVE;
    }
    deactiviate() {
        this.status = SignatureStatus.DEACTIVE;
    }
    isActive() {
        return this.status === SignatureStatus.ACTIVE;
    }
    toString() {
        return `{}`;
    }
}
class SignatureList extends AbstractList {
    constructor(signatures) {
        super();
        for (let signature of signatures) {
            this.data.push(new Signature(signature.id, signature.status));
        }
    }
    initialize() {
        for (let signarue of this.data) {
            signarue.deactiviate();
        }
    }
    isActiveById(id) {
        const signature = this.getById(id);
        return signature !== null && signature.status === SignatureStatus.ACTIVE;
    }
    activateById(id) {
        const signature = this.getById(id);
        if (signature !== null) {
            signature.activiate();
            return true;
        }
        return false;
    }
    deactivateById(id) {
        const signature = this.getById(id);
        if (signature !== null) {
            signature.deactiviate();
            return true;
        }
        return false;
    }
}
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["DEACTIVE"] = "deactive";
    TaskStatus["ACTIVE"] = "active";
    TaskStatus["FINISHED"] = "finished";
})(TaskStatus || (TaskStatus = {}));
class GameTask {
    constructor(id, description, status = TaskStatus.DEACTIVE) {
        this.id = id;
        this.description = description;
        this.status = status !== null && status !== void 0 ? status : TaskStatus.DEACTIVE;
    }
    isActive() {
        return this.status === TaskStatus.ACTIVE;
    }
    isFinished() {
        return this.status === TaskStatus.FINISHED;
    }
    activiate() {
        this.status = TaskStatus.ACTIVE;
    }
    finish() {
        this.status = TaskStatus.FINISHED;
    }
    deactiviate() {
        this.status = TaskStatus.DEACTIVE;
    }
}
class GameTaskList extends AbstractList {
    constructor(tasks) {
        super();
        for (let task of tasks) {
            this.data.push(new GameTask(task.id, new L10nText(task.description), task.status));
        }
    }
    isActiveById(id) {
        const task = this.getById(id);
        return task !== null && task.status === TaskStatus.ACTIVE;
    }
    isFinishedById(id) {
        const task = this.getById(id);
        return task !== null && task.status === TaskStatus.FINISHED;
    }
    activateById(id) {
        const task = this.getById(id);
        if (task !== null) {
            task.activiate();
            return true;
        }
        return false;
    }
    deactivateById(id) {
        const task = this.getById(id);
        if (task !== null) {
            task.deactiviate();
            return true;
        }
        return false;
    }
    finishById(id) {
        const task = this.getById(id);
        if (task !== null) {
            task.finish();
            return true;
        }
        return false;
    }
}
class GameAction {
    constructor(id, f = () => { }) {
        this.id = id;
        this.action = f;
    }
    do() {
        this.action();
    }
    static genDeactivateSignatureAct(id) {
        return () => {
            game_signature_list.deactivateById(id);
        };
    }
    static genActivateSignatureAct(id) {
        return () => {
            game_signature_list.activateById(id);
        };
    }
    static genDeactivateTaskAct(id) {
        return () => {
            game_task_list.deactivateById(id);
            game.task_display.remove(id);
            game.task_display.render(game.lang);
        };
    }
    static genActiveTaskAct(id) {
        return () => {
            game_task_list.activateById(id);
            game.task_display.add(id);
            game.task_display.render(game.lang);
        };
    }
    static genFinishTaskAct(id) {
        return () => {
            game_task_list.finishById(id);
            game.task_display.render(game.lang);
        };
    }
    static genAddPassengerAct(id) {
        return () => {
            game.passenger_display.add(id);
            game.passenger_display.render(game.lang);
        };
    }
    static genRemovePassengerAct(id) {
        return () => {
            game.passenger_display.remove(id);
            game.passenger_display.render(game.lang);
        };
    }
    static genStepActionAct(id) {
        return () => {
            var _a;
            (_a = game_plot_thread_list.getById(id)) === null || _a === void 0 ? void 0 : _a.step();
        };
    }
    static polyActs(...fs) {
        return () => {
            fs.forEach(f => { f(); });
        };
    }
    toString() {
        return `{}`;
    }
}
class GameActionList extends AbstractList {
    constructor(actions) {
        super();
        for (let action of actions) {
            this.data.push(new GameAction(action.id, action.action));
        }
    }
}
class Passenger {
    constructor(id, name, avatar_color, avatar_font_color, avatar_text, is_display = true) {
        this.id = id;
        this.name = name;
        this.avatar_color = avatar_color;
        this.avatar_font_color = avatar_font_color;
        this.avatar_text = avatar_text;
        this.is_diaplay = is_display;
    }
    toString() {
        return `{}`;
    }
}
class PassengerList extends AbstractList {
    constructor(passengers) {
        var _a;
        super();
        for (let passenger of passengers) {
            this.data.push(new Passenger(passenger.id, new L10nText(passenger.name), passenger.avatar_color, passenger.avatar_font_color, new L10nText(passenger.avatar_text), (_a = passenger.is_display) !== null && _a !== void 0 ? _a : true));
        }
    }
}
var DialogBlockItemType;
(function (DialogBlockItemType) {
    DialogBlockItemType["DIALOG"] = "dialog";
    DialogBlockItemType["SELECT"] = "select";
})(DialogBlockItemType || (DialogBlockItemType = {}));
class DialogBlockItem {
    constructor(id, type = DialogBlockItemType.DIALOG) {
        this.id = id;
        this.item_type = type;
    }
    isSelect() {
        return this.item_type === DialogBlockItemType.SELECT;
    }
}
class SelectOption {
    constructor(id, next_id, text) {
        this.id = id;
        this.next_dialog_block_id = next_id;
        this.text = text;
    }
    static splitId(id) {
        let arr = id.match(/^([^_]+)_([^_]+)_opt$/);
        let id1 = '';
        let id2 = '';
        if (arr !== null) {
            if (arr.length > 1) {
                id1 = arr[1];
            }
            if (arr.length > 2) {
                id2 = arr[2];
            }
        }
        return [id1, id2];
    }
    toString() {
        return `{}`;
    }
}
class BranchSelect extends DialogBlockItem {
    constructor(id, options = []) {
        super(id, DialogBlockItemType.SELECT);
        this.options = [];
        for (let i = 0; i < options.length; ++i) {
            this.options.push(new SelectOption(`${padLeftZero(i)}_${getNumFromId(this.id)}_opt`, options[i].next, new L10nText(options[i].text)));
        }
    }
    getOptionById(id) {
        for (let opt of this.options) {
            if (opt.id === id) {
                return opt;
            }
        }
        return null;
    }
    toString() {
        return `{}`;
    }
}
var DialogLayout;
(function (DialogLayout) {
    DialogLayout["LEFT"] = "left";
    DialogLayout["MIDDLE"] = "middle";
    DialogLayout["RIGHT"] = "right";
})(DialogLayout || (DialogLayout = {}));
class Dialog extends DialogBlockItem {
    constructor(id, person_id, text, layout, action_id = '') {
        super(id);
        this.person_id = person_id;
        this.text = text;
        this.layout = layout;
        this.action_id = action_id;
        this.is_having_action = action_id === '' ? false : true;
    }
    static splitId(id) {
        let arr = id.match(/^([^_]+)_([^_]+)_dlg$/);
        let id1 = '';
        let id2 = '';
        if (arr !== null) {
            if (arr.length > 1) {
                id1 = arr[1];
            }
            if (arr.length > 2) {
                id2 = arr[2];
            }
        }
        return [id1, id2];
    }
    doAction() {
        var _a;
        if (this.is_having_action) {
            (_a = game_action_list.getById(this.action_id)) === null || _a === void 0 ? void 0 : _a.do();
        }
    }
    toString() {
        return `{}`;
    }
}
class DialogBlock {
    constructor(id, in_signatures, dialogs, select = null) {
        var _a;
        this.id = id;
        this.in_signatures = in_signatures;
        this.data = [];
        for (let i = 0; i < dialogs.length; ++i) {
            this.data.push(new Dialog(`${padLeftZero(i)}_${getNumFromId(this.id)}_dlg`, dialogs[i].person_id, new L10nText(dialogs[i].text), dialogs[i].layout, (_a = dialogs[i].action_id) !== null && _a !== void 0 ? _a : ''));
        }
        if (select !== null) {
            this.data.push(new BranchSelect(`${getNumFromId(this.id)}$_slt`, select.options));
        }
        this.cur_item_index = 0;
    }
    getItemByIndex(index) {
        return index < 0 || index >= this.data.length ? null : this.data[index];
    }
    getItemById(id) {
        for (let item of this.data) {
            if (item.id === id) {
                return item;
            }
        }
        return null;
    }
    getCurItem() {
        return this.getItemByIndex(this.cur_item_index);
    }
    resetIndex() {
        this.cur_item_index = 0;
    }
    setIndexToEnd() {
        this.cur_item_index = this.data.length;
    }
    stepIndex() {
        this.cur_item_index += 1;
        if (this.cur_item_index < 0) {
            this.cur_item_index = 0;
        }
        if (this.cur_item_index > this.data.length) {
            this.cur_item_index = this.data.length;
        }
    }
    isNotFirstLine() {
        if (this.cur_item_index <= 0 || this.cur_item_index >= this.data.length) {
            return false;
        }
        const cur = this.getCurItem();
        const pre = this.getItemByIndex(this.cur_item_index - 1);
        if (cur !== null && pre !== null &&
            !cur.isSelect() && !pre.isSelect() &&
            cur.person_id === pre.person_id) {
            return true;
        }
        return false;
    }
    toString() {
        return `{}`;
    }
}
class DialogScene {
    constructor(id, blocks) {
        var _a;
        this.id = id;
        this.dialog_in_dict = {};
        this.dialog_blocks = [];
        for (let i = 0; i < blocks.length; ++i) {
            this.dialog_blocks.push(new DialogBlock(blocks[i].id, blocks[i].in_signatures, blocks[i].dialogs, (_a = blocks[i].select) !== null && _a !== void 0 ? _a : null));
            this.dialog_in_dict[blocks[i].id] = blocks[i].in_signatures;
        }
        this.cur_block_id = this.dialog_blocks[0].id;
        this.visited_blocks = [];
    }
    getCurDialogBlock() {
        for (let block of this.dialog_blocks) {
            if (block.id === this.cur_block_id) {
                return block;
            }
        }
        return null;
    }
    getDialogBlock(id) {
        for (let block of this.dialog_blocks) {
            if (block.id === id) {
                return block;
            }
        }
        return null;
    }
    addVisitedBlock(id) {
        if (this.visited_blocks.indexOf(id) !== -1) {
            return;
        }
        this.visited_blocks.push(id);
    }
    removeVisitedBlock(id) {
        const index = this.visited_blocks.indexOf(id);
        if (index === -1) {
            return;
        }
        this.visited_blocks.splice(index, 1);
    }
    toString() {
        return `{}`;
    }
}
class Floor {
    constructor(id, scene, background = null) {
        this.id = id;
        this.dialog_scene = new DialogScene(scene.id, scene.blocks);
        this.plot_id_list = [];
        this.background = background !== null && background !== void 0 ? background : { bg_color: 'rgba(0, 0, 0, .7)', inner_html: '' };
    }
    checkPlotThreads() {
        let choice = '';
        let cur_prioeity = -Infinity;
        for (let plot_id of this.plot_id_list) {
            const plot = game_plot_thread_list.getById(plot_id);
            if (plot === null) {
                continue;
            }
            if (plot.priority >= cur_prioeity) {
                choice;
            }
        }
        this.dialog_scene;
    }
}
class FloorList extends AbstractList {
    constructor(floors) {
        var _a;
        super();
        for (let floor of floors) {
            this.data.push(new Floor(floor.id, floor.dialog_scene, (_a = floor.background) !== null && _a !== void 0 ? _a : null));
        }
    }
}
class PlotThread {
    constructor(id, priority, sig_floor_dict, in_signatures = []) {
        this.id = id;
        this.priority = priority;
        this.signature_floor_dict = sig_floor_dict;
        this.signatures = Object.keys(this.signature_floor_dict);
        this.in_signatures = in_signatures;
        this.cur_signature_index = 0;
    }
    step() {
        this.cur_signature_index += 1;
        if (this.cur_signature_index < 0) {
            this.cur_signature_index = 0;
        }
        if (this.cur_signature_index > this.signatures.length) {
            this.cur_signature_index = this.signatures.length;
        }
    }
    getSignatureById(index) {
        if (index < 0 || index >= this.signatures.length) {
            return null;
        }
        return game_signature_list.getById(this.signatures[index]);
    }
    getCurrentSignature() {
        return this.getSignatureById(this.cur_signature_index);
    }
    isUnlocked() {
        if (this.in_signatures.length <= 0) {
            return true;
        }
        for (let id of this.in_signatures) {
            const signature = game_signature_list.getById(id);
            if (signature !== null) {
                if (!signature.isActive()) {
                    return false;
                }
            }
        }
        return true;
    }
    isFinished() {
        if (this.signatures.length <= 0) {
            return true;
        }
        for (let id of this.signatures) {
            const signature = game_signature_list.getById(id);
            if (signature !== null) {
                if (!signature.isActive()) {
                    return false;
                }
            }
        }
        return true;
    }
}
class PlotThreadList extends AbstractList {
    constructor(threads) {
        super();
        this.data = [];
        for (let thread of threads) {
            this.data.push(new PlotThread(thread.id, thread.priority, thread.signature_floor_dict, thread.in_signatures));
        }
    }
    getById(id) {
        for (let thread of this.data) {
            if (thread.id === id) {
                return thread;
            }
        }
        return null;
    }
}
var DotColor;
(function (DotColor) {
    DotColor["DARK"] = "dark";
    DotColor["LIGHT"] = "light";
})(DotColor || (DotColor = {}));
class WaitingDotsAnimation {
    constructor() {
        this.dots = [];
        this.orders = [];
        this.step = 0;
        this.timer = undefined;
        this.interval = 250;
    }
    generateOrders(num) {
        if (num === 0) {
            return [];
        }
        let res = [];
        for (let i of range(num * 2)) {
            if (i === 0) {
                res.push(Array(num).fill(0));
            }
            else {
                let order = [...res[i - 1]];
                let is_all_same = true;
                for (let j of range(order.length)) {
                    if (j !== 0) {
                        if (order[j - 1] !== order[j]) {
                            order[j] = order[j - 1];
                            is_all_same = false;
                            break;
                        }
                    }
                }
                if (is_all_same) {
                    order[0] ^= 1;
                }
                res.push(order);
            }
        }
        return res.map(i => i.map(j => j === 0 ? DotColor.DARK : DotColor.LIGHT));
    }
    toggle(dot, color_type) {
        switch (color_type) {
            case DotColor.DARK:
                removeElementClass(dot, 'light-dot');
                addElementClass(dot, 'dark-dot');
                break;
            case DotColor.LIGHT:
                removeElementClass(dot, 'dark-dot');
                addElementClass(dot, 'light-dot');
                break;
            default:
                break;
        }
    }
    start() {
        this.dots = Array.from(qsa('#sheng-lue-dots .sl-dot'));
        this.orders = this.generateOrders(this.dots.length);
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            for (let i of range(this.orders[this.step].length)) {
                this.toggle(this.dots[i], this.orders[this.step][i]);
            }
            this.step = (this.step + 1) % this.orders.length;
        }, this.interval);
    }
    stop() {
        clearInterval(this.timer);
    }
}
class FloorButton {
    constructor(index, text, available) {
        this.index = index;
        this.text = text;
        this.available = available;
        this.selected = false;
    }
}
var DoorDir;
(function (DoorDir) {
    DoorDir["OPEN"] = "open";
    DoorDir["CLOSE"] = "close";
})(DoorDir || (DoorDir = {}));
class Door {
    constructor() {
        this.is_moving = false;
        this.is_open = false;
        this.direction = DoorDir.OPEN;
        this.timer_count = 20;
        this.sleep_time = 6;
        this.l_part = {};
        this.r_part = {};
        this.step = 0;
    }
    stop() {
        this.is_moving = false;
        switch (this.direction) {
            case DoorDir.OPEN:
                this.is_open = true;
                this.direction = DoorDir.CLOSE;
                qs('#elev-door').style.display = 'none';
                break;
            case DoorDir.CLOSE:
                this.is_open = false;
                this.direction = DoorDir.OPEN;
                break;
            default:
                break;
        }
    }
    move() {
        const l_part_left = parseInt(this.l_part.style.left);
        const r_part_left = parseInt(this.r_part.style.left);
        switch (this.direction) {
            case DoorDir.OPEN:
                this.l_part.style.left = `${l_part_left - this.step}px`;
                this.r_part.style.left = `${r_part_left + this.step}px`;
                break;
            case DoorDir.CLOSE:
                this.l_part.style.left = `${l_part_left + this.step}px`;
                this.r_part.style.left = `${r_part_left - this.step}px`;
                break;
            default:
                break;
        }
    }
    syncStart(direction) {
        this.direction = direction;
        this.is_moving = true;
        this.l_part = qs('#elev-door>div:nth-child(1)');
        this.r_part = qs('#elev-door>div:nth-child(2)');
        qs('#elev-door').style.display = 'flex';
        this.step = Math.ceil(this.l_part.clientWidth / this.timer_count);
        for (let _ in range(this.timer_count)) {
            this.move();
        }
        this.stop();
    }
    start(direction) {
        return __awaiter(this, void 0, void 0, function* () {
            this.direction = direction;
            this.is_moving = true;
            this.l_part = qs('#elev-door>div:nth-child(1)');
            this.r_part = qs('#elev-door>div:nth-child(2)');
            qs('#elev-door').style.display = 'flex';
            this.step = Math.ceil(this.l_part.clientWidth / this.timer_count);
            for (let _ in range(this.timer_count)) {
                this.move();
                yield sleep(this.sleep_time);
            }
            this.stop();
        });
    }
}
class PendingQueue {
    constructor() {
        this.data = [];
    }
    sort() {
        for (let i = 0; i < this.data.length; i++) {
            this.data[i].index = i;
        }
    }
    length() {
        return this.data.length;
    }
    indexOf(value) {
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].floor === value) {
                return i;
            }
        }
        return -1;
    }
    add(value) {
        if (this.indexOf(value) === -1) {
            this.data.push({ floor: value, index: this.data.length });
            this.sort();
        }
    }
    remove(value) {
        const i = this.indexOf(value);
        if (i !== -1) {
            this.data.splice(i, 1);
            this.sort();
        }
    }
    getMax() {
        if (this.data.length <= 0) {
            return { floor: 0, index: -1 };
        }
        let k = 0;
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].floor > this.data[k].floor) {
                k = i;
            }
        }
        return this.data[k];
    }
    getMin() {
        if (this.data.length <= 0) {
            return { floor: 0, index: -1 };
        }
        let k = 0;
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].floor < this.data[k].floor) {
                k = i;
            }
        }
        return this.data[k];
    }
}
var FloorLiftStatus;
(function (FloorLiftStatus) {
    FloorLiftStatus["UP"] = "up";
    FloorLiftStatus["DOWN"] = "down";
    FloorLiftStatus["NONE"] = "none";
    FloorLiftStatus["BOTH"] = "both";
})(FloorLiftStatus || (FloorLiftStatus = {}));
class FloorDisplay {
    constructor() {
        this.display_number = {};
        this.up_icon = {};
        this.down_icon = {};
    }
    updateIcon(status) {
        if (this.up_icon !== {}) {
            this.up_icon = qs('#up-icon');
        }
        if (this.down_icon !== {}) {
            this.down_icon = qs('#down-icon');
        }
        const class_name = 'invisible';
        switch (status) {
            case FloorLiftStatus.UP:
                removeElementClass(this.up_icon, class_name);
                addElementClass(this.down_icon, class_name);
                break;
            case FloorLiftStatus.DOWN:
                removeElementClass(this.down_icon, class_name);
                addElementClass(this.up_icon, class_name);
                break;
            case FloorLiftStatus.NONE:
                addElementClass(this.up_icon, class_name);
                addElementClass(this.down_icon, class_name);
                break;
            case FloorLiftStatus.BOTH:
                removeElementClass(this.up_icon, class_name);
                removeElementClass(this.down_icon, class_name);
                break;
            default:
                break;
        }
    }
    updateNumber(num) {
        if (this.display_number !== {}) {
            this.display_number = qs('#display-number');
        }
        this.display_number.textContent = num.toString();
    }
}
var SavePanelDir;
(function (SavePanelDir) {
    SavePanelDir["OPEN"] = "open";
    SavePanelDir["CLOSE"] = "close";
})(SavePanelDir || (SavePanelDir = {}));
class SavePanel {
    constructor() {
        this.is_moving = false;
        this.is_open = false;
        this.direction = SavePanelDir.OPEN;
        this.timer_count = 15;
        this.sleep_time = 5;
        this.cover = {};
        this.step = 0;
    }
    stop() {
        this.is_moving = false;
        switch (this.direction) {
            case SavePanelDir.OPEN:
                this.is_open = true;
                this.direction = SavePanelDir.CLOSE;
                break;
            case SavePanelDir.CLOSE:
                this.is_open = false;
                this.direction = SavePanelDir.OPEN;
                break;
            default:
                break;
        }
    }
    move() {
        const cover_top = parseInt(this.cover.style.top);
        switch (this.direction) {
            case SavePanelDir.OPEN:
                this.cover.style.top = `${cover_top - this.step}px`;
                break;
            case SavePanelDir.CLOSE:
                this.cover.style.top = `${cover_top + this.step}px`;
                break;
            default:
                break;
        }
    }
    syncStart(direction) {
        this.direction = direction;
        this.is_moving = true;
        this.cover = qs('#save-panel-cover');
        this.step = Math.ceil(this.cover.clientHeight / this.timer_count);
        for (let _ in range(this.timer_count)) {
            this.move();
        }
        this.stop();
    }
    start(direction) {
        return __awaiter(this, void 0, void 0, function* () {
            this.direction = direction;
            this.is_moving = true;
            this.cover = qs('#save-panel-cover');
            this.step = Math.ceil(this.cover.clientHeight / this.timer_count);
            for (let _ in range(this.timer_count)) {
                this.move();
                yield sleep(this.sleep_time);
            }
            this.stop();
        });
    }
}
var LangBtnDir;
(function (LangBtnDir) {
    LangBtnDir["LEFT"] = "left";
    LangBtnDir["RIGHT"] = "right";
    LangBtnDir["NONE"] = "none";
})(LangBtnDir || (LangBtnDir = {}));
class LanguageDisplay {
    constructor() {
        this.index = 0;
        this.next_index = 0;
        this.is_moving = false;
        this.direction = LangBtnDir.NONE;
        this.angle = 90;
        this.ori_angle = -45;
        this.timer_count = 15;
        this.sleep_time = 8;
        this.spin = {};
        this.step = 0;
        this.counter = 0;
    }
    stop() {
        this.is_moving = false;
        this.direction = LangBtnDir.NONE;
        this.counter = 0;
        this.index = this.next_index;
        qs('#lang-name-prev>.lang-name-text').textContent = '';
        qs('#lang-name-cur>.lang-name-text').textContent = game_lang_list.getItemByIndex(this.index).name;
        qs('#lang-name-next>.lang-name-text').textContent = '';
        this.spin.style.transform = `rotate(${this.ori_angle}deg)`;
    }
    move() {
        this.counter += 1;
        switch (this.direction) {
            case LangBtnDir.LEFT:
                this.spin.style.transform = `rotate(${this.ori_angle - this.step * this.counter}deg)`;
                break;
            case LangBtnDir.RIGHT:
                this.spin.style.transform = `rotate(${this.ori_angle + this.step * this.counter}deg)`;
                break;
            default:
                break;
        }
    }
    syncStart(direction) {
        this.direction = direction;
        this.is_moving = true;
        this.spin = qs('#lang-name-body');
        this.step = Math.ceil(this.angle / this.timer_count);
        switch (this.direction) {
            case LangBtnDir.LEFT:
                this.next_index = (this.index + 1) % game_lang_list.getLength();
                qs('#lang-name-prev>.lang-name-text').textContent = '';
                qs('#lang-name-next>.lang-name-text').textContent = game_lang_list.getItemByIndex(this.next_index).name;
                break;
            case LangBtnDir.RIGHT:
                this.next_index = (this.index - 1 + game_lang_list.getLength()) % game_lang_list.getLength();
                qs('#lang-name-prev>.lang-name-text').textContent = game_lang_list.getItemByIndex(this.next_index).name;
                qs('#lang-name-next>.lang-name-text').textContent = '';
                break;
            default:
                break;
        }
        for (let _ in range(this.timer_count)) {
            this.move();
        }
        this.stop();
    }
    start(direction) {
        return __awaiter(this, void 0, void 0, function* () {
            this.direction = direction;
            this.is_moving = true;
            this.spin = qs('#lang-name-body');
            this.step = Math.ceil(this.angle / this.timer_count);
            switch (this.direction) {
                case LangBtnDir.LEFT:
                    this.next_index = (this.index + 1) % game_lang_list.getLength();
                    qs('#lang-name-prev>.lang-name-text').textContent = '';
                    qs('#lang-name-next>.lang-name-text').textContent = game_lang_list.getItemByIndex(this.next_index).name;
                    break;
                case LangBtnDir.RIGHT:
                    this.next_index = (this.index - 1 + game_lang_list.getLength()) % game_lang_list.getLength();
                    qs('#lang-name-prev>.lang-name-text').textContent = game_lang_list.getItemByIndex(this.next_index).name;
                    qs('#lang-name-next>.lang-name-text').textContent = '';
                    break;
                default:
                    break;
            }
            for (let _ in range(this.timer_count)) {
                this.move();
                yield sleep(this.sleep_time);
            }
            this.stop();
        });
    }
    set(id) {
        let i = game_lang_list.indexOfKey(id);
        if (i === -1) {
            i = 0;
        }
        this.index = i;
        qs('#lang-name-prev>.lang-name-text').textContent = '';
        qs('#lang-name-cur>.lang-name-text').textContent = game_lang_list.getItemByIndex(this.index).name;
        qs('#lang-name-next>.lang-name-text').textContent = '';
    }
    get() {
        return game_lang_list.getItemByIndex(this.index).id;
    }
}
class ListDisplay {
    constructor(id_list = []) {
        this.data = id_list;
    }
    add(id) {
        if (this.data.indexOf(id) !== -1) {
            return;
        }
        this.data.push(id);
    }
    remove(id) {
        const index = this.data.indexOf(id);
        if (index === -1) {
            return;
        }
        this.data.splice(index, 1);
    }
}
class PassengerDisplay extends ListDisplay {
    constructor(id_list = []) {
        super(id_list);
    }
    getValidCount() {
        let count = 0;
        for (let id of this.data) {
            const psg = game_passenger_list.getById(id);
            if (psg !== null && psg.is_diaplay) {
                count += 1;
            }
        }
        return count;
    }
    getByIndex(index) {
        if (index < 0 || index >= this.data.length) {
            return null;
        }
        return game_passenger_list.getById(this.data[index]);
    }
    render(lang) {
        const psg_list = qs('#passenger-list');
        const psg_count = qs('#passenger-display-count');
        psg_count.innerHTML = this.getValidCount().toString();
        clearChildren(psg_list);
        for (let id of this.data) {
            const psg = game_passenger_list.getById(id);
            if (psg !== null && psg.is_diaplay) {
                let div = document.createElement('div');
                div.classList.add('passenger-item', 'noscrollbar');
                div.innerHTML = psg.name.get(lang);
                psg_list.appendChild(div);
            }
        }
    }
}
class TaskDisplay extends ListDisplay {
    constructor(id_list = []) {
        super(id_list);
    }
    getValidCount() {
        let count = 0;
        for (let id of this.data) {
            const tsk = game_task_list.getById(id);
            if (tsk !== null && (tsk.isActive() || tsk.isFinished())) {
                count += 1;
            }
        }
        return count;
    }
    getByIndex(index) {
        if (index < 0 || index >= this.data.length) {
            return null;
        }
        return game_task_list.getById(this.data[index]);
    }
    render(lang) {
        const tsk_container = qs('#task-container');
        clearChildren(tsk_container);
        for (let id of this.data) {
            const tsk = game_task_list.getById(id);
            if (tsk !== null && (tsk.isActive() || tsk.isFinished)) {
                let div = document.createElement('div');
                div.classList.add('task-item');
                if (tsk.isFinished()) {
                    div.classList.add('task-done-item');
                }
                div.innerHTML = tsk.description.get(lang);
                tsk_container.appendChild(div);
            }
        }
    }
}
class Game {
    constructor() {
        this.lang = game_default_lang;
        this.floor_buttons = [];
        this.cur_floor = 1;
        this.max_floor = 6;
        this.min_floor = -2;
        this.is_lifting = false;
        this.lift_interval = 200;
        this.lift_direction = FloorLiftStatus.NONE;
        this.cur_dest = 0;
        this.pending_queue = new PendingQueue();
        this.door = new Door();
        this.dots_animation = new WaitingDotsAnimation();
        this.floor_display = new FloorDisplay();
        this.save_panel = new SavePanel();
        this.language_display = new LanguageDisplay();
        this.ui_string = {};
        for (let key of Object.keys(game_ui_string_raw)) {
            this.ui_string[key] = new L10nText(game_ui_string_raw[key]);
        }
        this.passenger_display = new PassengerDisplay([]);
        this.task_display = new TaskDisplay([]);
    }
    static hideGoOnButton() {
        qs('#sheng-lue-dots').style.display = 'none';
        qs('#go-on-button-row').style.display = 'none';
    }
    static showGoOnButton() {
        qs('#sheng-lue-dots').style.display = 'flex';
        qs('#go-on-button-row').style.display = 'flex';
    }
    static hideOptions() {
        qs('#options-row').style.display = 'none';
    }
    static showOptions() {
        qs('#options-row').style.display = 'flex';
    }
    getCurrentFloor() {
        return game_floor_list.getById(`${this.cur_floor}_flr`);
    }
    static getTFIcon(icon_type) {
        if (icon_type) {
            let icon_t = document.createElement('div');
            icon_t.classList.add('save-opration-succ');
            for (let _ in range(2)) {
                icon_t.appendChild(document.createElement('div'));
            }
            return icon_t;
        }
        else {
            let icon_f = document.createElement('div');
            icon_f.classList.add('save-opration-fail');
            for (let _ in range(2)) {
                icon_f.appendChild(document.createElement('div'));
            }
            return icon_f;
        }
    }
    static createAvatar(psg_id, lang) {
        const psg = game_passenger_list.getById(psg_id);
        let pfp = document.createElement('div');
        pfp.classList.add('avatar');
        let pfp_text = document.createElement('div');
        pfp_text.classList.add('unselectable');
        if (psg !== null) {
            pfp_text.style.backgroundColor = psg.avatar_color;
            pfp_text.style.color = psg.avatar_font_color;
            pfp_text.innerHTML = psg.avatar_text.get(lang);
            pfp_text.setAttribute('lkey', psg.id);
        }
        pfp.appendChild(pfp_text);
        return pfp;
    }
    static createDialogElement(dialog, lang, is_not_first = true) {
        switch (dialog.layout) {
            case DialogLayout.LEFT:
                let l = document.createElement('div');
                l.classList.add('dialog-row', 'left-dialog-row');
                let l_box = document.createElement('div');
                l_box.classList.add('dialog-box', 'left-dialog-box');
                if (is_not_first) {
                    l_box.classList.add('left-not-first-line');
                }
                l_box.innerHTML = dialog.text.get(lang);
                l_box.setAttribute('lkey', dialog.id);
                if (!is_not_first) {
                    l.append(Game.createAvatar(dialog.person_id, lang));
                }
                l.append(l_box);
                return l;
            case DialogLayout.RIGHT:
                let r = document.createElement('div');
                r.classList.add('dialog-row', 'right-dialog-row');
                let r_box = document.createElement('div');
                r_box.classList.add('dialog-box', 'right-dialog-box');
                if (is_not_first) {
                    r_box.classList.add('right-not-first-line');
                }
                r_box.innerHTML = dialog.text.get(lang);
                r_box.setAttribute('lkey', dialog.id);
                r.append(r_box);
                if (!is_not_first) {
                    r.append(Game.createAvatar(dialog.person_id, lang));
                }
                return r;
            case DialogLayout.MIDDLE:
                let m = document.createElement('div');
                m.classList.add('dialog-row', 'mid-dialog-row');
                let m_box = document.createElement('div');
                m_box.classList.add('dialog-box', 'mid-dialog-box');
                m_box.innerHTML = dialog.text.get(lang);
                m_box.setAttribute('lkey', dialog.id);
                m.appendChild(m_box);
                return m;
            default:
                return null;
        }
    }
    static createOptionElement(opt, lang) {
        let opt_btn = document.createElement('div');
        opt_btn.classList.add('option-button', 'noscrollbar');
        opt_btn.setAttribute('next', opt.next_dialog_block_id);
        let opt_text = document.createElement('div');
        opt_text.classList.add('unselectable');
        opt_text.innerHTML = opt.text.get(lang);
        opt_text.setAttribute('lkey', opt.id);
        opt_btn.appendChild(opt_text);
        opt_btn.addEventListener('click', () => {
            Game.hideOptions();
            const next = opt_btn.getAttribute('next');
            const floor = game.getCurrentFloor();
            if (floor === null || next === null) {
                return;
            }
            floor.dialog_scene.addVisitedBlock(floor.dialog_scene.cur_block_id);
            floor.dialog_scene.cur_block_id = next;
            const block = floor.dialog_scene.getCurDialogBlock();
            if (block === null) {
                return;
            }
            block.resetIndex();
            Game.stepDialog(block, game.lang);
        });
        return opt_btn;
    }
    static renderDialog(dialog, lang, is_not_first = true) {
        const dialog_container = qs('#dialog-container');
        const dialog_ele = Game.createDialogElement(dialog, lang, is_not_first);
        if (dialog_ele !== null) {
            dialog_container.appendChild(dialog_ele);
            return true;
        }
        return false;
    }
    static renderSelect(select, lang) {
        Game.hideGoOnButton();
        const opt_row = qs('#options-row');
        clearChildren(opt_row);
        for (let opt of select.options) {
            opt_row.appendChild(Game.createOptionElement(opt, lang));
        }
        Game.showOptions();
    }
    static stepDialog(block, lang, is_do_action = true) {
        const item = block.getCurItem();
        if (item === null) {
            Game.hideOptions();
            block.stepIndex();
            Game.showGoOnButton();
            return;
        }
        if (item.isSelect()) {
            Game.renderSelect(item, lang);
            block.setIndexToEnd();
        }
        else {
            Game.hideOptions();
            Game.renderDialog(item, lang, block.isNotFirstLine());
            if (is_do_action) {
                item.doAction();
            }
            block.stepIndex();
            Game.showGoOnButton();
        }
    }
    static renderBlock(block, lang, is_render_all = true) {
        let pre_id = '';
        for (let i = 0; i < block.data.length; ++i) {
            if (!is_render_all && i >= block.cur_item_index) {
                if (i === 0) {
                    Game.stepDialog(block, lang, false);
                }
                break;
            }
            const item = block.getItemByIndex(i);
            if (item === null) {
                break;
            }
            if (item.isSelect()) {
                if (!is_render_all) {
                    Game.renderSelect(item, lang);
                    break;
                }
            }
            else {
                Game.hideOptions();
                if (Game.renderDialog(item, lang, pre_id === item.person_id)) {
                    pre_id = item.person_id;
                }
                Game.showGoOnButton();
            }
        }
    }
    renderFloor() {
        Game.hideGoOnButton();
        Game.hideOptions();
        const floor = this.getCurrentFloor();
        clearChildren(qs('#dialog-container'));
        if (floor === null) {
            return;
        }
        for (let block_id of floor.dialog_scene.visited_blocks) {
            const vis_block = floor.dialog_scene.getDialogBlock(block_id);
            if (vis_block !== null) {
                Game.renderBlock(vis_block, this.lang);
            }
        }
        const cur_block = floor.dialog_scene.getCurDialogBlock();
        if (cur_block !== null) {
            Game.renderBlock(cur_block, this.lang, false);
        }
        const bg = qs('#background');
        bg.style.backgroundColor = floor.background.bg_color;
        bg.innerHTML = floor.background.inner_html;
    }
    isLiftable() {
        return !(this.pending_queue.length() <= 0 ||
            this.lift_direction !== FloorLiftStatus.UP && this.lift_direction !== FloorLiftStatus.DOWN ||
            this.cur_dest > this.max_floor ||
            this.cur_dest < this.min_floor ||
            this.cur_dest === 0 ||
            this.cur_dest === this.cur_floor);
    }
    calcLiftDirection() {
        if (this.pending_queue.length() > 0) {
            if (this.pending_queue.length() === 1) {
                const dest = this.pending_queue.getMax().floor;
                this.lift_direction = dest > this.cur_floor ? FloorLiftStatus.UP : (dest < this.cur_floor ? FloorLiftStatus.DOWN : FloorLiftStatus.NONE);
                this.cur_dest = dest;
            }
            else {
                const top = this.pending_queue.getMax();
                const bottom = this.pending_queue.getMin();
                if (top.floor >= this.cur_floor &&
                    this.cur_floor >= bottom.floor) {
                    if (top.index <= bottom.index) {
                        this.lift_direction = FloorLiftStatus.UP;
                        this.cur_dest = top.floor;
                    }
                    else {
                        this.lift_direction = FloorLiftStatus.DOWN;
                        this.cur_dest = bottom.floor;
                    }
                }
                else if (bottom.floor >= this.cur_floor) {
                    this.lift_direction = FloorLiftStatus.UP;
                    this.cur_dest = top.floor;
                }
                else if (top.floor <= this.cur_floor) {
                    this.lift_direction = FloorLiftStatus.DOWN;
                    this.cur_dest = bottom.floor;
                }
                else {
                    this.lift_direction = FloorLiftStatus.NONE;
                    this.cur_dest = 0;
                }
            }
        }
        else {
            this.lift_direction = FloorLiftStatus.NONE;
            this.cur_dest = 0;
        }
    }
    checkPassingFloor() {
        return this.pending_queue.indexOf(this.cur_floor) !== -1;
    }
    lift() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.lift_direction !== FloorLiftStatus.UP && this.lift_direction !== FloorLiftStatus.DOWN) {
                return;
            }
            this.floor_display.updateIcon(this.lift_direction);
            this.is_lifting = true;
            lift_loop: do {
                switch (this.lift_direction) {
                    case FloorLiftStatus.UP:
                        this.cur_floor = Math.min(this.cur_floor + 1 === 0 ? 1 : this.cur_floor + 1, this.max_floor);
                        break;
                    case FloorLiftStatus.DOWN:
                        this.cur_floor = Math.max(this.cur_floor - 1 === 0 ? -1 : this.cur_floor - 1, this.min_floor);
                        break;
                    default:
                        break lift_loop;
                }
                this.floor_display.updateNumber(this.cur_floor);
                if (this.cur_floor === this.cur_dest) {
                    break;
                }
                if (this.cur_floor >= this.max_floor || this.cur_floor <= this.min_floor) {
                    break;
                }
                yield sleep(this.lift_interval);
            } while (!this.checkPassingFloor());
            this.pending_queue.remove(this.cur_floor);
            removeElementClass(qs(`.number-button[index="${this.cur_floor}"]`), 'button-selected');
            this.is_lifting = false;
            this.floor_display.updateIcon(FloorLiftStatus.NONE);
        });
    }
    checkBeforeLift() {
        this.pending_queue.remove(this.cur_floor);
        this.calcLiftDirection();
        if (this.isLiftable()) {
            this.lift();
        }
    }
    createFloorButtons() {
        const func_button_row = qs('#func-buttons');
        const button_container = qs('#floor-buttons');
        for (let child of Array.from(button_container.children)) {
            if (child.id !== 'func-buttons') {
                button_container.removeChild(child);
            }
        }
        this.floor_buttons = [];
        for (let i = this.max_floor - 1; i >= 1; i -= 2) {
            this.floor_buttons.push([
                new FloorButton(i, i.toString(), true),
                new FloorButton(i + 1, (i + 1) === this.max_floor ? '∞' : (i + 1).toString(), (i + 1) !== this.max_floor)
            ]);
        }
        for (let i = -2; i >= this.min_floor; i -= 2) {
            this.floor_buttons.push([
                new FloorButton(i + 1, (i + 1).toString(), true),
                new FloorButton(i, i === this.min_floor ? '-∞' : i.toString(), i !== this.min_floor)
            ]);
        }
        this.floor_buttons.forEach(button_row => {
            let row = document.createElement('div');
            row.classList.add('button-row');
            for (let button of button_row) {
                let col = document.createElement('div');
                col.classList.add('button-col', 'unselectable', 'number-button');
                if (!button.available) {
                    col.classList.add('invisible');
                }
                col.textContent = button.text;
                col.setAttribute('index', button.index.toString());
                row.appendChild(col);
            }
            button_container.insertBefore(row, func_button_row);
        });
    }
    encrypt() {
    }
    decipher() {
    }
    serializate() {
        return JSON.stringify({ status: true, data: {} });
    }
    deserializate(data) {
        data = data;
        return false;
    }
    switchUiLanguge() {
        for (let e of qsa('.l10n-text-ui')) {
            e.textContent = this.ui_string[e.getAttribute('lkey')].get(this.lang);
        }
    }
    switchTextLanguage() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        for (let e of qsa('.avatar>div[lkey]')) {
            e.innerHTML = (_c = (_b = game_passenger_list.getById((_a = e.getAttribute('lkey')) !== null && _a !== void 0 ? _a : '')) === null || _b === void 0 ? void 0 : _b.avatar_text.get(game.lang)) !== null && _c !== void 0 ? _c : '';
        }
        for (let e of qsa('.dialog-box[lkey]')) {
            const dlg_id = (_d = e.getAttribute('lkey')) !== null && _d !== void 0 ? _d : '';
            const [_, dbk_num] = Dialog.splitId(dlg_id);
            e.innerHTML =
                (_h = (_g = (_f = (_e = game.getCurrentFloor()) === null || _e === void 0 ? void 0 : _e.dialog_scene.getDialogBlock(`${dbk_num}_dbk`)) === null || _f === void 0 ? void 0 : _f.getItemById(dlg_id)) === null || _g === void 0 ? void 0 : _g.text.get(game.lang)) !== null && _h !== void 0 ? _h : '';
        }
        for (let e of qsa('.option-button>div[lkey]')) {
            const opt_id = (_j = e.getAttribute('lkey')) !== null && _j !== void 0 ? _j : '';
            const [_, slt_num] = SelectOption.splitId(opt_id);
            e.innerHTML =
                (_p = (_o = (_m = (_l = (_k = game.getCurrentFloor()) === null || _k === void 0 ? void 0 : _k.dialog_scene.getCurDialogBlock()) === null || _l === void 0 ? void 0 : _l.getItemById(`${slt_num}_slt`)) === null || _m === void 0 ? void 0 : _m.getOptionById(opt_id)) === null || _o === void 0 ? void 0 : _o.text.get(game.lang)) !== null && _p !== void 0 ? _p : '';
        }
    }
    initialize() {
        this.createFloorButtons();
        this.language_display.set(this.lang);
        this.switchUiLanguge();
        this.passenger_display.add(game_passenger_me);
        this.passenger_display.render(this.lang);
        this.dots_animation.start();
    }
    debug() {
        return __awaiter(this, void 0, void 0, function* () {
            this.renderFloor();
            this.door.syncStart(DoorDir.OPEN);
            Game.hideGoOnButton();
            qs('#options-row').style.display = 'none';
            qs('#save-text-area').value = '';
        });
    }
}
function clickSwitchLangButton(dir) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!game.language_display.is_moving) {
            yield game.language_display.start(dir);
            game.lang = game.language_display.get();
            game.switchUiLanguge();
            game.switchTextLanguage();
        }
    });
}
const binding_buttons = [
    {
        selector: '.number-button',
        is_single: false,
        func: (event) => {
            const class_name = 'button-selected';
            const index = parseInt(event.target.getAttribute('index'));
            if (!game.is_lifting && index === game.cur_floor) {
                return;
            }
            if (event.target.classList.contains(class_name)) {
                event.target.classList.remove(class_name);
                game.pending_queue.remove(index);
                if (index === game.cur_dest) {
                    game.calcLiftDirection();
                }
            }
            else {
                event.target.classList.add(class_name);
                game.pending_queue.add(index);
            }
            if (!game.is_lifting && !game.door.is_open) {
                game.checkBeforeLift();
            }
        }
    },
    {
        selector: '#close-button',
        is_single: true,
        func: () => __awaiter(void 0, void 0, void 0, function* () {
            if (!game.is_lifting &&
                game.door.is_open &&
                !game.door.is_moving) {
                yield game.door.start(DoorDir.CLOSE);
                game.checkBeforeLift();
            }
        })
    },
    {
        selector: '#open-button',
        is_single: true,
        func: () => __awaiter(void 0, void 0, void 0, function* () {
            if (!game.is_lifting &&
                !game.door.is_open &&
                !game.door.is_moving) {
                game.renderFloor();
                yield game.door.start(DoorDir.OPEN);
            }
        })
    },
    {
        selector: '#go-on-button-row',
        is_single: true,
        func: () => { }
    },
    {
        selector: '#top-arch',
        is_single: true,
        func: () => __awaiter(void 0, void 0, void 0, function* () {
            if (!game.save_panel.is_moving) {
                if (game.save_panel.is_open) {
                    game.save_panel.start(SavePanelDir.CLOSE);
                }
                else {
                    game.save_panel.start(SavePanelDir.OPEN);
                }
            }
        })
    },
    {
        selector: '#save-export-button-warp',
        is_single: true,
        func: () => {
            clearChildren(qs('#save-export-button'));
            clearChildren(qs('#save-import-button'));
            const res = JSON.parse(game.serializate());
            qs('#save-export-button').appendChild(Game.getTFIcon(res.status));
            if (res.status) {
                qs('#save-text-area').value = JSON.stringify(res.data);
            }
        }
    },
    {
        selector: '#save-import-button-warp',
        is_single: true,
        func: () => {
            clearChildren(qs('#save-export-button'));
            clearChildren(qs('#save-import-button'));
            const text = qs('#save-text-area').value;
            qs('#save-import-button').appendChild(Game.getTFIcon(game.deserializate(text)));
        }
    },
    {
        selector: '#save-copy-button',
        is_single: true,
        func: () => __awaiter(void 0, void 0, void 0, function* () {
            yield navigator.clipboard.writeText(qs('#save-text-area').value);
        })
    },
    {
        selector: '#lang-switch-button-l',
        is_single: true,
        func: () => __awaiter(void 0, void 0, void 0, function* () {
            yield clickSwitchLangButton(LangBtnDir.LEFT);
        })
    },
    {
        selector: '#lang-switch-button-r',
        is_single: true,
        func: () => __awaiter(void 0, void 0, void 0, function* () {
            yield clickSwitchLangButton(LangBtnDir.RIGHT);
        })
    },
    {
        selector: '#go-on-button-row',
        is_single: true,
        func: () => {
            var _a;
            const block = (_a = game.getCurrentFloor()) === null || _a === void 0 ? void 0 : _a.dialog_scene.getCurDialogBlock();
            if (!block) {
                return;
            }
            Game.stepDialog(block, game.lang);
        }
    }
];
function bindButtonFunctions() {
    for (let bind of binding_buttons) {
        if (bind.is_single) {
            qs(bind.selector).addEventListener('click', bind.func);
        }
        else {
            for (let button of Array.from(qsa(bind.selector))) {
                button.addEventListener('click', bind.func);
            }
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    game.initialize();
    bindButtonFunctions();
});
const game_lang_list = new LanguageList([
    { id: 'zh_cn', name: '中文' },
    { id: 'en', name: 'EN' }
]);
const game_default_lang = 'zh_cn';
const game_signature_list = new SignatureList([]);
const game_action_list = new GameActionList([]);
const game_task_list = new GameTaskList([]);
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
]);
const game_passenger_me = 'me_psg';
const game_plot_thread_list = new PlotThreadList([]);
const game_floor_list = new FloorList([
    {
        id: '1_flr',
        dialog_scene: {
            id: '1_dsc',
            blocks: [
                {
                    id: 'A01_dbk',
                    in_signatures: [],
                    dialogs: [
                        {
                            person_id: 'me_psg',
                            text: { zh_cn: '我超', en: 'ong' },
                            layout: DialogLayout.RIGHT
                        }, {
                            person_id: 'me_psg',
                            text: { zh_cn: '什么情况', en: 'wat happened' },
                            layout: DialogLayout.RIGHT,
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
                    in_signatures: [],
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
]);
const game_ui_string_raw = {
    'PERSON_NUM': { zh_cn: '人数', en: 'Persons' },
    'COPY': { zh_cn: '复制', en: 'COPY' },
    'IMPORT': { zh_cn: '导入', en: 'IMP' },
    'EXPORT': { zh_cn: '导出', en: 'EXP' }
};
const game = new Game();
//# sourceMappingURL=elev.js.map