export class UserSimulator {
    // Dictionary to store user mac addresses and their corresponding metadata
    private static userLocations: { [macAddress: string]: { x: number, y: number, nap: number, name: string, email: string, chat_id: string } } = {};
    private static users_api = 'http://localhost:4000/v1/users';

    // private static numberOfUsers: number = 150;
    // Function to generate a random MAC address
    public static generateMacAddress(floor: string): String {
        return floor + Array.from({ length: 5 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(':');
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

    private static add_user_to_db(user: { id: number, name: string, email: string, mac_address: string, chat_id: string }, floorPlan: any) {
        const { id, name, email, mac_address, chat_id } = user;
        console.log(`User: ${name}, MAC Address: ${mac_address}, Email: ${email}, Chat ID: ${chat_id}`);
        var randomPos = this.getRandomLocation(floorPlan);
        const nearestAP = this.findNearestAP({ x: randomPos.x, y: randomPos.y, nap: 0 }, floorPlan);
        this.userLocations[mac_address] = { x: randomPos.x, y: randomPos.y, nap: nearestAP.nap, name: name, email: email, chat_id: chat_id };
    }

    public static initializeUsers(floorPlan: any) {
        // Clear the userLocations dictionary
        this.userLocations = {};
        // Generate a random number between 70 and 120
        var randomNumber = Math.floor(Math.random() * (51)) + 70;
        console.log("Generating " + randomNumber + " users");
        const randomNumbers: number[] = Array.from({ length: randomNumber }, () => Math.floor(Math.random() * 150) + 1);
        console.log("Random Numbers: ", randomNumbers);
        // Make an API call to retrieve the list of users
        fetch(this.users_api)
            .then(response => response.json())
            .then(data => {
                var users = data.payload.primary_users;
                users.forEach((user: { id: number, name: string, email: string, mac_address: string, chat_id: string }) => {
                    this.add_user_to_db(user, floorPlan);
                });
                var users = data.payload.secondary_users;

                randomNumbers.forEach((user_no: number) => {
                    var user: { id: number, name: string, email: string, mac_address: string, chat_id: string } = users[user_no];
                    this.add_user_to_db(user, floorPlan);
                });
            })
            .catch(error => {
                // Handle any errors that occur during the API call
                console.error('Error retrieving users:', error);
            });
    }


    // Update user location
    private static updateUserPosition(macAddress: string, floorPlan: any): { x: number, y: number } {
        const userLocation = this.userLocations[macAddress];
        const possibleLocations = [
            { x: userLocation.x + 1, y: userLocation.y },
            { x: userLocation.x - 1, y: userLocation.y },
            { x: userLocation.x, y: userLocation.y + 1 },
            { x: userLocation.x, y: userLocation.y - 1 },
            { x: userLocation.x, y: userLocation.y }

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

    public static getUserDatabase(floorPlan: any): { x: number, y: number, nap: number, signalStrength: number, macAddress: String }[] {


        var users = []
        for (let i = 0; i < this.numberOfUsers; i++) {
            var randomUser = Object.keys(this.userLocations)[i];
            var randomPos = this.updateUserPosition(randomUser, floorPlan);
            const nearestAP = this.findNearestAP({ x: randomPos.x, y: randomPos.y, nap: 0 }, floorPlan);
            const signalStrength = this.calculateSignalStrength(randomPos, nearestAP.pos)
            this.userLocations[randomUser] = { x: randomPos.x, y: randomPos.y, nap: nearestAP.nap };
            users.push({ x: randomPos.x, y: randomPos.y, nap: nearestAP.nap, signalStrength: signalStrength, macAddress: randomUser })
        }
        return users
    }

    public static updateUserlocation(floorPlan: any): { x: number, y: number, nap: number, signalStrength: number, macAddress: String } {
        var randomUser = Object.keys(this.userLocations)[Math.floor(Math.random() * this.numberOfUsers)];
        var randomPos = this.updateUserPosition(randomUser, floorPlan);

        const nearestAP = this.findNearestAP({ x: randomPos.x, y: randomPos.y, nap: 0 }, floorPlan);

        const signalStrength = this.calculateSignalStrength(randomPos, nearestAP.pos)
        this.userLocations[randomUser] = { x: randomPos.x, y: randomPos.y, nap: nearestAP.nap };

        return { x: randomPos.x, y: randomPos.y, nap: nearestAP.nap, signalStrength: signalStrength, macAddress: randomUser }

    }

    private static findNearestAP(userLocation: { x: number, y: number, nap: number }, floorPlan: any): { nap: number, pos: { x: number, y: number } } {
        let minDistance = Infinity;
        let nearestAP: number = 0;
        let accessPointOfAP: { x: number, y: number } = { x: 0, y: 0 }

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

        return { nap: nearestAP, pos: accessPointOfAP };
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