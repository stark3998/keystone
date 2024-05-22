import axios from 'axios';

/**
 * Class for handling gunshot detection-related operations.
 */

/**
 * Represents a GunShotDetector class that retrieves gunshot detection data from a specified floor and processes it.
 */
export class GunShotDetector {

    /**
     * Retrieves gunshot detection data from a specified floor and processes it.
     * @param file_link - Link to the Telegram File.
     * @returns A Promise resolving to the response data.
     */
    public static getGunShotData(file_link: string): Promise<any> {
        console.log("In getGunShotData");
        return new Promise((resolve, reject) => {
            
            axios.post('http://0.0.0.0:8000/telegram/', {"link":file_link}).then(response => {
                resolve(response);
            }).catch(err => {
                console.log(err);
                reject(err);
            });
        });
    }
}