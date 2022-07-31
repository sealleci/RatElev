declare function sleep(time: number): Promise<unknown>;
declare function range(...args: number[]): number[];
declare function clearChildren(elem: HTMLElement): void;
declare function toggleElementClass(elem: HTMLElement, class_name: string): void;
declare function addElementClass(elem: HTMLElement, class_name: string): void;
declare function removeElementClass(elem: HTMLElement, class_name: string): void;
declare const qs: (selector: any) => HTMLElement;
declare const qsa: (selector: any) => NodeListOf<HTMLElement>;
declare class WaitingDotsAnimation {
    private dots;
    private orders;
    private step;
    private timer;
    private interval;
    constructor();
    generateOrders(num: number): number[][];
    toggle(dot: HTMLElement, type: number): void;
    start(): void;
    stop(): void;
}
declare class FloorButton {
    index: number;
    text: string;
    available: boolean;
    selected: boolean;
    constructor(index: number, text: string, available: boolean);
}
declare class Door {
    is_moving: boolean;
    is_open: boolean;
    private direction;
    private timer_count;
    private sleep_time;
    private l_part;
    private r_part;
    private step;
    constructor();
    stop(): void;
    move(): void;
    syncStart(direction: string): void;
    start(direction: string): Promise<void>;
}
interface NaturalLanguage {
    key: string | symbol;
    name: string;
}
declare class LanguageList {
    private data;
    constructor(data: NaturalLanguage[]);
    length(): number;
    isKeyIn(key: string | symbol): boolean;
    indexOfKey(key: string | symbol): number;
    getItemByIndex(index: number): NaturalLanguage;
    getItemByKey(key: string | symbol): NaturalLanguage | null;
    getNameByKey(key: string | symbol): string;
}
declare const default_lang = "zh_cn";
declare const supported_langs: LanguageList;
interface L10NTextDict {
    [key: string | symbol]: string;
}
declare class L10nText {
    private data;
    constructor(data: L10NTextDict);
    get(key: string | symbol): string;
    set(key: string | symbol, value: string): void;
}
declare class Passenger {
    id: number;
    name: L10nText;
    avatar_color: string;
    avatar_font_color: string;
    avatar_text: L10nText;
    constructor(id: number, name: L10nText, avatar_color: string, avatar_font_color: string, avatar_text: L10nText);
}
declare class Dialog {
    person_id: number;
    text: string;
    constructor(person_id: number, text: string);
}
declare class DialogBlock {
    data: Dialog[];
    constructor();
}
declare class Task {
    constructor();
}
declare class Floor {
    id: number;
    dialogs: {
        [index: number]: DialogBlock;
    };
    constructor(id: number);
}
interface PendingFloor {
    index: number;
    floor: number;
}
declare class PendingQueue {
    data: PendingFloor[];
    constructor();
    sort(): void;
    length(): number;
    indexOf(value: number): number;
    add(value: number): void;
    remove(value: number): void;
    getMax(): PendingFloor;
    getMin(): PendingFloor;
}
declare class FloorDisplay {
    private display_number;
    private up_icon;
    private down_icon;
    constructor();
    updateIcon(state: string): void;
    updateNumber(num: number): void;
}
declare class SavePanel {
    is_moving: boolean;
    is_open: boolean;
    private direction;
    private timer_count;
    private sleep_time;
    private cover;
    private step;
    constructor();
    stop(): void;
    move(): void;
    syncStart(direction: string): void;
    start(direction: string): Promise<void>;
}
declare class LanguageDisplay {
    private index;
    private next_index;
    is_moving: boolean;
    private direction;
    private angle;
    private ori_angle;
    private timer_count;
    private sleep_time;
    private spin;
    private step;
    private counter;
    constructor();
    stop(): void;
    move(): void;
    syncStart(direction: string): void;
    start(direction: string): Promise<void>;
    set(key: string | symbol): void;
    get(): string | symbol;
}
interface SaveDataType {
}
interface SaveRootType {
    status: boolean;
    data: SaveDataType;
}
declare class Game {
    lang: string | symbol;
    floor_buttons: FloorButton[][];
    cur_floor_id: number;
    max_floor: number;
    min_floor: number;
    is_lifting: boolean;
    private lift_interval;
    private lift_direction;
    cur_dest: number;
    pending_queue: PendingQueue;
    door: Door;
    floors: Floor[];
    dots_animation: WaitingDotsAnimation;
    floor_display: FloorDisplay;
    save_panel: SavePanel;
    language_display: LanguageDisplay;
    characters: Passenger[];
    ui_string: {
        [key: string]: L10nText;
    };
    constructor();
    getTFIcon(type: boolean): HTMLElement;
    getFloorById(id: number): Floor | null;
    renderFloor(): void;
    isLiftable(): boolean;
    calcLiftDirection(): void;
    checkPassingFloor(): boolean;
    lift(): Promise<void>;
    checkBeforeLift(): void;
    createFloorButtons(): void;
    encrypt(): void;
    decipher(): void;
    serializate(): string;
    deserializate(data: string): boolean;
    updateUIStrings(): void;
    initialize(): void;
    debug(): Promise<void>;
}
declare const game: Game;
interface BindingButton {
    selector: string;
    is_single: boolean;
    func(this: HTMLElement, event: MouseEvent): void;
}
declare const binding_buttons: BindingButton[];
declare function bindFunctionToButtons(): void;
