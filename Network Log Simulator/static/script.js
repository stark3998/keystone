document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  // Set the canvas size
  canvas.width = 600; // Set the width of the canvas
  canvas.height = 600; // Set the height of the canvas

  var url = 'http://localhost:5001/v1/logs/logs'
fetch(url)
  .then(response => {
    createMaze();
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
        animateMarker(parsed.Location.x, parsed.Location.y)
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

  function createMaze() {
    const mazeContainer = document.getElementById('maze');
    for(let i = 0; i < 10; i++)
      for(let j = 0; j < 10; j++){
        const cellDiv = document.createElement('div');
        cellDiv.className = 'cell';
        cellDiv.textContent = '_';
        mazeContainer.appendChild(cellDiv);
    }
}

function animateMarker(x, y) {
  const mazeContainer = document.getElementById('maze');
  const cellDiv = document.createElement('div');
  cellDiv.className = 'marker';
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  cellDiv.style.top = ((x - 1) * 50 + 15) + 'px'; // Adjusted for marker size
  cellDiv.style.left = ((y - 1) * 50 + 15) + 'px'; // Adjusted for marker size
  cellDiv.style.backgroundColor = `rgb(${r},${g},${b})`;
  mazeContainer.appendChild(cellDiv);

  // Animate the marker along the path
  // pathData.forEach((point, index) => {
  //     setTimeout(() => {
  //         marker.style.top = (point.x * 50 + 15) + 'px'; // Adjusted for marker size
  //         marker.style.left = (point.y * 50 + 15) + 'px'; // Adjusted for marker size
  //     }, index * 1000); // Adjust the delay as needed
  // });
}

  // var url0 = 'http://localhost:4000/v1/route?choice=0&startx=0&starty=0&goalx=3&goaly=3'
  // var url1 = 'http://localhost:4000/v1/route?choice=1&startx=0&starty=0&goalx=9&goaly=1'
  // // Make a GET request to your Express server to fetch the path data
  // fetch(url0)
  //     .then(response => response.json())
  //     .then(pathData => {
  //         console.log("pathdata" + JSON.stringify(pathData));
  //         // Draw the animated path on the canvas
  //         // animatePath(ctx, pathData);
  //         createMaze(pathData.maze);
  //         animateMarker(pathData.path);
  //     })
  //     .catch(error => {
  //         console.error('Error fetching path data:', error);
  //     });
});