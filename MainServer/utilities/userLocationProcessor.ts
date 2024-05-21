import { PlanRow } from "../support/interfaces";

export class UserLocationProcessor {

    /**
     * Process user location based on the received data chunk and floor plan.
     * @param chunk The data chunk containing user information.
     * @param floorPlan The floor plan data.
     * @returns Object containing the MAC Address and the random location within the signal radius.
     */
    public static processUserLocation(chunk: any, floorPlan: PlanRow): { 'MAC Address': string, Location: { x: number, y: number } } {
        console.log(chunk);
        const apNumber = parseInt(chunk['Associated Access Point'].substr(2), 10);
        const position = this.findAP(apNumber, floorPlan).pos;
        const radius = this.calculateSignalStrength(chunk['RSSI (dBm)']);
        const randomLocation = this.pickRandomPoint(this.generatePointsOnCircle(position.x, position.y, radius, floorPlan.width, floorPlan.height));
        return { 'MAC Address': chunk['MAC Address'], Location: randomLocation };
    }

    /**
     * Calculate the signal strength based on RSSI (Received Signal Strength Indicator).
     * @param signalStrength The received signal strength in dBm.
     * @returns The calculated signal strength.
     */
    private static calculateSignalStrength(signalStrength: number): number {
        // Assuming a simple signal strength model where signal strength decreases linearly with distance
        const maxSignalStrength = 100; // Maximum signal strength
        const maxDistance = 100;       // Maximum distance for full signal strength
        
        // Calculate the distance from the access point to the user based on the signal strength
        const distance = (maxDistance * (maxSignalStrength - signalStrength)) / maxSignalStrength;
        
        return distance;
    }

    /**
     * Generate points on a circle with a given radius around a center point.
     * @param x_center The x-coordinate of the center point.
     * @param y_center The y-coordinate of the center point.
     * @param radius The radius of the circle.
     * @param width The width of the floor plan.
     * @param height The height of the floor plan.
     * @returns Array of points on the circumference of the circle.
     */
    private static generatePointsOnCircle(x_center: number, y_center: number, radius: number, width: number, height: number): { x: number, y: number }[] {
        const points: { x: number, y: number }[] = [];
    
        for (let theta = 0; theta <= 2 * Math.PI; theta += (1 / radius)) {
            const x = x_center + radius * Math.cos(theta);
            const y = y_center + radius * Math.sin(theta);
    
            // Ensure x and y are within bounds
            if (x >= 0 && x < width && y >= 0 && y < height) {
                points.push({ x: Math.ceil(x), y: Math.ceil(y) });
            }
        }
    
        // If points array is empty, add { x: 0, y: 0 }
        if (points.length === 0) {
            points.push({ x: 0, y: 0 });
        }
    
        return points;
    }

    /**
     * Pick a random point from an array of points.
     * @param points Array of points.
     * @returns Randomly picked point.
     */
    private static pickRandomPoint(points: { x: number, y: number }[]): { x: number, y: number } {
        const randomIndex = Math.floor(Math.random() * points.length);
        return points[randomIndex];
    }

    /**
     * Find the position of the access point in the floor plan.
     * @param apNumber The number of the access point.
     * @param floorPlan The floor plan data.
     * @returns The position of the access point.
     */
    private static findAP(apNumber: number, floorPlan: PlanRow): { pos: { x: number, y: number } } {
        let accessPoint;
        // Loop through each access point in the floor plan (wifi)
        for (let i = 0; i <= apNumber; i++) {
            accessPoint = floorPlan.data.wifi[i];
        }
        if (accessPoint == undefined) {
            accessPoint = {x: 0, y: 0}
        }
        return { pos: accessPoint };
    }
}
