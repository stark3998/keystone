import axios from 'axios';
import stream from 'stream';
import express from 'express';
import { PlanRow } from '../support/interfaces';

/**
 * Class for handling user location-related operations.
 */
export class UserLocation {

    /**
     * Retrieves user location data from a specified floor and processes it.
     * @param floorname - The name of the floor.
     * @param processLocation - The callback function to process the location data.
     * @param resp - The express Response object.
     * @param floorPlan - The floor plan data.
     * @returns A Promise resolving to the response data.
     */
    public static getUserLocation(floorname: string, processLocation: (parsed: any, res: express.Response, floorPlanData: PlanRow) => void, resp: express.Response, floorPlan: PlanRow): Promise<any> {
        console.log("In getUserLocation");
        return new Promise((resolve, reject) => {
            axios.get('http://localhost:5001/v1/logs/logs?name=' + floorname, { responseType: 'stream' }).then(response => {

                const writableStream = new stream.Writable({
                    write(chunk, encoding, callback) {
                        const parsed = JSON.parse(chunk);
                        processLocation(parsed, resp, floorPlan);
                        callback();
                    }
                });

                writableStream.on('finish', () => {
                    console.log("Stream finished!");
                    resolve(response.data);
                });

                response.data.pipe(writableStream);
            }).catch(err => {
                console.log(err);
                reject(err);
            });
        });
    }

    /**
     * Retrieves floor plan data for a specified floor.
     * @param floorname - The name of the floor.
     * @returns A Promise resolving to the floor plan data.
     */
    public static getFloorPlan(floorname: string): Promise<any> {
        console.log("In getFloorPlan");
        return new Promise((resolve, reject) => {
            axios.get('http://localhost:4000/v1/floorplan/getPlanByName?name=' + floorname).then(response => {
                resolve(response.data);
            }).catch(err => {
                console.log(err);
                reject(err);
            });
        });
    }
}
