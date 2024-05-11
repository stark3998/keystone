import { faker } from '@faker-js/faker'
import { log, logResponse } from '../support/interfaces'
import { FloorPlan } from '../external/floorPlan';

export class LogGenerator {

    constructor() {
      // Initialize any properties or perform any setup logic here
      LogGenerator.generateRandomMacAddresses();
  }

    // Dictionary to store user mac addresses and their corresponding locations
    private static userLocations: { [macAddress: string]: { x: number, y: number } } = {};

    // Array to store randomly generated mac addresses
    private static generatedMacAddresses: String[] = [];

    // Function to generate a random MAC address
    public static generateMacAddress(): String {
        return Array.from({ length: 6 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(':');
    }

    // Generate 150 random mac addresses
    private static generateRandomMacAddresses(): void {
      for (let i = 0; i < 150; i++) {
          this.generatedMacAddresses.push(this.generateMacAddress());
      }
    }

    // Get a random mac address from the generated list
    private static getRandomMacAddress(): String {
      const index = Math.floor(Math.random() * this.generatedMacAddresses.length);
      return this.generatedMacAddresses.splice(index, 1)[0];
    }

    // Function to generate a random RSSI value
    public static generateRssi(): number {
        return Math.floor(Math.random() * (-30 - (-100)) + (-100));
    }

    // Function to generate random data transfer values in bytes
    public static generateDataTransferAmount(): number {
        return Math.floor(Math.random() * (1000000 - 1000) + 1000);
    }

    // public static getNetworkLogs(): Promise<logResponse> {
    //   return new Promise((resolve, reject) => {
    //     FloorPlan.getFloorPlan().then(floorPlanData => {
    //       this.generateWifiAccessPointLogs(floorPlanData.plan).then(response => {
    //           // console.log('Generated Log:', response.log);
    //           return resolve(response);
    //       }).catch(error => {
    //           console.error('Error generating log:', error);
    //           return reject({"statusCode": 500, "log": undefined});
    //       });
    //     })
    //     .catch(err => {
    //       console.log(err);
    //       return reject({"statusCode": 500, "log": undefined});
    //     });
    //   })
       
      
    // }


    // Generate a list of fake WiFi access point logs
    public static generateWifiAccessPointLogs(floorPlan: any): Promise<logResponse> {
        return new Promise((resolve, reject) => {
            // List of possible device statuses
        var deviceStatuses: String[] = ['Connected', 'Failed'];

        // List of possible operating systems
        var operatingSystems: String[] = ['Windows', 'macOS', 'Linux', 'Android', 'iOS'];

        // List of possible access points
        var accessPoints: String[] = ['AP1', 'AP2', 'AP3'];

        // List of possible SSIDs
        var ssids: String[] = ['HomeNetwork', 'OfficeWiFi', 'PublicHotspot'];



        // Generate or update user location
        const macAddress = this.getRandomMacAddress();
        const location = this.generateOrUpdateUserLocation(floorPlan, macAddress.toString());

        const logs = [];
          var logEntry: log = {
            'Device Status': deviceStatuses[Math.floor(Math.random() * deviceStatuses.length)],
            'Name': faker.person.fullName(),
            'User Name': faker.internet.userName(),
            'MAC Address': macAddress,
            'IP Address': faker.internet.ip(),
            'OS': operatingSystems[Math.floor(Math.random() * operatingSystems.length)],
            'Associated Access Point': accessPoints[Math.floor(Math.random() * accessPoints.length)],
            'Associated SSID': ssids[Math.floor(Math.random() * ssids.length)],
            'RSSI (dBm)': this.generateRssi(),
            'Best RSSI (dBm)': this.generateRssi(),
            'Uplink Data': this.generateDataTransferAmount(),
            'Downlink Data': this.generateDataTransferAmount(),
            'Avg. data rate': Math.floor(Math.random() * 1000) + 1,
            'Connected / Disconnected Since': faker.date.recent().toISOString(),
            'First Detected At': faker.date.past().toISOString(),
            'Location': location,
            'Sticky': Math.random() < 0.5,
            'Tag': faker.word.words(5),
          };
        //   console.log(logEntry);
          return resolve({"statusCode": 200, "log": logEntry});
        })
      }

      // Generate or update user location
      private static generateOrUpdateUserLocation(floorPlan: any, macAddress: string): { x: number, y: number } {
        const existingMacAddresses = Object.keys(this.userLocations);
        let location: { x: number, y: number };

        // Check if the mac address already exists
        if (existingMacAddresses.includes(macAddress)) {
            // Update existing user location
            location = this.updateUserLocation(macAddress, floorPlan);
        } else {
            // Generate new user location
            location = this.getRandomLocation(floorPlan);
            this.userLocations[macAddress] = location;
        }

        return location;
    }

    // Update user location
    private static updateUserLocation(macAddress: string, floorPlan: any): { x: number, y: number } {
      const userLocation = this.userLocations[macAddress];
      const possibleLocations = [
          { x: userLocation.x + 1, y: userLocation.y },
          { x: userLocation.x - 1, y: userLocation.y },
          { x: userLocation.x, y: userLocation.y + 1 },
          { x: userLocation.x, y: userLocation.y - 1 }
      ];
      const availableLocations = possibleLocations.filter(loc => !this.isLocationBlocked(loc, floorPlan));
      let updatedLocation: { x: number, y: number };

      if (availableLocations.length > 0) {
          updatedLocation = availableLocations[Math.floor(Math.random() * availableLocations.length)];
      } else {
          // If no available locations, keep the current location
          updatedLocation = userLocation;
      }

      // Update user location in the dictionary
      this.userLocations[macAddress] = updatedLocation;

      return updatedLocation;
  }

    // Helper function to get a random location within the floor plan
    private static getRandomLocation(floorPlan: any): { x: number, y: number } {
        // Create a list of allowed locations based on the floor plan
        const allowedLocations: { x: number, y: number }[] = [];
        // console.log(floorPlan);
        // console.log(floorPlan.width, floorPlan.height)
        for (let x = 1; x <= floorPlan.width; x++) {
            for (let y = 1; y <= floorPlan.height; y++) {
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
            return blockedLocation.x === location.x && blockedLocation.y === location.y;
        });
    }

      public static generateLogInIntervals() {
        const numLogs = 5;
        let intervalCounter = 0;

        const intervalId = setInterval(() => {
        var generatedLogs: any = this.generateWifiAccessPointLogs(NaN);
        console.log('Generated Log:', generatedLogs);
        intervalCounter++;

        if (intervalCounter >= numLogs) {
            clearInterval(intervalId);
            console.log('Logging complete.');
        }
        }, 1000);
        // setInterval(this.generateWifiAccessPointLogs, 10000);
      }
}

export let logGenerator = new LogGenerator()
