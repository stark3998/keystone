import axios from 'axios';

export class FloorPlan {

    public static getFloorPlan(): Promise<any> {
        return new Promise((resolve, reject) => {
            axios.get('http://localhost:4000/v1/floorplan/getPlanByName?name=DBH%206th%20Floor').then(res => {
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