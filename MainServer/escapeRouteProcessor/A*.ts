export class myNode {
    x: number;
    y: number;
    parent: myNode | null;
    g: number;
    h: number;

    constructor(x: number, y: number, parent: myNode | null = null, g: number = 0, h: number = 0) {
        this.x = x;
        this.y = y;
        this.parent = parent;
        this.g = g;
        this.h = h;
    }

    get f(): number {
        return this.g + this.h;
    }
}

export class Astar {
    public static manhattanDistance(current: myNode, goal: myNode): number {
        return Math.abs(current.x - goal.x) + Math.abs(current.y - goal.y);
    }

    public static aStar(start: myNode, goals: myNode[], maze: number[][]): myNode[] {
        const openList: myNode[] = [start];
        const closedList: myNode[] = [];

        while (openList.length > 0) {
            const current: myNode = openList.reduce((minNode, node) => node.f < minNode.f ? node : minNode, openList[0]);

            if (goals.some(goal => current.x === goal.x && current.y === goal.y)) {
                // console.log("Found goal node:", current);
                // Reconstruct path
                const path: myNode[] = [];
                let node: myNode | null = current;
                while (node !== null) {
                    // console.log("Adding node to path:", node);
                    path.unshift(node);
                    node = node.parent;
                }
                // console.log("Final path:", path);
                return path;
            }

            openList.splice(openList.indexOf(current), 1);
            closedList.push(current);

            const neighbors: myNode[] = [];

            // Generate neighbors for horizontal and vertical movement only
            const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // Left, Right, Up, Down

            for (const [dx, dy] of directions) {
                const newX = current.x + dx;
                const newY = current.y + dy;
                if (newX >= 0 && newX < maze.length && newY >= 0 && newY < maze[0].length && maze[newX][newY] !== 1) {
                    const neighbor = new myNode(
                        newX,
                        newY,
                        current,
                        current.g + 1,
                        Math.min(...goals.map(goal => this.manhattanDistance(new myNode(newX, newY), goal)))
                    );
                    
                    //const neighbor = new myNode(newX, newY, current, current.g + 1, this.manhattanDistance(new myNode(newX, newY), goals[0]));
                    if (!closedList.some(node => node.x === neighbor.x && node.y === neighbor.y)) {
                        neighbors.push(neighbor);
                    }
                }
            }

            neighbors.forEach(neighbor => {
                const existingNode = openList.find(node => node.x === neighbor.x && node.y === neighbor.y);
                if (!existingNode || neighbor.g < existingNode.g) {
                    if (existingNode) {
                        openList.splice(openList.indexOf(existingNode), 1);
                    }
                    openList.push(neighbor);
                }
            });
        }

        return []; // No solution
    }

    public static runAStar(startNode: myNode, goalNodes: myNode[], maze: number[][]): Promise<myNode[]> {
        return new Promise((resolve, reject) => {
            const path: myNode[] = this.aStar(startNode, goalNodes, maze);
            // console.log(path);
            return resolve(path);
        });
    }
}

export let aStar = new Astar()

