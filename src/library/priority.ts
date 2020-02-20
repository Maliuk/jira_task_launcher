import { Task } from "./task";

export class Priority {
    private text: string;
    private tasks: Task[] = [];

    constructor() {
    }

    parseText(text: string): Task[] {
        this.text = text;

        let regexp = /\w+-\d+/gmi;
        let found = this.text.match(regexp);

        for (const f of found) {
            let t = new Task(f.toString());
            this.tasks.push(t);
        }

        return this.tasks;
    }

    getTasks() : Task[] {
        return this.tasks;
    }
}