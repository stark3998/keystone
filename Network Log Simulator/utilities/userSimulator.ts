import { th } from "@faker-js/faker";
import { FloorPlan } from "../external/floorPlan";
import { urls } from "../support/urls";
import e from "express";

export class UserSimulator {
    // Dictionary to store user mac addresses and their corresponding metadata
    private static user_floor_locations: { [floor_id: number]: [{ x: number, y: number, nap: number, name: string, email: string, chat_id: string, mac_address: string, os_type: string }] } = {};
    private static user_dict: { [mac_address: string]: { x: number, y: number, nap: number, name: string, email: string, chat_id: string, mac_address: string, os_type: string, signal_strength: number } } = {};
    private static num_floors = 0;
    private static primary_users_location: { [floor_id: number]: [{ x: number, y: number, nap: number, name: string, email: string, chat_id: string, mac_address: string, os_type: string, signal_strength: number }] } = {};
    private static allowedLocations: { [floor_id: number]: [{ x: number, y: number }] } = {};

    // private static numberOfUsers: number = 150;
    // Function to generate a random MAC address
    public static generateMacAddress(floor: string): String {
        return floor + Array.from({ length: 5 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(':');
    }

    public static initialize_locations() {
        console.log("Initializing Locations");
        FloorPlan.getPlanIds().then((floorPlans: any) => {
            // console.log(floorPlan.plans.length);
            console.log("Floor Plan Count: ", floorPlans.plans.length);
            floorPlans.plans.forEach((floorPlan: any) => {
                for (let x = 0; x < floorPlan.width - 1; x++) {
                    for (let y = 0; y < floorPlan.height - 1; y++) {
                        var location = { x, y };
                        if (!this.isLocationBlocked(location, floorPlan)) {
                            if (this.allowedLocations[floorPlan.id] == undefined) {
                                this.allowedLocations[floorPlan.id] = [location];
                            }
                            else {
                                this.allowedLocations[floorPlan.id].push(location);
                            }
                        }
                        // else {
                        //     console.log("Blocked Location: ", location.x, location.y);
                        // }
                    }
                }
            });
        });
    }

    // Helper function to get a random location within the floor plan
    private static getRandomLocation(floorPlan: any): { x: number, y: number } {
        var allowed_loc_length: number = this.allowedLocations[floorPlan.id]?.length;
        if (allowed_loc_length == 0 || allowed_loc_length == undefined) {
            console.log("Initializing Locations");
            this.initialize_locations();
        }
        var random_location_index = Math.floor(Math.random() * allowed_loc_length);
        return this.allowedLocations[floorPlan.id][random_location_index];
    }

    public static isLocationBlocked(location: { x: number, y: number }, floorPlan: any): boolean {
        // console.log(floorPlan.data.blocked, "Hii", location.x, location.y);
        // var block = JSON.parse(floorPlan.data);
        return floorPlan.data.blocked.some((blockedLocation: any) => {
            // if (blockedLocation.x === location.x && blockedLocation.y === location.y) {
            //     console.log(blockedLocation.x, blockedLocation.y, location.x, location.y);
            // })
            var flag: Boolean = (blockedLocation.x === location.x && blockedLocation.y === location.y) || location.x < 0 || location.x >= floorPlan.width || location.y < 0 || location.y >= floorPlan.height
            // if (flag) {
            //     // console.log("Blocked Location: ", blockedLocation.x, blockedLocation.y, location.x, location.y);
            //     console.log("Floor Plan: ", floorPlan.width, floorPlan.height, location.x, location.y, blockedLocation.x, blockedLocation.y);
            // }
            return flag;
        });
    }

    private static add_user_to_db(user: { id: number, name: string, email: string, mac_address: string, chat_id: string, os_type: string }, floorPlan: any) {
        const { id, name, email, mac_address, chat_id, os_type } = user;
        // console.log("User: ", user);
        // console.log(`User: ${name}, MAC Address: ${mac_address}, Email: ${email}, Chat ID: ${chat_id}`);
        var randomPos = this.getRandomLocation(floorPlan);
        // console.log(floorPlan.width);
        const nearestAP = this.findNearestAP({ x: randomPos.x, y: randomPos.y, nap: 0 }, floorPlan);
        const signalStrength = this.calculateSignalStrength(randomPos, nearestAP.pos);
        // console.log("Mac Address: ", mac_address);
        this.user_dict[mac_address] = { x: randomPos.x, y: randomPos.y, nap: nearestAP.nap, name: name, email: email, chat_id: chat_id, mac_address: mac_address, os_type: os_type, signal_strength: signalStrength };
    }

    public static initializeUsers() {
        // Clear the userLocations dictionary
        this.user_floor_locations = {};
        this.user_dict = {};

        // Make an API call to retrieve the list of users
        fetch(urls.main_server + urls.users_api)
            .then(response => response.json())
            .then(data => {
                var primary_users = data.payload.primary_users;
                var secondary_users = data.payload.secondary_users;
                // console.log("Primary Users: ", primary_users.length);
                // primary_users.forEach((user: { id: number, name: string, email: string, mac_address: string, chat_id: string, os_type: string }) => {
                //     this.add_user_to_db(user, floorPlan);
                // });

                // // console.log("Secondary Users: ", secondary_users.length);
                // secondary_users.forEach((user: { id: number, name: string, email: string, mac_address: string, chat_id: string, os_type: string }) => {
                //     this.add_user_to_db(user, floorPlan);
                // });
                var floor_ids: number[] = [];
                var floor_plans: any = {};
                console.log("User Dict: ", Object.keys(this.user_dict).length);

                FloorPlan.getPlanIds().then((floorPlan: any) => {
                    // console.log(floorPlan.plans.length);
                    console.log("Floor Plan Count: ", floorPlan.plans.length);
                    this.num_floors = floorPlan.plans.length;
                    floorPlan.plans.forEach((floor: any) => {
                        floor_ids.push(floor.id);
                        floor_plans[floor.id] = floor;
                        //  console.log(floor.width);
                    });

                    secondary_users.forEach((user: { id: number, name: string, email: string, mac_address: string, chat_id: string, os_type: string }) => {
                        var randomNumber = Math.floor(Math.random() * (this.num_floors));
                        // console.log(floor_ids[randomNumber], floor_plans[floor_ids[randomNumber]], floor_ids, randomNumber);
                        // console.log(floor_plans[randomNumber], randomNumber, floor_plans);
                        this.add_user_to_db(user, floor_plans[floor_ids[randomNumber]]);
                        if (this.user_floor_locations[floor_ids[randomNumber]] == undefined) {
                            this.user_floor_locations[floor_ids[randomNumber]] = [this.user_dict[user.mac_address]];
                        }
                        else {
                            this.user_floor_locations[floor_ids[randomNumber]].push(this.user_dict[user.mac_address]);
                        }
                    });
                    floor_ids.forEach((floor_id: number) => {
                        primary_users.forEach((user: { id: number, name: string, email: string, mac_address: string, chat_id: string, os_type: string }) => {
                            this.add_user_to_db(user, floor_plans[floor_id]);
                            this.user_floor_locations[floor_id].push(this.user_dict[user.mac_address]);
                            if (this.primary_users_location[floor_id] == undefined) {
                                this.primary_users_location[floor_id] = [this.user_dict[user.mac_address]];
                            }
                            else {
                                this.primary_users_location[floor_id].push(this.user_dict[user.mac_address]);
                            }
                            // console.log("User: ", user);
                        });
                        // console.log(`Floor ID: ${floor_id}, Users Count : ${Object.keys(this.user_floor_locations[floor_id]).length}`);
                    });
                    // console.log("User Floor Locations: ", this.user_floor_locations);
                });
            })
            .catch(error => {
                // Handle any errors that occur during the API call
                console.error('Error retrieving users:', error);
            });
    }

    public static getPrimaryUsersLocation(floorId: number) {
        return this.primary_users_location[floorId];
    }

    // Update user location
    private static updateUserPosition(macAddress: string, floorPlan: any): { x: number, y: number } {
        const userLocation = this.user_dict[macAddress];
        const possibleLocations = [
            { x: userLocation.x + 3, y: userLocation.y },
            { x: userLocation.x - 3, y: userLocation.y },
            { x: userLocation.x, y: userLocation.y + 3 },
            { x: userLocation.x, y: userLocation.y - 3 },
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

    public static updateUserlocation(floorPlan: any): { x: number, y: number, nap: number, signalStrength: number, mac_address: String, name: String, email: String, chat_id: String, os_type: String } {
        var floor_obj = this.user_floor_locations[floorPlan.id];
        var random_user_id = Math.floor(Math.random() * this.user_floor_locations[floorPlan.id].length);
        var random_user_obj = Object(floor_obj)[random_user_id];
        var updated_pos = this.updateUserPosition(random_user_obj.mac_address, floorPlan);
        // console.log("Old User: ", this.user_floor_locations[floorPlan.id][random_user_id]);
        random_user_obj.x = updated_pos.x;
        random_user_obj.y = updated_pos.y;

        const nearestAP = this.findNearestAP({ x: updated_pos.x, y: updated_pos.y, nap: 0 }, floorPlan);

        const signalStrength = this.calculateSignalStrength(updated_pos, nearestAP.pos)
        random_user_obj.signalStrength = signalStrength;
        random_user_obj.nap = nearestAP.nap;
        this.user_floor_locations[floorPlan.id][random_user_id] = random_user_obj;
        this.user_dict[random_user_obj.mac_address] = random_user_obj;
        // console.log("Updated User: ", this.user_floor_locations[floorPlan.id][random_user_id]);
        return random_user_obj;

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