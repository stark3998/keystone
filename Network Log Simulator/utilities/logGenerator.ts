import { faker } from '@faker-js/faker'
import { log, logResponse } from '../support/interfaces'
import { UserSimulator } from './userSimulator';

export class LogGenerator {

  constructor() {
    // Initialize any properties or perform any setup logic here
    // LogGenerator.generateRandomMacAddresses();
  }

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

  public static initializeUsers(floorPlan: any) {
    UserSimulator.initializeUsers(floorPlan);
  }

  // Generate a list of fake WiFi access point logs
  public static generateWifiAccessPointLogs(floorPlan: any): Promise<logResponse> {
    return new Promise((resolve) => {
      // List of possible device statuses
      var deviceStatuses: String[] = ['Connected', 'Failed'];

      // List of possible operating systems
      var operatingSystems: String[] = ['Windows', 'macOS', 'Linux', 'Android', 'iOS'];

      // List of possible access points

      // List of possible SSIDs
      var ssids: String[] = ['HomeNetwork', 'OfficeWiFi', 'PublicHotspot'];

      // Generate or update user location
      const location = UserSimulator.updateUserlocation(floorPlan);

      var logEntry: log = {
        'Device Status': deviceStatuses[Math.floor(Math.random() * deviceStatuses.length)],
        'Name': location.name,
        'User Name': location.name.replace(/\s/g, '').toLowerCase(),
        'MAC Address': location.mac_address,
        'IP Address': faker.internet.ip(),
        'OS': operatingSystems[Math.floor(Math.random() * operatingSystems.length)],
        'Associated Access Point': 'AP' + location.nap.toString(),
        'Associated SSID': ssids[Math.floor(Math.random() * ssids.length)],
        'RSSI (dBm)': location.signalStrength,
        'Best RSSI (dBm)': location.signalStrength,
        'Uplink Data': this.generateDataTransferAmount(),
        'Downlink Data': this.generateDataTransferAmount(),
        'Avg. data rate': Math.floor(Math.random() * 1000) + 1,
        'Connected / Disconnected Since': faker.date.recent().toISOString(),
        'First Detected At': faker.date.past().toISOString(),
        'Location': { x: location.x, y: location.y },
        'Sticky': Math.random() < 0.5,
        'Tag': faker.word.words(5),
      };
      //   console.log(logEntry);
      return resolve({ "statusCode": 200, "log": logEntry });
    })
  }
}

export let logGenerator = new LogGenerator()
