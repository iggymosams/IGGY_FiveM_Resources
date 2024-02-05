<h1 align="center"> IGGY FiveM Resources </h1> <br>

A Collection of FiveM Resources made using Typescript and Svelte.

## Table of Contents

-   [Admin Menu](#admin-menu)
-   [Laptop](#laptop)
-   [Rental](#rental)
-   [Groups](#groups)

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
-   [ ] Add/Remove Money Command
-   [ ] Open Outfits

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

Sets the users NUI focus in the resource context

```typescript
GetFocus(): { hasFocus: boolean; hasCursor: boolean }
```

Gets the users focus in the resource context

```typescript
GetIsOpen(): boolean
```

Returns if the laptop is open

```typescript
PlaySound(sound: string, volume: number)
```

Plays a sound for the client

```typescript
PlayInDistance(coords: number[], maxDist: number, sound: string, volume: number)
```

Plays a sound within a set distance of the provided location

### Screen Shots

TODO: Add screenshots

## Rental

A Rental system for QBCore

### Features

-   TODO

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

```typescript
GetGroup(): Group | undefined
```

Returns the players group

#### Server

```typescript
GetGroupById(id: number): Group
```

Returns a group by group id

```typescript
GetGroupFromLeader(cid: string): Group | undefined
```

Returns a group by the leaders cid

```typescript
GetPlayerGroup(cid: string): Group | undefined
```

Returns a group by players cid

```typescript
GroupEmitNet(groupId: number, eventName: string, ...args: any[])
```

Triggers an event for every player in a group

### Screen Shots

## Boosting

### Features

### Exports

#### Server

```typescript
GetRep(cid:string): Promise<Rep>
```

Returns a player boosting rep

```typescript
GiveRep(cid: string, amount: number)
```

Gives a player boosting rep

### Screen Shots
