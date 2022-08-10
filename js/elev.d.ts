declare function sleep(time: number): Promise<unknown>;
declare function range(...args: number[]): number[];
declare function clearChildren(elem: HTMLElement): void;
declare function toggleElementClass(elem: HTMLElement, class_name: string): void;
declare function addElementClass(elem: HTMLElement, class_name: string): void;
declare function removeElementClass(elem: HTMLElement, class_name: string): void;
declare function padLeftZero(num: number): string;
declare function getNumFromId(id: string): string;
declare const qs: (selector: any) => HTMLElement;
declare const qsa: (selector: any) => NodeListOf<HTMLElement>;
interface IdClass {
    id: string;
}
declare abstract class AbstractList<T extends IdClass> {
    protected data: T[];
    constructor();
    getLength(): number;
    isIncluding(id: string): boolean;
    getById(id: string): T | null;
}
interface NaturalLanguage {
    id: string;
    name: string;
}
declare class LanguageList extends AbstractList<NaturalLanguage> {
    constructor(data: NaturalLanguage[]);
    isKeyIn(id: string): boolean;
    indexOfKey(id: string): number;
    getItemByIndex(index: number): NaturalLanguage;
    getItemByKey(id: string): NaturalLanguage | null;
    getNameByKey(id: string): string;
}
interface L10nTextDict {
    [key: string]: string;
}
declare class L10nText {
    private data;
    constructor(data: L10nTextDict);
    get(key: string): string;
    set(key: string, value: string): void;
    toString(): string;
}
declare enum SignatureStatus {
    DEACTIVE = "deactive",
    ACTIVE = "active"
}
declare class Signature {
    id: string;
    status: SignatureStatus;
    constructor(id: string, status?: SignatureStatus);
    activiate(): void;
    deactiviate(): void;
    isActive(): boolean;
    toString(): string;
}
interface SignatureObject {
    id: string;
    status?: SignatureStatus;
}
declare class SignatureList extends AbstractList<Signature> {
    constructor(signatures: SignatureObject[]);
    initialize(): void;
    isActiveById(id: string): boolean;
    activateById(id: string): boolean;
    deactivateById(id: string): boolean;
}
declare enum TaskStatus {
    DEACTIVE = "deactive",
    ACTIVE = "active",
    FINISHED = "finished"
}
declare class GameTask {
    id: string;
    description: L10nText;
    status: TaskStatus;
    constructor(id: string, description: L10nText, status?: TaskStatus | undefined);
    isActive(): boolean;
    isFinished(): boolean;
    activiate(): void;
    finish(): void;
    deactiviate(): void;
}
interface GameTaskObject {
    id: string;
    description: L10nTextDict;
    status?: TaskStatus;
}
declare class GameTaskList extends AbstractList<GameTask> {
    constructor(tasks: GameTaskObject[]);
    isActiveById(id: string): boolean;
    isFinishedById(id: string): boolean;
    activateById(id: string): boolean;
    deactivateById(id: string): boolean;
    finishById(id: string): boolean;
}
declare class GameAction {
    id: string;
    action: () => void;
    constructor(id: string, f?: () => void);
    do(): void;
    static genDeactivateSignatureAct(id: string): () => void;
    static genActivateSignatureAct(id: string): () => void;
    static genDeactivateTaskAct(id: string): () => void;
    static genActiveTaskAct(id: string): () => void;
    static genFinishTaskAct(id: string): () => void;
    static genAddPassengerAct(id: string): () => void;
    static genRemovePassengerAct(id: string): () => void;
    static genStepActionAct(id: string): () => void;
    static polyActs(...fs: Array<() => void>): () => void;
    toString(): string;
}
interface GameActionObject {
    id: string;
    action: () => void;
}
declare class GameActionList extends AbstractList<GameAction> {
    constructor(actions: GameActionObject[]);
}
declare class Passenger {
    id: string;
    name: L10nText;
    avatar_color: string;
    avatar_font_color: string;
    avatar_text: L10nText;
    is_diaplay: boolean;
    constructor(id: string, name: L10nText, avatar_color: string, avatar_font_color: string, avatar_text: L10nText, is_display?: boolean);
    toString(): string;
}
interface PassengerObject {
    id: string;
    name: L10nTextDict;
    avatar_color: string;
    avatar_font_color: string;
    avatar_text: L10nTextDict;
    is_display?: boolean;
}
declare class PassengerList extends AbstractList<Passenger> {
    constructor(passengers: PassengerObject[]);
}
declare enum DialogBlockItemType {
    DIALOG = "dialog",
    SELECT = "select"
}
declare abstract class DialogBlockItem {
    id: string;
    item_type: DialogBlockItemType;
    constructor(id: string, type?: DialogBlockItemType);
    isSelect(): boolean;
}
declare class SelectOption {
    id: string;
    next_dialog_block_id: string;
    text: L10nText;
    constructor(id: string, next_id: string, text: L10nText);
    static splitId(id: string): [string, string];
    toString(): string;
}
interface OptionObject {
    next: string;
    text: L10nTextDict;
}
declare class BranchSelect extends DialogBlockItem {
    options: SelectOption[];
    constructor(id: string, options?: OptionObject[]);
    getOptionById(id: string): SelectOption | null;
    toString(): string;
}
declare enum DialogLayout {
    LEFT = "left",
    MIDDLE = "middle",
    RIGHT = "right"
}
declare class Dialog extends DialogBlockItem {
    person_id: string;
    text: L10nText;
    layout: DialogLayout;
    is_having_action: boolean;
    action_id: string;
    constructor(id: string, person_id: string, text: L10nText, layout: DialogLayout, action_id?: string);
    static splitId(id: string): [string, string];
    doAction(): void;
    toString(): string;
}
interface DialogObject {
    person_id: string;
    text: L10nTextDict;
    layout: DialogLayout;
    action_id?: string;
}
interface SelectObject {
    options: OptionObject[];
}
declare class DialogBlock {
    id: string;
    cur_item_index: number;
    in_signatures: string[];
    data: DialogBlockItem[];
    constructor(id: string, in_signatures: string[], dialogs: DialogObject[], select?: SelectObject | null);
    getItemByIndex(index: number): DialogBlockItem | null;
    getItemById(id: string): DialogBlockItem | null;
    getCurItem(): DialogBlockItem | null;
    resetIndex(): void;
    setIndexToEnd(): void;
    stepIndex(): void;
    isNotFirstLine(): boolean;
    isFinished(): boolean;
    isUnlocked(): boolean;
    toString(): string;
}
interface DialogBlockObject {
    id: string;
    in_signatures: string[];
    dialogs: DialogObject[];
    select?: SelectObject;
}
interface DialogInDict {
    [dialog_id: string]: string[];
}
declare class DialogScene {
    id: string;
    dialog_blocks: DialogBlock[];
    cur_block_id: string;
    visited_blocks: string[];
    dialog_in_dict: DialogInDict;
    constructor(id: string, blocks: DialogBlockObject[]);
    isInclduingBlock(id: string): boolean;
    setCurDialogBlock(id: string): void;
    getCurDialogBlock(): DialogBlock | null;
    getDialogBlock(id: string): DialogBlock | null;
    addVisitedBlock(id: string): void;
    removeVisitedBlock(id: string): void;
    toString(): string;
}
interface DialogSceneObject {
    id: string;
    blocks: DialogBlockObject[];
}
interface Background {
    bg_color: string;
    inner_html: string;
}
declare class Floor {
    id: string;
    dialog_scene: DialogScene;
    plot_id_list: string[];
    background: Background;
    constructor(id: string, scene: DialogSceneObject, plot_id_list: string[], background?: Background | null);
    checkPlotThreads(): void;
}
interface FloorObject {
    id: string;
    dialog_scene: DialogSceneObject;
    plot_id_list: string[];
    background?: Background;
}
declare class FloorList extends AbstractList<Floor> {
    constructor(floors: FloorObject[]);
}
interface SignatureFloorDict {
    [signature_id: string]: string;
}
interface SignatureFloorItem {
    signature: string;
    floor: string;
}
declare class PlotThread {
    id: string;
    priority: number;
    signature_floor_dict: SignatureFloorDict;
    signatures: string[];
    in_signatures: string[];
    cur_signature_index: number;
    constructor(id: string, priority: number, signature_floor_list: SignatureFloorItem[], in_signatures?: string[]);
    step(): void;
    getCurFloorId(): string;
    getCurSignatureId(): string;
    getSignatureById(index: number): Signature | null;
    getCurSignature(): Signature | null;
    isUnlocked(): boolean;
    isFinished(): boolean;
}
interface PlotThreadObject {
    id: string;
    priority: number;
    signature_floor_list: SignatureFloorItem[];
    in_signatures: string[];
}
declare class PlotThreadList extends AbstractList<PlotThread> {
    constructor(threads: PlotThreadObject[]);
    getById(id: string): PlotThread | null;
}
declare enum DotColor {
    DARK = "dark",
    LIGHT = "light"
}
declare class WaitingDotsAnimation {
    private dots;
    private orders;
    private step;
    private timer;
    private interval;
    constructor();
    generateOrders(num: number): DotColor[][];
    toggle(dot: HTMLElement, color_type: DotColor): void;
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
declare enum DoorDir {
    OPEN = "open",
    CLOSE = "close"
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
    syncStart(direction: DoorDir): void;
    start(direction: DoorDir): Promise<void>;
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
declare enum FloorLiftStatus {
    UP = "up",
    DOWN = "down",
    NONE = "none",
    BOTH = "both"
}
declare class FloorDisplay {
    private display_number;
    private up_icon;
    private down_icon;
    constructor();
    updateIcon(status: FloorLiftStatus): void;
    updateNumber(num: number): void;
}
declare enum SavePanelDir {
    OPEN = "open",
    CLOSE = "close"
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
    syncStart(direction: SavePanelDir): void;
    start(direction: SavePanelDir): Promise<void>;
}
declare enum LangBtnDir {
    LEFT = "left",
    RIGHT = "right",
    NONE = "none"
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
    syncStart(direction: LangBtnDir): void;
    start(direction: LangBtnDir): Promise<void>;
    set(id: string): void;
    get(): string;
}
declare abstract class ListDisplay<T> {
    data: string[];
    constructor(id_list?: string[]);
    add(id: string): void;
    remove(id: string): void;
    abstract getValidCount(): number;
    abstract getByIndex(index: number): T | null;
    abstract render(lang: string): void;
}
declare class PassengerDisplay extends ListDisplay<Passenger> {
    constructor(id_list?: string[]);
    getValidCount(): number;
    getByIndex(index: number): Passenger | null;
    render(lang: string): void;
}
declare class TaskDisplay extends ListDisplay<GameTask> {
    constructor(id_list?: string[]);
    getValidCount(): number;
    getByIndex(index: number): GameTask | null;
    render(lang: string): void;
}
interface UiStringDictRaw {
    [key: string]: L10nTextDict;
}
interface UiStringDict {
    [key: string]: L10nText;
}
interface SaveDataType {
}
interface SaveRootType {
    status: boolean;
    data: SaveDataType;
}
declare class Game {
    lang: string;
    floor_buttons: FloorButton[][];
    cur_floor: number;
    max_floor: number;
    min_floor: number;
    is_lifting: boolean;
    private lift_interval;
    private lift_direction;
    cur_dest: number;
    pending_queue: PendingQueue;
    door: Door;
    dots_animation: WaitingDotsAnimation;
    floor_display: FloorDisplay;
    save_panel: SavePanel;
    language_display: LanguageDisplay;
    ui_string: UiStringDict;
    passenger_display: PassengerDisplay;
    task_display: TaskDisplay;
    constructor();
    static hideGoOnButton(): void;
    static showGoOnButton(): void;
    static hideOptions(): void;
    static showOptions(): void;
    getCurrentFloor(): Floor | null;
    static getTFIcon(icon_type: boolean): HTMLElement;
    static createAvatar(psg_id: string, lang: string): HTMLElement;
    static createDialogElement(dialog: Dialog, lang: string, is_not_first?: boolean): HTMLElement | null;
    static createOptionElement(opt: SelectOption, lang: string): HTMLElement;
    static renderDialog(dialog: Dialog, lang: string, is_not_first?: boolean): boolean;
    static renderSelect(select: BranchSelect, lang: string): void;
    static stepDialog(block: DialogBlock, lang: string, is_do_action?: boolean): void;
    static renderBlock(block: DialogBlock, lang: string, is_render_all?: boolean): void;
    renderFloor(): void;
    isLiftable(): boolean;
    calcLiftDirection(): void;
    checkPassingFloor(): boolean;
    lift(): Promise<void>;
    checkBeforeLift(): void;
    createFloorButtons(): void;
    renderFloorButtons(): void;
    encrypt(): void;
    decipher(): void;
    serializate(): string;
    deserializate(data: string): boolean;
    switchUiLanguge(): void;
    switchTextLanguage(): void;
    initialize(): void;
    debug(): Promise<void>;
}
interface BindingButton {
    selector: string;
    is_single: boolean;
    func: (this: HTMLElement, event: MouseEvent) => void;
}
declare function clickSwitchLangButton(dir: LangBtnDir): Promise<void>;
declare const binding_buttons: BindingButton[];
declare function bindButtonFunctions(): void;
declare const game_lang_list: LanguageList;
declare const game_default_lang = "zh_cn";
declare const game_signature_list: SignatureList;
declare const game_action_list: GameActionList;
declare const game_task_list: GameTaskList;
declare const game_plot_thread_list: PlotThreadList;
declare const game_passenger_list: PassengerList;
declare const game_passenger_me = "me_psg";
declare const game_floor_list: FloorList;
declare const game_ui_string_raw: UiStringDictRaw;
declare const game: Game;
