import asyncio
import requests

async def fetch_data_stream(url):
    try:
        with requests.get(url, stream=True) as response:
            # Check if the response is successful
            if response.status_code == 200:
                # Iterate over the stream and print each line of data
                for line in response.iter_lines():
                    if line:
                        print(line.decode('utf-8'))  # Assuming data is UTF-8 encoded
            else:
                print(f"Failed to fetch data: {response.status_code}")
    except requests.RequestException as e:
        print(f"Error fetching data: {e}")

async def main():
    # URL of the data stream API
    url = 'http://localhost:5001/v1/logs/logs'  # Replace with your API endpoint

    # Fetch data stream asynchronously
    await fetch_data_stream(url)

# Run the asynchronous event loop
if __name__ == "__main__":
    asyncio.run(main())