export interface Command {
    id: string;
    name: string;
    type: EventType;
    event: string;
    commandType: CommandType;
    favourite: boolean;
    active?: boolean;
    options?: Option[];
}

export type EventType = "CLIENT" | "SERVER";
export type CommandType = "TOGGLE" | "COLLAPSE" | "BUTTON";

export interface CommandGroup {
    commands: Command[];
    tab: string;
}

export interface Option {
    id: string;
    name: string;
    type: OptionType;
    choices?: OptionChoice[];
    asyncCallback?: string;
    eventType?: EventType;
    event?: string;
}

export interface OptionChoice {
    label: string;
    value: string;
}

export type OptionType =
    | "PLAYER_LIST"
    | "INPUT_TEXT"
    | "INPUT_SELECT"
    | "NUMBER"
    | "SELECT"
    | "BUTTON"
    | "INPUT_ASYNC";

export interface OpenData {
    open: boolean;
    commands: CommandGroup[];
    dev: boolean;
}

export interface Player {
    serverId: string;
    display: string;
    id: string;
    name: string;
}

export interface Log {
    id: number;
    source: string;
    type: string;
    message: string;
    date: number;
}

export interface SMCommand {
    id: string;
    name: string;
    event: string;
}

export interface SMOpenData {
    open: boolean;
    commands: SMCommand[];
    type: string;
    data: string;
}
export interface AdminPlayerData {
    serverId: number;
    username: string;
    steam: string;
    loggedIn: boolean;
    identifiers: string[];
    charInfo: CharInfo;
    vehicles: Vehicle[];
}

export interface CharInfo {
    cid: string;
    name: string;
    job: string;
    gang: string;
    phone: number;
    bank: number;
    cash: number;
    crypto: number;
}

export interface Vehicle {
    vehicle: string;
    plate: string;
    state: number;
}
