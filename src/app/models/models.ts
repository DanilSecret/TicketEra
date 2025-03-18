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