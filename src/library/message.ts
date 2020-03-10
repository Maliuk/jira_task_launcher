export interface MessageInterface {
    action: string;
    body: any;
}

export class Message implements MessageInterface {
    public action: string;
    public body : any;

    constructor(action: string, body?: any) {
        this.action = action;
        this.body = body || null;
    }
}