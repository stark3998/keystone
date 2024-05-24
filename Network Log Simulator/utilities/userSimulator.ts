import { th } from "@faker-js/faker";
import { FloorPlan } from "../external/floorPlan";
export class UserSimulator {
    // Dictionary to store user mac addresses and their corresponding metadata
    private static user_floor_locations: { [floor_id: number]: [{ x: number, y: number, nap: number, name: string, email: string, chat_id: string, mac_address: string }] } = {};
    private static user_dict: { [mac_address: string]: { x: number, y: number, nap: number, name: string, email: string, chat_id: string, mac_address: string } } = {};
    private static users_api = 'http://localhost:4000/v1/users';
    private static num_floors = 0;

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
        console.log("User: ", user);
        // console.log(`User: ${name}, MAC Address: ${mac_address}, Email: ${email}, Chat ID: ${chat_id}`);
        var randomPos = this.getRandomLocation(floorPlan);
        const nearestAP = this.findNearestAP({ x: randomPos.x, y: randomPos.y, nap: 0 }, floorPlan);
        console.log("Mac Address: ", mac_address);
        this.user_dict[mac_address] = { x: randomPos.x, y: randomPos.y, nap: nearestAP.nap, name: name, email: email, chat_id: chat_id, mac_address: mac_address };
    }

    public static initializeUsers(floorPlan: any) {
        // Clear the userLocations dictionary
        this.user_floor_locations = {};
        this.user_dict = {};

        // Make an API call to retrieve the list of users
        fetch(this.users_api)
            .then(response => response.json())
            .then(data => {
                var primary_users = data.payload.primary_users;
                var secondary_users = data.payload.secondary_users;
                console.log("Primary Users: ", primary_users.length);
                primary_users.forEach((user: { id: number, name: string, email: string, mac_address: string, chat_id: string }) => {
                    console.log("User: ", user);
                    this.add_user_to_db(user, floorPlan);
                });

                console.log("Secondary Users: ", secondary_users.length);
                secondary_users.forEach((user: { id: number, name: string, email: string, mac_address: string, chat_id: string }) => {
                    this.add_user_to_db(user, floorPlan);
                });
                var floor_ids: number[] = [];
                console.log("User Dict: ", Object.keys(this.user_dict).length);

                FloorPlan.getAllFloorPlans().then((floorPlan: any) => {
                    console.log("Floor Plan Count: ", floorPlan.plans.length);
                    this.num_floors = floorPlan.plans.length;
                    floorPlan.plans.forEach((floor: any) => {
                        floor_ids.push(floor.id);
                    });

                    secondary_users.forEach((user: { id: number, name: string, email: string, mac_address: string, chat_id: string }) => {
                        var randomNumber = Math.floor(Math.random() * (this.num_floors + 1));
                        if (this.user_floor_locations[floor_ids[randomNumber]] == undefined) {
                            this.user_floor_locations[floor_ids[randomNumber]] = [this.user_dict[user.mac_address]];
                        }
                        else {
                            this.user_floor_locations[floor_ids[randomNumber]].push(this.user_dict[user.mac_address]);
                        }
                    });
                    floor_ids.forEach((floor_id: number) => {
                        primary_users.forEach((user: { id: number, name: string, email: string, mac_address: string, chat_id: string }) => {
                            this.user_floor_locations[floor_id].push(this.user_dict[user.mac_address]);
                            console.log("User: ", user);
                        });
                        console.log(`Floor ID: ${floor_id}, Users Count : ${Object.keys(this.user_floor_locations[floor_id]).length}`);
                    });
                    console.log("User Floor Locations: ", this.user_floor_locations);
                });
            })
            .catch(error => {
                // Handle any errors that occur during the API call
                console.error('Error retrieving users:', error);
            });
    }


    // Update user location
    private static updateUserPosition(macAddress: string, floorPlan: any): { x: number, y: number } {
        const userLocation = this.user_dict[macAddress];
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

    public static updateUserlocation(floorPlan: any): { x: number, y: number, nap: number, signalStrength: number, macAddress: String } {
        var randomUser = Object.keys(this.user_floor_locations[floorPlan.id])[Math.floor(Math.random() * this.user_floor_locations[floorPlan.id].length)];
        console.log("Random User : ", randomUser);
        var randomPos = this.updateUserPosition(randomUser, floorPlan);

        const nearestAP = this.findNearestAP({ x: randomPos.x, y: randomPos.y, nap: 0 }, floorPlan);

        const signalStrength = this.calculateSignalStrength(randomPos, nearestAP.pos)
        this.user_floor_locations[floorPlan.id][randomUser] = { x: randomPos.x, y: randomPos.y, nap: nearestAP.nap };

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