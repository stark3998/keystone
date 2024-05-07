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
    
    public static aStar(start: myNode, goal: myNode, maze: number[][]): myNode[] {
        const openList: myNode[] = [start];
        const closedList: myNode[] = [];
        
        while (openList.length > 0) {
            const current: myNode = openList.reduce((minmyNode, myNode) => myNode.f < minmyNode.f ? myNode : minmyNode, openList[0]);
            
            if (current.x === goal.x && current.y === goal.y) {
                // Reconstruct path
                const path: myNode[] = [];
                let myNode: myNode | null = current;
                while (myNode !== null) {
                    path.unshift(myNode);
                    myNode = myNode.parent;
                }
                return path;
            }
            
            openList.splice(openList.indexOf(current), 1);
            closedList.push(current);
            
            const neighbors: myNode[] = [];
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    const newX = current.x + dx;
                    const newY = current.y + dy;
                    if (newX >= 0 && newX < maze.length && newY >= 0 && newY < maze[0].length && maze[newX][newY] !== 1) {
                        const neighbor = new myNode(newX, newY, current, current.g + 1, this.manhattanDistance(new myNode(newX, newY), goal));
                        if (!closedList.some(myNode => myNode.x === neighbor.x && myNode.y === neighbor.y)) {
                            neighbors.push(neighbor);
                        }
                    }
                }
            }
            
            neighbors.forEach(neighbor => {
                const existingmyNode = openList.find(myNode => myNode.x === neighbor.x && myNode.y === neighbor.y);
                if (!existingmyNode || neighbor.g < existingmyNode.g) {
                    if (existingmyNode) {
                        openList.splice(openList.indexOf(existingmyNode), 1);
                    }
                    openList.push(neighbor);
                }
            });
        }
        
        return []; // No solution
    }

    public static runAStar(startmyNode: myNode, goalmyNode: myNode, maze: number[][]): Promise<myNode[]> {
        return new Promise((resolve, reject) => {
            // const startmyNode = new myNode(0, 0);
            // const goalmyNode = new myNode(3, 3);
            // const maze = this.maze(0, 0);
            const path: myNode[] = this.aStar(startmyNode, goalmyNode, maze);
            console.log(path);
            return resolve(path);
        })
    }

    public static maze(choice: number = 0): number[][] {
        var mazeNum = [[
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 0]
        ],
        [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 1, 0, 1],
            [1, 1, 1, 1, 1, 0, 0, 1, 0, 1],
            [1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
            [1, 1, 1, 1, 1, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 1, 1, 1, 0, 0, 0, 1],
            [1, 0, 1, 0, 0, 1, 1, 1, 1, 1],
            [1, 0, 1, 1, 1, 1, 1, 1, 1, 1]
        ]];
        return mazeNum[choice];
        // var maze: String[] = []
        // for(let i = 0; i < mazeNum.length; i++){
        //     maze[i] = "";
        //     for(let j = 0; j < mazeNum[i].length; j++){
        //         if(i == x && j == y)
        //             maze[i] += "X ";
        //         else
        //             maze[i] += mazeNum[i][j].toString() + " ";
        //     }
        // }
        // return maze;
    }
}

export let aStar = new Astar()

