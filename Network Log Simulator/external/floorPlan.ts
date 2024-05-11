import axios from 'axios';

export class FloorPlan {

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