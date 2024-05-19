export class UserLocationProcessor {

    public static processUserLocation(chunk: any, floorPlan: any): {'MAC Address': string, Location: {x: number, y: number}} {
        var position = this.findAP(parseInt(chunk['Associated Access Point'].substr(2), 10), floorPlan).pos;
        var radius = this.calculateSignalStrength(chunk['RSSI (dBm)']);
        var randomLocation = this.pickRandomPoint(this.generatePointsOnCircle(position.x, position.y, radius, floorPlan.width, floorPlan.height));
        return {'MAC Address': chunk['MAC Address'], Location: randomLocation}

    }

    private static calculateSignalStrength(signalStrength: number): number {
        // Assuming a simple signal strength model where signal strength decreases linearly with distance
        const maxSignalStrength = 100; // Maximum signal strength
        const maxDistance = 100;       // Maximum distance for full signal strength
        
        // Calculate the distance from the access point to the user based on the signal strength
        const distance = (maxDistance * (maxSignalStrength - signalStrength)) / maxSignalStrength;
        
        return distance;
    }

    private static generatePointsOnCircle(x_center: number, y_center: number, radius: number, width: number, height: number): { x: number, y: number }[] {
        const points: { x: number, y: number }[] = [];
    
        for (let theta = 0; theta <= 2 * Math.PI; theta += (1 / radius)) {
            const x = x_center + radius * Math.cos(theta);
            const y = y_center + radius * Math.sin(theta);
    
            // Ensure x and y are within bounds
            if (x >= 0 && x <= width && y >= 0 && y <= height) {
                points.push({ x: Math.ceil(x), y: Math.ceil(y) });
            }
        }
    
        // If points array is empty, add { x: 0, y: 0 }
        if (points.length === 0) {
            points.push({ x: 0, y: 0 });
        }
    
        return points;
    }
    

    // Function to randomly pick a point from an array
    private static pickRandomPoint(points: { x: number, y: number }[]): { x: number, y: number } {
        const randomIndex = Math.floor(Math.random() * points.length);
        return points[randomIndex];
    }


    private static findAP(apNumber: number, floorPlan: any): {pos: {x: number, y: number}} {
    
        var accessPoint;
        // Loop through each access point in the floor plan (wifi)
        for (let i = 0; i <= apNumber; i++) {
            accessPoint = floorPlan.data.wifi[i];
        }
    
        return {pos: accessPoint};
    }
}