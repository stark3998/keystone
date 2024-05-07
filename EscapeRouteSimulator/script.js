document.addEventListener('DOMContentLoaded', () => {
    // Get the canvas element
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Make a GET request to your Express server to fetch the path data
    fetch('http://localhost:4000/v1/route')
        .then(response => response.json())
        .then(pathData => {
            // Draw the animated path on the canvas
            animatePath(ctx, pathData);
        })
        .catch(error => {
            console.error('Error fetching path data:', error);
        });
});

function animatePath(ctx, pathData) {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the path
    ctx.beginPath();
    ctx.moveTo(pathData[0].x, pathData[0].y);
    for (let i = 1; i < pathData.length; i++) {
        ctx.lineTo(pathData[i].x, pathData[i].y);
    }
    ctx.stroke();

    // Request the next frame for animation
    requestAnimationFrame(() => animatePath(ctx, pathData));
}
