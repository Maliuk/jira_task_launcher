import { Task } from "./task";

export class Priority {
    public text: string | Object;
    private tasks: Task[] = [];

    constructor() {
    }

    setTasks(text: string | Object): Task[] {
        this.clear();

        this.text = text;

        let regexp = /\w+-\d+/gmi;
        let found = this.text.toString().match(regexp);

        for (const f of found) {
            let t = new Task(f.toString());
            this.tasks.push(t);
        }

        this.tasks.sort((a, b) => (a.title > b.title) ? 1 : -1);

        return this.tasks;
    }

    getTasks(): Task[] {
        return this.tasks;
    }

    addTask(title: string | Object) {

    }

    getTask(title: string): Task {
        for (const task of this.tasks) {
            if (task.title == title) {
                return task;
            }
        }
        return new Task(title);
    }

    clear(): void {
        this.tasks.length = 0;
    }
}