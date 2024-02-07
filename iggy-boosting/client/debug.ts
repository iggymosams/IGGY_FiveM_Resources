// RegisterCommand(
//     "iggy-boosting:coords",
//     () => {
//         let coords = GetEntityCoords(PlayerPedId(), true);
//         let w = GetEntityHeading(PlayerPedId());
//         emitNet("coords", { x: coords[0], y: coords[1], z: coords[2], w: w });
//     },
//     false
// );

// RegisterCommand(
//     "iggy-boosting:debug",
//     async (source: string, args: string[]) => {
//         // let vehClass = "C";
//         if (args[0] === "SPAWN") {
//             let CLocations: Location[] = SPAWN_LOCATIONS["C"];
//             let BLocations: Location[] = SPAWN_LOCATIONS["B"];
//             let locations: Location[] = CLocations.concat(BLocations);
//             locations.forEach((location, index) => {
//                 let coords = location.carLocation;
//                 let blip = AddBlipForCoord(coords.x, coords.y, coords.z);
//                 SetBlipColour(blip, 2);
//                 locations.forEach((l, i) => {
//                     if (index !== i) {
//                         let c = l.carLocation;
//                         let dist = CalcDist(
//                             coords.x,
//                             coords.y,
//                             coords.z,
//                             c.x,
//                             c.y,
//                             c.z
//                         );
//                         if (dist <= 5) {
//                             console.log(
//                                 "found",
//                                 dist,
//                                 i,
//                                 coords.x,
//                                 coords.y,
//                                 coords.z,
//                                 c.x,
//                                 c.y,
//                                 c.z
//                             );
//                             SetBlipColour(blip, 1);
//                         }
//                     }
//                 });
//             });
//             while (true) {
//                 await Delay(10);
//                 locations.forEach((location, index) => {
//                     let coords = location.carLocation;
//                     DrawMarker(
//                         0,
//                         // COORDS
//                         coords.x,
//                         coords.y,
//                         coords.z,
//                         //DIR
//                         0.0,
//                         0.0,
//                         0.0,
//                         //ROT
//                         0.0,
//                         0.0,
//                         0.0,
//                         //SCALE
//                         0.5,
//                         0.5,
//                         0.5,
//                         120,
//                         10,
//                         20,
//                         155,
//                         false,
//                         false,
//                         0,
//                         false,
//                         null,
//                         null,
//                         false
//                     );
//                 });
//             }
//         } else if (args[0] === "DROP") {
//             let locations: DropOffLocation[] = DROP_OFF_LOCATIONS;
//             locations.forEach((location, index) => {
//                 let coords = location.location;
//                 let blip = AddBlipForCoord(coords.x, coords.y, coords.z);
//                 SetBlipColour(blip, 2);
//                 locations.forEach((l, i) => {
//                     if (index !== i) {
//                         let c = l.location;
//                         let dist = CalcDist(
//                             coords.x,
//                             coords.y,
//                             coords.z,
//                             c.x,
//                             c.y,
//                             c.z
//                         );
//                         if (dist <= 5) {
//                             console.log(
//                                 "found",
//                                 dist,
//                                 i,
//                                 coords.x,
//                                 coords.y,
//                                 coords.z,
//                                 c.x,
//                                 c.y,
//                                 c.z
//                             );
//                             SetBlipColour(blip, 1);
//                         }
//                     }
//                 });
//             });
//             while (true) {
//                 await Delay(10);
//                 locations.forEach((location, index) => {
//                     let coords = location.location;
//                     DrawMarker(
//                         0,
//                         // COORDS
//                         coords.x,
//                         coords.y,
//                         coords.z,
//                         //DIR
//                         0.0,
//                         0.0,
//                         0.0,
//                         //ROT
//                         0.0,
//                         0.0,
//                         0.0,
//                         //SCALE
//                         0.5,
//                         0.5,
//                         0.5,
//                         120,
//                         10,
//                         20,
//                         155,
//                         false,
//                         false,
//                         0,
//                         false,
//                         null,
//                         null,
//                         false
//                     );
//                 });
//             }
//         }
//     },
//     false
// );
// let debug: Location[] = [];
// RegisterCommand(
//     "iggy-boosting:debug:addLocation",
//     async (source: string, args: string[]) => {
//         let coords = GetEntityCoords(PlayerPedId(), true);
//         let w = GetEntityHeading(PlayerPedId());
//         let newLocation: Location = {
//             carLocation: { x: coords[0], y: coords[1], z: coords[2], w: w },
//             inUse: false,
//         };
//         debug.push(newLocation);
//         emitNet("coords", debug);
//     },
//     false
// );
// let debug2: DropOffLocation[] = [];
// RegisterCommand(
//     "iggy-boosting:debug:addDropLocation",
//     async (source: string, args: string[]) => {
//         let coords = GetEntityCoords(PlayerPedId(), true);
//         let w = GetEntityHeading(PlayerPedId());
//         let newLocation: DropOffLocation = {
//             location: { x: coords[0], y: coords[1], z: coords[2] },
//             inUse: false,
//         };
//         debug2.push(newLocation);
//         emitNet("coords", debug2);
//     },
//     false
// );
// let debug3: vehicleList = {};

// RegisterCommand(
//     "iggy-boosting:debug:addCar",
//     (source: string, args: string[]) => {
//         let veh = QBCore.Shared.Vehicles[args[0]];
//         let vehClass = args[1] as VehicleClass;
//         let newVeh: Vehicle = {
//             model: veh.model,
//             name: veh.name,
//             class: vehClass,
//         };
//         debug3[veh.model] = newVeh;
//         emitNet("coords", debug3);
//     },
//     false
// );
