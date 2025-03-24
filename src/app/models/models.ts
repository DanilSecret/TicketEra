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

export interface TopicInterface {
    id:number;
    name:string;
}

export interface UserProfileInterface {
    uuid:string;
    username: string;
    email:string;
    role:string;
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

}

export interface JwtPayload {
    userUuid: string;
    username: string;
    userEmail: string;
}
