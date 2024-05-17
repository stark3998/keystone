// document.addEventListener('DOMContentLoaded', () => {
//     // Get the canvas element
//     const canvas = document.getElementById('canvas');
//     const ctx = canvas.getContext('2d');

//     // Make a GET request to your Express server to fetch the path data
//     fetch('http://localhost:4000/v1/route')
//         .then(response => response.json())
//         .then(pathData => {
//             console.log("pathdata" + JSON.stringify(pathData));
//             // Draw the animated path on the canvas
//             animatePath(ctx, pathData);
//             // createMaze();
//             // animateMarker();
//         })
//         .catch(error => {
//             console.error('Error fetching path data:', error);
//         });
// });

// function animatePath(ctx, pathData) {
//     // Clear the canvas
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // Draw the path
//     ctx.beginPath();
//     ctx.moveTo(pathData[0].x, pathData[0].y);
//     for (let i = 1; i < pathData.length; i++) {
//         ctx.lineTo(pathData[i].x, pathData[i].y);
//     }
//     ctx.stroke();

//     // Request the next frame for animation
//     requestAnimationFrame(() => animatePath(ctx, pathData));
// }

// // Function to create the maze
//     function createMaze() {
//         const mazeContainer = document.getElementById('maze');
//         mazeData.forEach((row, rowIndex) => {
//             row.forEach((cell, colIndex) => {
//                 const cellDiv = document.createElement('div');
//                 cellDiv.className = 'cell';
//                 cellDiv.textContent = cell === 1 ? 'X' : '_';
//                 mazeContainer.appendChild(cellDiv);
//             });
//         });
//     }

//     // Function to animate the marker along the path
//     function animateMarker() {
//         const marker = document.getElementById('marker');

//         // Animate the marker along the path
//         pathData.forEach((point, index) => {
//             setTimeout(() => {
//                 marker.style.left = (point.x * 50 + 15) + 'px'; // Adjusted for marker size
//                 marker.style.top = (point.y * 50 + 15) + 'px'; // Adjusted for marker size
//             }, index * 1000); // Adjust the delay as needed
//         });
//     }

//     // // Call the functions to create maze and animate marker
//     // createMaze();
//     // animateMarker();

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Set the canvas size
    canvas.width = 600; // Set the width of the canvas
    canvas.height = 600; // Set the height of the canvas

    var url = 'http://localhost:4000/v1/userRoute?floorplanName=DBH 5th Floor&userX=10&userY=9'
    // Make a GET request to your Express server to fetch the path data
    fetch(url)
        .then(response => response.json())
        .then(pathData => {
            console.log("pathdata" + JSON.stringify(pathData));
            // Draw the animated path on the canvas
            // animatePath(ctx, pathData);
            createMaze(pathData.maze);
            animateMarker(pathData.path);
        })
        .catch(error => {
            console.error('Error fetching path data:', error);
        });
});
// Maze data
// const mazeData = [[0,0,0,0],[0,1,1,0],[0,0,1,0],[0,0,0,0]];
// const pathData = [{"x":0,"y":0},{"x":1,"y":0},{"x":2,"y":1},{"x":3,"y":2},{"x":3,"y":3}];

// Function to create the maze
function createMaze(mazeData) {
    const mazeContainer = document.getElementById('maze');
    mazeContainer.style.setProperty('--maze-columns', mazeData.length);
    mazeContainer.style.setProperty('--maze-rows', mazeData[0].length);
    mazeData.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'cell';
            if(cell == 1)
                cellDiv.textContent = 'X';
            if(cell == 0)
                cellDiv.textContent = '_';
            if(cell == 2)
                cellDiv.textContent = 'Start';
            if(cell == 9)
                cellDiv.textContent = 'Exit';
            mazeContainer.appendChild(cellDiv);
        });
    });
}

// Function to animate the marker along the path
function animateMarker(pathData) {
    const marker = document.getElementById('marker');

    // Animate the marker along the path
    pathData.forEach((point, index) => {
        setTimeout(() => {
            marker.style.top = (point.x * 50 + 15) + 'px'; // Adjusted for marker size
            marker.style.left = (point.y * 50 + 15) + 'px'; // Adjusted for marker size
        }, index * 700); // Adjust the delay as needed
    });
}

// Call the functions to create maze and animate marker
// createMaze();
// animateMarker();