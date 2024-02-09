import random
import time
from faker import Faker
import json

# Initialize Faker to generate fake data
fake = Faker()

# List of possible device statuses
device_statuses = ['Connected', 'Failed']

# List of possible operating systems
operating_systems = ['Windows', 'macOS', 'Linux', 'Android', 'iOS']

# List of possible access points
access_points = ['AP1', 'AP2', 'AP3']

# List of possible SSIDs
ssids = ['HomeNetwork', 'OfficeWiFi', 'PublicHotspot']

# Function to generate a random MAC address
def generate_mac_address():
    return ':'.join(['%02x' % random.randint(0, 255) for _ in range(6)])

# Function to generate a random RSSI value
def generate_rssi():
    return random.randint(-100, -30)

# Function to generate random data transfer values in bytes
def generate_data_transfer_amount():
    return random.randint(1000, 1000000)

# Generate a list of fake WiFi access point logs
def generate_wifi_access_point_logs(n):
    logs = []
    for _ in range(n):
        log_entry = {
            'Device Status': random.choice(device_statuses),
            'Name': fake.name(),
            'User Name': fake.user_name(),
            'MAC Address': generate_mac_address(),
            'IP Address': fake.ipv4(),
            'OS': random.choice(operating_systems),
            'Associated Access Point': random.choice(access_points),
            'Associated SSID': random.choice(ssids),
            'RSSI (dBm)': generate_rssi(),
            'Best RSSI (dBm)': generate_rssi(),
            'Uplink Data': generate_data_transfer_amount(),
            'Downlink Data': generate_data_transfer_amount(),
            'Avg. data rate': random.randint(1, 1000),
            'Connected / Disconnected Since': str(fake.date_time_this_month()),
            'First Detected At': str(fake.date_time_this_year()),
            'Location': fake.city(),
            'Sticky': random.choice([True, False]),
            'Tag': fake.word(),
        }
        logs.append(log_entry)
    return logs

# Example: Generate 5 WiFi access point log entries
num_logs = 500
generated_logs = generate_wifi_access_point_logs(num_logs)
logs = []
for log in generated_logs:
    logs.append(log)
with open("wifi_access_point_logs.json", "w") as file:
    json.dump(logs, file, indent=4)