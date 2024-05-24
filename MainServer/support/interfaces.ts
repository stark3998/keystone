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
    chat_id: string;
    mac_address: string;
}

export interface dbFloorRowResponse { 
    payload?: PlanRow, 
    error?: string, 
    code: number 
}

export interface dbUsersResponse { 
    payload?: {
        primary_users: User[], 
        secondary_users: User[], 
    }
    error?: string, 
    code: number 
}

