import { faker } from '@faker-js/faker'
import { log, logResponse } from '../support/interfaces'

export class LogGenerator {

    // Function to generate a random MAC address
    public static generateMacAddress(): String {
        return Array.from({ length: 6 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(':');
    }

    // Function to generate a random RSSI value
    public static generateRssi(): number {
        return Math.floor(Math.random() * (-30 - (-100)) + (-100));
    }

    // Function to generate random data transfer values in bytes
    public static generateDataTransferAmount(): number {
        return Math.floor(Math.random() * (1000000 - 1000) + 1000);
    }

    // Generate a list of fake WiFi access point logs
    public static generateWifiAccessPointLogs(): Promise<logResponse> {
        return new Promise((resolve, reject) => {
            // List of possible device statuses
        var deviceStatuses: String[] = ['Connected', 'Failed'];

        // List of possible operating systems
        var operatingSystems: String[] = ['Windows', 'macOS', 'Linux', 'Android', 'iOS'];

        // List of possible access points
        var accessPoints: String[] = ['AP1', 'AP2', 'AP3'];

        // List of possible SSIDs
        var ssids: String[] = ['HomeNetwork', 'OfficeWiFi', 'PublicHotspot'];

        const logs = [];
          var logEntry: log = {
            'Device Status': deviceStatuses[Math.floor(Math.random() * deviceStatuses.length)],
            'Name': faker.person.fullName(),
            'User Name': faker.internet.userName(),
            'MAC Address': this.generateMacAddress(),
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
            'Location': {"x": Math.floor(Math.random() * 10) + 1, "y": Math.floor(Math.random() * 10) + 1},
            'Sticky': Math.random() < 0.5,
            'Tag': faker.word.words(5),
          };
        //   console.log(logEntry);
          return resolve({"statusCode": 200, "log": logEntry});
        })
      }

      public static generateLogInIntervals() {
        const numLogs = 5;
        let intervalCounter = 0;

        const intervalId = setInterval(() => {
        var generatedLogs: any = this.generateWifiAccessPointLogs();
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
