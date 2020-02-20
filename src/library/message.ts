enum MessageTypes {
    tasks,
    update
}

interface Message {

}

export class TaskMessage implements Message {
    constructor() {
    }
}