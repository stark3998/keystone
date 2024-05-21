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

export interface User {
    id: string;
    name: string;
    email: string;
    mac_address: string;
    chat_id: string;
}

export interface dbFloorRowResponse { 
    payload?: PlanRow, 
    error?: string, 
    code: number 
}

export interface dbUsersResponse { 
    payload?: User[], 
    error?: string, 
    code: number 
}

