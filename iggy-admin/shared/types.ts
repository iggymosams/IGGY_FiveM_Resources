export interface Command {
    id: string;
    name: string;
    type: EventType;
    event: string;
    commandType: CommandType;
    favourite?: boolean;
    active?: boolean;
    options?: Option[];
    closeMenu?: boolean;
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
    value: string | number;
}

export type OptionType =
    | "PLAYER_LIST"
    | "INPUT_TEXT"
    | "INPUT_SELECT"
    | "NUMBER"
    | "SELECT"
    | "BUTTON"
    | "INPUT_ASYNC";

export interface Player {
    serverId: string;
    display: string;
    id: string;
    name: string;
}

export interface CommandData {
    values: {
        [key: string]: any;
    };
    target: Player;
}

export interface RunCommandData {
    event: string;
    data: CommandData;
    type: EventType;
    id: string;
}

export interface PlayerCoordData {
    id: number;
    display: string;
    coords: number[];
    net: number;
}

export type SelectionMenuType =
    | "VEHICLE"
    | "PED"
    | "OBJECT"
    | "PLAYER"
    | "DOOR";

export type SelectionMenuCommandGroups = {
    [key in SelectionMenuType]: SMCommand[];
};

export interface SMCommand {
    id: string;
    name: string;
    event: string;
}

export interface SMOpenData {
    open: boolean;
    commands: SMCommand[];
}

export interface Bind {
    name: string;
    cmd: Command | undefined;
}

export interface Log {
    id: number;
    source: string;
    type: string;
    message: string;
    date: number;
}
