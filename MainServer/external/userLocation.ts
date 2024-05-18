import axios from 'axios';
import stream from 'stream';
import express from 'express';

export class UserLocation {

    public static getUserLocation(floorname: string, processLocation: (parsed: any, res: express.Response, floorPlanData: any) => void, resp: express.Response, floorPlan: any): Promise<any> {
        console.log("In here");
        return new Promise((resolve, reject) => {
            console.log("Hit user location");
            axios.get('http://localhost:5001/v1/logs/logs?name=' + floorname, { responseType: 'stream' }).then(res => {

            // console.log(res);

                const writableStream = new stream.Writable({
                    write(chunk, encoding, callback) {
                        // Process the incoming data chunk
                        // console.log('Received data chunk:', chunk.toString());
                        const parsed = JSON.parse(chunk);
        
                        // Write the data chunk to another writable stream or perform any other actions
                        processLocation(parsed, resp, floorPlan);
        
                        // Call the callback to indicate that the processing is complete
                        callback();
                    }
                });

                // res.data.on('error', (err: any) => {
                //     reject(`Error streaming data from source endpoint: ${err.message}`);
                // });

                writableStream.on('finish', () => {
                    // Call the custom callback function after the stream is complete
                    console.log("Stream finished!");
                    resolve(res.data);
                });
                res.data.pipe(writableStream);
                // console.log(res.data);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            })
        })
    }

    public static getUserLocation1(floorname: string, processLocation: (parsed: any) => void): Promise<any> {
        console.log("In here");
        return new Promise((resolve, reject) => {
            console.log("Hit user location");
                resolve("done");
            })
    }

    public static getFloorPlan(floorname: string): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log("Hit floor plan");
            axios.get('http://localhost:4000/v1/floorplan/getPlanByName?name=' + floorname).then(res => {
                // console.log(res.data);
                resolve(res.data);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            })
        })
    }


}