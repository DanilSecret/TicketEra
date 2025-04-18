export interface RegisterFormData {
    username: string;
    email: string
    password: string;
    confirmPassword: string;
}

export interface LoginFormData {
    username: string;
    password: string;
}
export interface CreateTicketFormData {
    title: string;
    description: string;
    topic_id: number;
}

export interface ChangeStatusFormData {
    status_id: number;
}

export interface StatusInterface {
    id:number;
    name:string;
}

export interface TopicInterface {
    id:number;
    name:string;
}

export interface TicketInterface {
    uuid: string;
    title: string;
    description: string;
    topic_id: string;
    author_uuid: string;
    create_at: Date;
    status_id: string;
    author: string;
    author_email: string;
    status_color: string;
}

export interface JwtPayload {
    userUuid: string;
    username: string;
    userEmail: string;
    userRole: string;
    userResp: number|null;
}
