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
function getRandomInt(min, max) {
    if (max === undefined) {
        max = min;
        min = 0;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
function flattenNestArray(nest_array) {
    function flatten2DArray(array) {
        return [].concat(...array);
    }
    return flatten2DArray(nest_array.map(x => Array.isArray(x) ? flattenNestArray(x) : [x]));
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
    toString() {
        return `[${this.data.map(s => s.toString()).join(',')}]`;
    }
}
class LanguageList extends AbstractList {
    constructor(data) {
        super();
        this.data = data;
    }
    isKeyIn(id) {
        return this.data.map(x => x.id).indexOf(id) !== -1;
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
        return '{' + Object.keys(this.data).map(key => `"${key}":"${this.get(key)}"`).join(',') + '}';
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
        return `{"id":"${this.id}","status":"${this.status.toString()}"}`;
    }
    static convertStatus(status) {
        return status === 'active' ? SignatureStatus.ACTIVE : SignatureStatus.DEACTIVE;
    }
}
class SignatureList extends AbstractList {
    constructor(signatures) {
        var _a;
        super();
        for (let signature of signatures) {
            this.data.push(new Signature(signature.id, (_a = signature.status) !== null && _a !== void 0 ? _a : SignatureStatus.DEACTIVE));
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
    toString() {
        return `{"id":"${this.id}","status":"${this.status.toString()}"}`;
    }
    static convertStatus(status) {
        return status === 'active' ? TaskStatus.ACTIVE : status === 'finished' ? TaskStatus.FINISHED : TaskStatus.DEACTIVE;
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
    static genStepPlotThredAct(id) {
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
    getLength() {
        return this.data.length;
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
            cur.person_id === pre.person_id &&
            cur.layout === pre.layout) {
            return true;
        }
        return false;
    }
    isFinished() {
        return this.cur_item_index >= this.data.length;
    }
    isUnlocked() {
        for (let id of this.in_signatures) {
            const sig = game_signature_list.getById(id);
            if (!(sig === null || sig === void 0 ? void 0 : sig.isActive())) {
                return false;
            }
        }
        return true;
    }
    isLastItemNotSelect() {
        if (this.data.length <= 0) {
            return false;
        }
        return !this.data[this.data.length - 1].isSelect();
    }
    toString() {
        return `{"id":"${this.id}","cur_item_index":${this.cur_item_index}}`;
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
        this.cur_block_id = '';
        this.visited_blocks = [];
    }
    isInclduingBlock(id) {
        for (let block of this.dialog_blocks) {
            if (block.id === id) {
                return true;
            }
        }
        return false;
    }
    setCurDialogBlock(id) {
        if (this.isInclduingBlock(id)) {
            this.cur_block_id = id;
        }
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
        return `{"id":"${this.id}","cur_block_id":"${this.cur_block_id}","visited_blocks":[${this.visited_blocks.map(x => `"${x}"`).join(',')}],"dialog_blocks":[${this.dialog_blocks.map(x => x.toString()).join(',')}]}`;
    }
}
class Floor {
    constructor(id, scene, plot_id_list, background = null) {
        this.id = id;
        this.dialog_scene = new DialogScene(scene.id, scene.blocks);
        this.plot_id_list = plot_id_list;
        this.background = background !== null && background !== void 0 ? background : { bg_color: 'rgba(0, 0, 0, .7)', inner_html: '' };
    }
    checkPlotThreads() {
        var _a, _b, _c;
        let selected_block_id = '';
        let max_prioeity = -Infinity;
        for (let plot_id of this.plot_id_list) {
            const plot = game_plot_thread_list.getById(plot_id);
            if (plot === null || !plot.isUnlocked() || plot.isFinished() || plot.getCurFloorId() !== this.id) {
                continue;
            }
            let signature_id = plot.getCurSignatureId();
            let is_set = false;
            for (let block_id of Object.keys(this.dialog_scene.dialog_in_dict)) {
                if (this.dialog_scene.dialog_in_dict[block_id].indexOf(signature_id) === -1) {
                    continue;
                }
                const block = this.dialog_scene.getDialogBlock(block_id);
                if (block === null || !block.isUnlocked() || this.dialog_scene.cur_block_id === block.id) {
                    continue;
                }
                if (block.isFinished()) {
                    plot.step();
                    continue;
                }
                if (plot.priority > max_prioeity && !is_set) {
                    selected_block_id = block.id;
                    max_prioeity = plot.priority;
                    is_set = true;
                }
            }
        }
        console.log(`slt: ${selected_block_id},\ncur: ${this.dialog_scene.cur_block_id},\nis_cur_finish: ${(_a = this.dialog_scene.getCurDialogBlock()) === null || _a === void 0 ? void 0 : _a.isFinished()}`);
        if (this.dialog_scene.cur_block_id === '' || (((_b = this.dialog_scene.getCurDialogBlock()) === null || _b === void 0 ? void 0 : _b.isFinished()) && ((_c = this.dialog_scene.getCurDialogBlock()) === null || _c === void 0 ? void 0 : _c.isLastItemNotSelect()))) {
            if (this.dialog_scene.cur_block_id !== '') {
                this.dialog_scene.addVisitedBlock(this.dialog_scene.cur_block_id);
            }
            this.dialog_scene.setCurDialogBlock(selected_block_id);
        }
        return selected_block_id !== '';
    }
    toString() {
        return `{"id":"${this.id}","dialog_scene":${this.dialog_scene.toString()}}`;
    }
}
class FloorList extends AbstractList {
    constructor(floors) {
        var _a;
        super();
        for (let floor of floors) {
            this.data.push(new Floor(floor.id, floor.dialog_scene, floor.plot_id_list, (_a = floor.background) !== null && _a !== void 0 ? _a : null));
        }
    }
}
class PlotThread {
    constructor(id, priority, signature_floor_list, in_signatures = []) {
        this.id = id;
        this.priority = priority;
        this.signature_floor_dict = {};
        this.signatures = [];
        for (let item of signature_floor_list) {
            this.signature_floor_dict[item.signature] = item.floor;
            this.signatures.push(item.signature);
        }
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
    getCurFloorId() {
        if (this.cur_signature_index < 0 ||
            this.cur_signature_index >= this.signatures.length ||
            Object.keys(this.signature_floor_dict).indexOf(this.signatures[this.cur_signature_index]) === -1) {
            return '';
        }
        return this.signature_floor_dict[this.signatures[this.cur_signature_index]];
    }
    getCurSignatureId() {
        if (this.cur_signature_index < 0 ||
            this.cur_signature_index >= this.signatures.length) {
            return '';
        }
        return this.signatures[this.cur_signature_index];
    }
    getSignatureById(index) {
        if (index < 0 || index >= this.signatures.length) {
            return null;
        }
        return game_signature_list.getById(this.signatures[index]);
    }
    getCurSignature() {
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
        if (this.cur_signature_index < this.signatures.length) {
            return false;
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
            this.data.push(new PlotThread(thread.id, thread.priority, thread.signature_floor_list, thread.in_signatures));
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
    constructor(index, text, is_available) {
        this.index = index;
        this.text = text;
        this.is_available = is_available;
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
    clear() {
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
        this.display_number = null;
        this.up_icon = null;
        this.down_icon = null;
        FloorDisplay.random_timer = undefined;
        FloorDisplay.pre_number = undefined;
    }
    updateIcon(status) {
        if (this.up_icon === null) {
            this.up_icon = qs('#up-icon');
        }
        if (this.down_icon === null) {
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
        if (this.display_number === null) {
            this.display_number = qs('#display-number');
        }
        this.display_number.textContent = num.toString();
    }
    static startRandomDisplay() {
        var _a, _b;
        FloorDisplay.pre_number = (_b = parseInt((_a = qs('#display-number').textContent) !== null && _a !== void 0 ? _a : '')) !== null && _b !== void 0 ? _b : 0;
        FloorDisplay.random_timer = setInterval(() => {
            const display = qs('#display-number');
            if (display !== null) {
                display.textContent = getRandomInt(-99, 99).toString();
            }
        }, 200);
    }
    static stopRandomDisplay() {
        var _a;
        if (FloorDisplay.random_timer) {
            clearInterval(FloorDisplay.random_timer);
            const display = qs('#display-number');
            if (display !== null) {
                display.textContent = ((_a = FloorDisplay.pre_number) !== null && _a !== void 0 ? _a : 0).toString();
            }
        }
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
    toString() {
        return `[${this.data.map(x => `"${x}"`).join(',')}]`;
    }
    reset(data) {
        this.data = data;
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
class EncryptTool {
    static encrypt(raw) {
        return btoa(encodeURIComponent(raw));
    }
    static decipher(encrypted) {
        return decodeURIComponent(atob(encrypted));
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
    static jumpToBottom() {
        const dlg_cn = qs('#dialog-container');
        dlg_cn.scrollTop = dlg_cn.scrollHeight;
    }
    static hideJumpButton() {
        qs('#jump-button').style.display = 'none';
    }
    static showJumpButton() {
        qs('#jump-button').style.display = 'flex';
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
    static disableFloorButtons() {
        qsa('.button-col').forEach(button => {
            button.classList.add('unclickable');
        });
    }
    static enableFloorButtons() {
        qsa('.button-col').forEach(button => {
            button.classList.remove('unclickable');
        });
    }
    static disableSaveButtons() {
        qsa('.save-button-wrap').forEach(button => {
            button.classList.add('unclickable');
        });
    }
    static enableSaveButtons() {
        qsa('.save-button-wrap').forEach(button => {
            button.classList.remove('unclickable');
        });
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
    static checkWhenBlockFinish(floor, block) {
        if (block.isFinished() && block.isLastItemNotSelect()) {
            Game.hideOptions();
            if (floor.checkPlotThreads()) {
                Game.showGoOnButton();
            }
            else {
                Game.hideGoOnButton();
            }
            if (block.id !== floor.dialog_scene.cur_block_id) {
                floor.dialog_scene.addVisitedBlock(block.id);
            }
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
            Game.renderBrElement();
            floor.dialog_scene.addVisitedBlock(floor.dialog_scene.cur_block_id);
            floor.dialog_scene.setCurDialogBlock(next);
            const block = floor.dialog_scene.getCurDialogBlock();
            if (block === null) {
                return;
            }
            block.resetIndex();
            Game.stepDialog(block, game.lang);
            Game.checkWhenBlockFinish(floor, block);
            Game.jumpToBottom();
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
            if (!block.isFinished()) {
                Game.hideOptions();
                block.stepIndex();
                Game.showGoOnButton();
            }
            else {
                Game.hideOptions();
                Game.hideGoOnButton();
            }
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
            if (!block.isFinished()) {
                Game.showGoOnButton();
            }
            else {
                Game.renderBrElement();
                Game.hideGoOnButton();
            }
        }
    }
    static renderBrElement() {
        let br_row = document.createElement('div');
        br_row.classList.add('dialog-row', 'mid-dialog-row');
        let br_element = document.createElement('div');
        br_element.classList.add('block-br');
        br_row.appendChild(br_element);
        qs('#dialog-container').appendChild(br_row);
    }
    static renderBlock(block, lang, is_render_all = true) {
        let pre_id = '';
        for (let i = 0; i < block.getLength(); ++i) {
            if (!is_render_all && i >= block.cur_item_index) {
                if (i === 0) {
                    Game.hideOptions();
                    if (!is_render_all) {
                        Game.showGoOnButton();
                    }
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
                if (!is_render_all) {
                    Game.showGoOnButton();
                }
            }
        }
        if (block.getLength() > 0 && is_render_all) {
            Game.renderBrElement();
        }
    }
    getCurDestination() {
        return this.cur_dest;
    }
    renderFloor() {
        Game.hideGoOnButton();
        Game.hideOptions();
        clearChildren(qs('#dialog-container'));
        const floor = this.getCurrentFloor();
        if (floor === null) {
            return;
        }
        floor.checkPlotThreads();
        const bg = qs('#background');
        bg.style.backgroundColor = floor.background.bg_color;
        bg.innerHTML = floor.background.inner_html;
        for (let block_id of floor.dialog_scene.visited_blocks) {
            const vis_block = floor.dialog_scene.getDialogBlock(block_id);
            if (vis_block !== null) {
                Game.renderBlock(vis_block, this.lang);
            }
        }
        const cur_block = floor.dialog_scene.getCurDialogBlock();
        if (cur_block !== null && floor.dialog_scene.visited_blocks.indexOf(cur_block.id) === -1) {
            Game.renderBlock(cur_block, this.lang, false);
            if (cur_block.isFinished()) {
                Game.hideGoOnButton();
                if (cur_block.isLastItemNotSelect()) {
                    Game.renderBrElement();
                }
            }
        }
        Game.hideJumpButton();
        Game.jumpToBottom();
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
    }
    renderFloorButtons() {
        const func_button_row = qs('#func-buttons');
        const button_container = qs('#floor-buttons');
        for (let child of Array.from(button_container.children)) {
            if (child.id !== 'func-buttons') {
                button_container.removeChild(child);
            }
        }
        this.floor_buttons.forEach(button_row => {
            let row = document.createElement('div');
            row.classList.add('button-row');
            for (let button of button_row) {
                let col = document.createElement('div');
                col.classList.add('button-col', 'unselectable', 'number-button');
                if (!button.is_available) {
                    col.classList.add('invisible');
                }
                col.textContent = button.text;
                col.setAttribute('index', button.index.toString());
                row.appendChild(col);
            }
            button_container.insertBefore(row, func_button_row);
        });
    }
    serializate() {
        return EncryptTool.encrypt(`{"signatures":${game_signature_list.toString()},"tasks":${game_task_list.toString()},"floors":${game_floor_list.toString()},"game":${this.toString()}}`);
    }
    deserializate(encrypted) {
        let is_catch = false;
        try {
            const json_data = JSON.parse(EncryptTool.decipher(encrypted));
            for (let signature_json of json_data.signatures) {
                const signature = game_signature_list.getById(signature_json.id);
                if (signature !== null) {
                    signature.status = Signature.convertStatus(signature_json.status);
                }
            }
            for (let task_json of json_data.tasks) {
                const task = game_task_list.getById(task_json.id);
                if (task !== null) {
                    task.status = GameTask.convertStatus(task_json.status);
                }
            }
            for (let floor_json of json_data.floors) {
                const floor = game_floor_list.getById(floor_json.id);
                if (floor === null) {
                    continue;
                }
                if (floor.dialog_scene.id !== floor_json.dialog_scene.id) {
                    continue;
                }
                floor.dialog_scene.setCurDialogBlock(floor_json.dialog_scene.cur_block_id);
                floor.dialog_scene.visited_blocks = floor_json.dialog_scene.visited_blocks;
                for (let block_json of floor_json.dialog_scene.dialog_blocks) {
                    const block = floor.dialog_scene.getDialogBlock(block_json.id);
                    if (block === null) {
                        continue;
                    }
                    block.cur_item_index = block_json.cur_item_index;
                }
            }
            this.lang = json_data.game.lang;
            for (let rows of this.floor_buttons) {
                for (let number_button of rows) {
                    let position = json_data.game.floor_buttons.map(x => x.index).indexOf(number_button.index);
                    if (position === -1) {
                        continue;
                    }
                    number_button.is_available = json_data.game.floor_buttons[position].is_available;
                    const num_btn = qs(`.number-button[index="${number_button.index}"]`);
                    if (num_btn === null) {
                        continue;
                    }
                    if (number_button.is_available) {
                        num_btn.classList.remove('invisible');
                    }
                }
            }
            this.cur_floor = json_data.game.cur_floor;
            this.is_lifting = false;
            this.lift_direction = FloorLiftStatus.NONE;
            this.cur_dest = 0;
            this.pending_queue.clear();
            qsa('.number-button').forEach(button => { button.classList.remove('button-selected'); });
            this.floor_display.updateNumber(this.cur_floor);
            this.passenger_display.reset(json_data.game.passenger_display);
            this.task_display.reset(json_data.game.task_display);
            this.language_display.set(this.lang);
            this.switchUiLanguge();
            this.passenger_display.render(this.lang);
            this.task_display.render(this.lang);
        }
        catch (err) {
            is_catch = true;
            console.log(`Deserialization error: ${err.message}`);
        }
        if (!is_catch) {
            if (this.door.is_open) {
                this.door.syncStart(DoorDir.CLOSE);
            }
            Game.hideGoOnButton();
            Game.hideOptions();
            clearChildren(qs('#dialog-container'));
        }
        return !is_catch;
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
        this.passenger_display.render(this.lang);
        this.task_display.render(this.lang);
    }
    isFloorButtonAvailableByIndex(index) {
        const flatten_arr = flattenNestArray(this.floor_buttons);
        const find_index = flatten_arr.map(x => x.index).indexOf(index);
        if (find_index === -1) {
            return false;
        }
        return flatten_arr[find_index].is_available;
    }
    initialize() {
        this.createFloorButtons();
        this.renderFloorButtons();
        this.language_display.set(this.lang);
        this.switchUiLanguge();
        this.floor_display.updateNumber(this.cur_floor);
        this.passenger_display.add(game_passenger_me);
        this.passenger_display.render(this.lang);
        this.dots_animation.start();
    }
    debug() {
        return __awaiter(this, void 0, void 0, function* () {
            qs('#open-button').click();
            qs('#top-arch').click();
            qs('#go-on-button-row').click();
        });
    }
    toString() {
        return `{"lang":"${this.lang}","cur_floor": ${this.cur_floor},"floor_buttons": [${flattenNestArray(this.floor_buttons).filter(x => x.index === this.max_floor || x.index === this.min_floor).map(x => `{"index":${x.index},"is_available":${x.is_available}}`).join(',')}],"passenger_display":${this.passenger_display.toString()},"task_display":${this.task_display.toString()}}`;
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
            if (!game.isFloorButtonAvailableByIndex(index)) {
                return;
            }
            if (!game.is_lifting && index === game.cur_floor) {
                return;
            }
            if (event.target.classList.contains(class_name)) {
                event.target.classList.remove(class_name);
                game.pending_queue.remove(index);
                if (index === game.getCurDestination()) {
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
        selector: '#save-export-button-wrap',
        is_single: true,
        func: () => {
            clearChildren(qs('#save-export-button'));
            clearChildren(qs('#save-import-button'));
            let is_catch = false;
            try {
                qs('#save-text-area').value = game.serializate();
            }
            catch (err) {
                is_catch = true;
                console.log(`Serialization error: ${err.message}`);
            }
            qs('#save-export-button').appendChild(Game.getTFIcon(!is_catch));
        }
    },
    {
        selector: '#save-import-button-wrap',
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
            const cur_floor = game.getCurrentFloor();
            if (cur_floor !== null) {
                Game.checkWhenBlockFinish(cur_floor, block);
            }
            Game.jumpToBottom();
        }
    },
    {
        selector: '#jump-button',
        is_single: true,
        func: () => {
            Game.jumpToBottom();
            Game.hideJumpButton();
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
function addDialogScrollListener() {
    const dialog_container = qs('#dialog-container');
    dialog_container.addEventListener('scroll', () => {
        if (dialog_container.scrollTop + dialog_container.offsetHeight <= dialog_container.scrollHeight - dialog_container.offsetHeight / 2) {
            Game.showJumpButton();
        }
        else {
            Game.hideJumpButton();
        }
    });
}
document.addEventListener('DOMContentLoaded', () => {
    game.initialize();
    bindButtonFunctions();
    addDialogScrollListener();
    game.debug();
});
const game_lang_list = new LanguageList([
    { id: 'zh_cn', name: '中文' },
    { id: 'en', name: 'EN' }
]);
const game_default_lang = 'zh_cn';
const game_task_list = new GameTaskList([
    {
        id: 'skate_tsk',
        description: { zh_cn: '霜杰想向朋友借一块滑板。', en: 'Jacob wants to borrow a skateboard from his friend.' },
    }
]);
const game_action_list = new GameActionList([
    {
        id: 'naked1_act',
        action: GameAction.polyActs(GameAction.genActiveTaskAct('skate_tsk'), GameAction.genAddPassengerAct('jacob_psg'), GameAction.genActivateSignatureAct('naked.meet_sig'), GameAction.genStepPlotThredAct('naked_plt'))
    },
    {
        id: 'naked2#1_act',
        action: GameAction.polyActs(GameAction.genRemovePassengerAct('jacob_psg'))
    },
    {
        id: 'naked2#2_act',
        action: GameAction.polyActs(GameAction.genActivateSignatureAct('naked.call_sig'), GameAction.genStepPlotThredAct('naked_plt'))
    },
    {
        id: 'naked3.1_act',
        action: GameAction.polyActs(GameAction.genAddPassengerAct('jacon_psg'), GameAction.genActivateSignatureAct('naked.mask_sig'), GameAction.genStepPlotThredAct('naked_plt'))
    },
    {
        id: 'naked3.2_act',
        action: GameAction.polyActs(GameAction.genFinishTaskAct('skate_tsk'))
    },
    {
        id: 'peach.start_act',
        action: GameAction.polyActs(Game.disableFloorButtons, Game.disableSaveButtons, FloorDisplay.startRandomDisplay, () => { var _a; (_a = qs('#background')) === null || _a === void 0 ? void 0 : _a.classList.add('color-flash'); })
    },
    {
        id: 'peach.stop_act',
        action: GameAction.polyActs(Game.enableFloorButtons, Game.enableSaveButtons, FloorDisplay.stopRandomDisplay, () => { var _a; (_a = qs('#background')) === null || _a === void 0 ? void 0 : _a.classList.remove('color-flash'); })
    }
]);
const game_signature_list = new SignatureList([
    { id: 'naked.enter_sig', status: SignatureStatus.ACTIVE },
    { id: 'naked.meet_sig' },
    { id: 'naked.call_sig' },
    { id: 'naked.mask_sig' },
    { id: 'naked.berserk_sig' },
    { id: 'naked.kill_sig' },
    { id: 'peach_sig', status: SignatureStatus.ACTIVE }
]);
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
]);
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
    }
]);
const game_passenger_me = 'me_psg';
const bg_colors = {
    f1: '#343434',
    f2: '#2E0249',
    f3: '#393232'
};
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
            bg_color: bg_colors['f3'],
            inner_html: ''
        },
        dialog_scene: {
            id: '3_dsc',
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
                            text: { zh_cn: '在小女孩唱出第一句歌词后，你发觉电梯轿厢里的重力的减弱了', en: 'After the little girl sang the first lyrics, you found that the gravity in the elevator was reduced' },
                            layout: DialogLayout.MIDDLE,
                            action_id: 'peach.start_act'
                        },
                        {
                            person_id: '&_psg',
                            text: { zh_cn: '楼层显示板上的数值开始抖动抽搐，而且所有按钮都失效了', en: 'The floor display panel began to show random numbers, and all the buttons didn\'t work anymore' },
                            layout: DialogLayout.MIDDLE
                        },
                        {
                            person_id: '&_psg',
                            text: { zh_cn: '然后你发现在电梯里镜子中，也有一个镜像猫耳小女孩在疯狂地跳舞', en: 'Then you found that in the mirror of the elevator, there was another little girl dancing crazily' },
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
                            text: { zh_cn: '绯红档案好玩喵', en: 'Scarlet Documentation is a good game nya' },
                            layout: DialogLayout.LEFT
                        },
                        {
                            person_id: 'peach_psg',
                            text: { zh_cn: '鼠蕾娜可爱喵', en: 'Ratrana is cute nya' },
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
                            layout: DialogLayout.RIGHT
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
            id: '2_dsc',
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
                            layout: DialogLayout.LEFT,
                            action_id: 'naked2#1_act'
                        },
                        {
                            person_id: '&_psg',
                            text: { zh_cn: '霜杰走出电梯轿厢，然后径直地向前走去，在正对着电梯门的那扇门前停了下来', en: 'Jacob walked out of the elevator, walked straight forward and stopped in front of the door facing the elevator' },
                            layout: DialogLayout.MIDDLE
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
                            text: { zh_cn: '我先溜了', en: 'i have to go first' },
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
]);
const game_ui_string_raw = {
    'PERSON_NUM': { zh_cn: '人数', en: 'Persons' },
    'COPY': { zh_cn: '复制', en: 'COPY' },
    'IMPORT': { zh_cn: '导入', en: 'IMPORT' },
    'EXPORT': { zh_cn: '导出', en: 'EXPORT' },
    'JUMP_BUTTON': { zh_cn: '跳转至最新对话', en: 'Jump to present' }
};
const game = new Game();
//# sourceMappingURL=elev.js.map