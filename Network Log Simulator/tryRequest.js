var url = 'http://localhost:4000/v1/userlocation/userlocation?name=DBH%206th%20Floor'
fetch(url)
  .then(response => {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedData = '';

    // Define a function to read the stream
    const readStream = () => {
      reader.read().then(({ done, value }) => {
        if (done) {
          console.log('Stream finished');
          // Parse the accumulated data as JSON
          // const jsonData = JSON.parse(accumulatedData);
          // console.log('Received data:', jsonData);
          return;
        }

        // Decode the chunk of data
        const chunk = decoder.decode(value, { stream: true });
        const parsed = JSON.parse(chunk);
        console.log(parsed);
        
        // Accumulate the chunk of data
        accumulatedData += chunk;

        // Continue reading the stream
        readStream();
      }).catch(error => {
        console.error('Error reading stream:', error);
      });
    };

    // Start reading the stream
    readStream();
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });