enum MessageTypes {
    tasks,
    update
}

interface MessageInterface {
    getMessage();
    setMessage();
}

abstract class Message implements MessageInterface {
    protected body : JSON;
    protected messageType : MessageTypes;

    constructor() {
    }

    getMessage() : JSON {
        return this.body;
    }

    setMessage() {
    }
}

export class TaskMessage extends Message {
    protected messageType = MessageTypes.tasks;

    constructor() {
        super();
    }
}

export class UpdateMessage extends Message {
    protected messageType = MessageTypes.update;

    constructor() {
        super();
    }
}