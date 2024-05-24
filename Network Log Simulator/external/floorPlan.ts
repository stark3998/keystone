import axios from 'axios';
import { urls } from '../support/urls';

export class FloorPlan {

    public static getFloorPlan(floorname: string): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log("Hit floor plan");
            axios.get(urls.main_server + urls.floor_plan_api + floorname).then(res => {
                // console.log(res.data);
                resolve(res.data);
            })
                .catch(err => {
                    console.log(err);
                    reject(err);
                })
        })
    }

    public static getAllFloorPlans(): Promise<any> {
        return new Promise((resolve, reject) => {
            axios.get(urls.main_server + urls.all_floor_plans_api).then(res => {
                resolve(res.data);
            })
                .catch(err => {
                    console.log(err);
                    reject(err);
                })
        })
    }
}