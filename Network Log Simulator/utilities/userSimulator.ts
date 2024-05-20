export class UserSimulator {
        // Dictionary to store user mac addresses and their corresponding metadata
        private static userLocations: { [macAddress: string]: { x: number, y: number, nap: number } } = {};

        private static numberOfUsers: number = 150;
        // Function to generate a random MAC address
        public static generateMacAddress(): String {
            return Array.from({ length: 6 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(':');
        }

        // Helper function to get a random location within the floor plan
        private static getRandomLocation(floorPlan: any): { x: number, y: number } {
            // Create a list of allowed locations based on the floor plan
            const allowedLocations: { x: number, y: number }[] = [];   
            for (let x = 0; x < floorPlan.width; x++) {
                for (let y = 0; y < floorPlan.height; y++) {
                    const location = { x, y };
                    if (!this.isLocationBlocked(location, floorPlan)) {
                        allowedLocations.push(location);
                    }
                }
            }

            // Choose a random location from the allowed locations
            return allowedLocations[Math.floor(Math.random() * allowedLocations.length)];
        }

        public static isLocationBlocked(location: { x: number, y: number }, floorPlan: any): boolean {
            // console.log(floorPlan.data.blocked, "Hii");
            // var block = JSON.parse(floorPlan.data);
            return floorPlan.data.blocked.some((blockedLocation: any) => {
                return ((blockedLocation.x === location.x && blockedLocation.y === location.y) || location.x < 0 || location.x >= floorPlan.width || location.y < 0 || location.y >= floorPlan.height);
            });
        }

        public static initializeUsers(floorPlan: any) {
            // Clear the userLocations dictionary
            this.userLocations = {};

            // Loop through each user location
            for (let i = 0; i < this.numberOfUsers; i++) {
                var randomPos = this.getRandomLocation(floorPlan);

                // Find the nearest access point to the user's location
                const nearestAP = this.findNearestAP({ x: randomPos.x, y: randomPos.y, nap: 0 }, floorPlan);

                // Generate a new random MAC address
                const macAddress = this.generateMacAddress().toString();

                // Assign the user's location with the nearest access point to the userLocations dictionary
                this.userLocations[macAddress] = { x: randomPos.x, y: randomPos.y, nap: nearestAP.nap };
            }
        }

        
        // Update user location
        private static updateUserPosition(macAddress: string, floorPlan: any): { x: number, y: number } {
            const userLocation = this.userLocations[macAddress];
            const possibleLocations = [
                { x: userLocation.x + 1, y: userLocation.y },
                { x: userLocation.x - 1, y: userLocation.y },
                { x: userLocation.x, y: userLocation.y + 1 },
                { x: userLocation.x, y: userLocation.y - 1 },
                {x: userLocation.x, y: userLocation.y}

            ];
            const availableLocations = possibleLocations.filter(loc => !this.isLocationBlocked(loc, floorPlan));
            let updatedLocation: { x: number, y: number };
    
            if (availableLocations.length > 0) {
                updatedLocation = availableLocations[Math.floor(Math.random() * availableLocations.length)];
            } else {
                // If no available locations, keep the current location
                updatedLocation = userLocation;
            }
    
            // // Update user location in the dictionary
            // this.userLocations[macAddress] = updatedLocation;
    
            return updatedLocation;
        }

        public static updateUserlocation(floorPlan: any): {x: number, y: number, nap: number, signalStrength: number, macAddress: String}{
            var randomUser = Object.keys(this.userLocations)[Math.floor(Math.random() * this.numberOfUsers)];
            var randomPos = this.updateUserPosition(randomUser, floorPlan);

            const nearestAP = this.findNearestAP({ x: randomPos.x, y: randomPos.y, nap: 0 }, floorPlan);
            
            const signalStrength = this.calculateSignalStrength(randomPos, nearestAP.pos)
            this.userLocations[randomUser] = { x: randomPos.x, y: randomPos.y, nap: nearestAP.nap };

            return {x: randomPos.x, y: randomPos.y, nap: nearestAP.nap, signalStrength: signalStrength, macAddress: randomUser}

        }

        private static findNearestAP(userLocation: { x: number, y: number, nap: number }, floorPlan: any): {nap: number, pos: {x: number, y: number}} {
            let minDistance = Infinity;
            let nearestAP: number  = 0;
            let accessPointOfAP: {x: number, y: number} = {x: 0, y: 0}
        
            // Loop through each access point in the floor plan (wifi)
            for (let i = 0; i < floorPlan.data.wifi.length; i++) {
                const accessPoint = floorPlan.data.wifi[i];
                const distance = this.calculateEuclideanDistance(userLocation, accessPoint);
        
                // Update nearest access point if the distance is smaller
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestAP = i;
                    accessPointOfAP = accessPoint
                }
            }
        
            return {nap: nearestAP, pos: accessPointOfAP};
        }
        
        private static calculateSignalStrength(p1: { x: number, y: number }, p2: { x: number, y: number }): number {
            // Calculate the Euclidean distance between the two points
            const distance = this.calculateEuclideanDistance(p1, p2);
        
            // Assuming a simple signal strength model where signal strength decreases linearly with distance
            // You can adjust the parameters based on your specific requirements
            const maxSignalStrength = 100; // Maximum signal strength
            const minSignalStrength = 0;   // Minimum signal strength
            const maxDistance = 100;       // Maximum distance for full signal strength
        
            // Calculate the signal strength based on the distance
            let signalStrength = maxSignalStrength - ((distance / maxDistance) * maxSignalStrength);
        
            // Ensure signal strength is within the specified range
            signalStrength = Math.max(minSignalStrength, Math.min(maxSignalStrength, signalStrength));
        
            return signalStrength;
        }
        

        private static calculateEuclideanDistance(p1: { x: number, y: number }, p2: { x: number, y: number }): number {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            return Math.sqrt(dx * dx + dy * dy);
        }

}