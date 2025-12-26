export interface Comment {
    id: number;
    ticket_id: number;
    author_id: number;
    content: string;
    created_at: string;
    author_name?: string;
    author_email?: string;
    author_role?: string;
}

export interface Ticket {
    id: number;
    subject: string;
    description: string;
    status_id: number;
    priority_id: number;
    created_by: number;
    assigned_to: number | null;
    created_at: string;
    updated_at: string;
    status_name?: string;
    priority_name?: string;
    created_by_name?: string;
    assigned_to_name?: string;
    comments?: Comment[];
}

export interface Status {
    id: number;
    name: string;
}

export interface Priority {
    id: number;
    name: string;
}
