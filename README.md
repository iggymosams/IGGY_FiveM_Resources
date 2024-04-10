<h1 align="center"> IGGY FiveM Resources </h1> <br>

A Collection of FiveM Resources made using Typescript and Svelte.

## Table of Contents

-   [Admin Menu](#admin-menu)
-   [Laptop](#laptop)
-   [Boosting](#boosting)
-   [Groups](#groups)
-   [Utils](#utils)

## Admin Menu

A alternative admin menu for QBCore built with typescript and svelte.

### Features

-   Event based command system for easy command creation
-   Entity Selection menu (F3 by default) for quick targeted commands when in dev mode
-   Command binding (F2, F4, F6, F7, F9 by default) for customizable quick commands when in dev mode
-   Command favouriting, searching and categories
-   Logs page intergated with qb-logs
-   Customizable keybinds.

### TODO

-   [x] Rework UI
-   [ ] Add entity stats/info to selection menu
-   [x] Set Job/Gang Command
-   [x] Add/Remove Money Command
-   [x] Open Outfits

### Commands

-   `/menu` opens the menu

### Exports

#### Client

```typescript
getDevmode(): boolean
```

Returns if the user has devmode on

```typescript
getGodmode(): boolean
```

Returns if the user has godmode on

```typescript
openTransformControls(obj: number): Promise<{
    position: {
        x: number;
        y: number;
        z: number;
    };
    rotation: {
        x: number;
        y: number;
        z: number;
    };
}>
```

Opens transform controls to manipulate an object in realtime.

Returns a promise of the final transform of the object.

### Screen Shots

<img src = "https://i.imgur.com/ZTqYVWK.png" height=250>
<img src = "https://i.imgur.com/5ynTFnM.png" width=250>
<img src = "https://i.imgur.com/BvtueOl.png" width=250>
<img src = "https://i.imgur.com/eh0j45N.png" width=250>
<img src = "https://i.imgur.com/dodaEys.png" width=250>
<img src = "https://i.imgur.com/m7M3UKp.png" width=250>

## Laptop

The UI and core for all the laptop resources below

### Features

-   Easy app creation
-   Dynamic app movement
-   Custom Wallpapers
-   Access NUI callbacks from external resources
-   Send NUI messages from external resources
-   VPN Item for hidden apps
-   Handles to keep players annoynmus when using illegal apps

### Commands

-   `iggy-laptop:restart` Restarts the laptop ui and resets stores

### Exports

#### Client

```typescript
RegisterLaptopCallback(name: string, callback: Function)
```

Registers a NUI callback for laptop resource that callsback to a function when triggerd.

```typescript
SendAppMessage(app: string, action: string, data?: unknown)
```

Sends a NUI message to a specific app

```typescript
OpenLaptop(hasFocus: boolean, hasCursor: boolean, hasVPN?: boolean)
```

Opens the laptop

```typescript
CloseLaptop();
```

Closes the laptop

```typescript
SetFocus(hasFocus: boolean, hasCursor: boolean)
```

#### Server

```typescript
HasVPN(src: string | number): boolean
```

Returns true if the player has a VPN

```typescript
GetHandle(src: string | number): string | undefined
```

Returns the players current handle if they have a vpn

```typescript
SetHandle(handle: string, replace?: string): Promise<boolean>
```

Sets the players handle and replaces the old one if any

### Screen Shots

TODO: Add screenshots

## Boosting

A car boosting system for QBCore

### Features

-   A contract teir system
-   A player reputation system
-   Intergrates with [groups](#groups) for multiplayer jobs
-   Intergrates with [admin](#admin) for contract creation
-   Easy location/car customization

### TODO

-   [ ] Rework contract system

### Exports

#### Server

```typescript
GetRep(cid: string): Promise<Rep>
```

Returns the players rep

```typescript
GiveRep(cid: string, amount: number)
```

Add/Remove rep

### Screen Shots

-   TODO

## Groups

Manages the groups for boosting and future resources

### Features

-   TODO

### Exports

#### Client

```typescript
IsInGroup(): boolean
```

Returns if a player is in a group

#### Server

```typescript
GetGroupById(id: number): Group
```

Returns a group by group id

```typescript
GetGroupFromLeaderCid(cid: string): Group | undefined
```

Returns a group by the leaders cid

```typescript
GetGroupFromLeaderName(name: string): Group | undefined
```

Returns a group by the leaders name

```typescript
GetPlayerGroup(cid: string): Group | undefined
```

Returns a group by players cid

```typescript
GetPlayerGroupFromName(name: string): Group | undefined
```

Returns a group by players name

```typescript
GetPlayerGroupFromSource(src: string): Group | undefined
```

Returns a group by players server id

```typescript
GroupEmitNet(groupId: number, eventName: string, ...args: any[])
```

Triggers an event for every player in a group

### Screen Shots

## Utils

A bunch of useful exports

### Exports

#### Client

```typescript
TriggerQBCallBack(name: string, ...args: any[])
```

Triggers a QBCore callback asynchronously

#### Shared

```typescript
function Delay(ms: number): Promise<void>;
```

Delays the execution for a specified amount of time.

```typescript
function CalcDist(
    start_x: number,
    start_y: number,
    start_z: number,
    target_x: number,
    target_y: number,
    target_z: number
): number;
```

Returns the distance between to vectors

```typescript
function RandomNumber(min: number, max: number): number;
```

Returns a random number
