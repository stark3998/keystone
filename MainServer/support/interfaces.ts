export interface PlanRow {
    name: string;
    description: string;
    data: {
        blocked: { x: number; y: number }[];
        wifi: { x: number; y: number }[];
        audio: { x: number; y: number }[];
        access: { x: number; y: number }[];
    };
    thumbnail: string;
    width: number;
    height: number;
}

export interface FloorPlanResponse { 
    payload?: PlanRow, 
    error?: string, 
    code: number 
}