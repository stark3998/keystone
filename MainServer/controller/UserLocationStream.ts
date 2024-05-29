// import { Server as WebSocketServer, WebSocket } from 'ws';
// import { Floorplan } from '../utilities/floorplan';
// import { locationProcessorCntrl } from './LocationProcessorCntrl';
// import { UserLocation } from '../external/userLocation';

// export class UserLocationStream {

//     public static wss: WebSocketServer;

//     public constructor(wss: WebSocketServer) {
//         UserLocationStream.wss = wss;
//     }

//     public static getUserLocation(): void {
//         // console.log('getUserLocation -', req.url);
//         // var floorname: string = req.query.name ? req.query.name.toString() : 'DBH 6th Floor';
//         Floorplan.getFloorPlanByName(floorname).then((floorPlanData: dbFloorRowResponse) => {
//             // console.log("calling");
//             res.writeHead(200, {
//                 'Content-Type': 'text/plain',
//                 'Transfer-Encoding': 'chunked'
//             });
//             UserLocation.getUserLocation(floorname, UserLocationStream.processUserLocation, res, floorPlanData.payload!).then(ress => {
//                 res.end();
//             })
//             .catch(err => {
//                 res.write(JSON.stringify(err) + '\n\n');
//                 res.end();
//             });
//         })
//         .catch(err => {
//             res.status(err.code).send(err.error)
//         })
//     }

//     public static processUserLocation(parsed: any, res: express.Response, floorPlanData: any) {
//         var userLocation = UserLocationProcessor.processUserLocation(parsed, floorPlanData);
//         res.write(JSON.stringify(userLocation) + '\n\n');
//     }
// }