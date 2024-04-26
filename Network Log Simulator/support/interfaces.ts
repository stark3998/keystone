export interface logResponse {
    "statusCode": number,
    "log"?: log,
    "error"?: String
}

// export interface logFailure {
//     "statusCode": number,
//     "error": String
// }

export interface log {
    'Device Status': String,
    'Name': String,
    'User Name': String,
    'MAC Address': String,
    'IP Address': String,
    'OS': String,
    'Associated Access Point': String,
    'Associated SSID': String,
    'RSSI (dBm)': number,
    'Best RSSI (dBm)': number,
    'Uplink Data': number,
    'Downlink Data': number,
    'Avg. data rate': number,
    'Connected / Disconnected Since': String,
    'First Detected At': String,
    'Location': String,
    'Sticky': boolean,
    'Tag': String,
}