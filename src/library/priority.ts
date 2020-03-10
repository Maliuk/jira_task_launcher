import { Task } from "./task";

export interface PriorityInterface {
    getTasks(): Task[];
    addTask(title: string): boolean
    getTask(title: string): Task;
    clear(): void;
    removeStatuses(): void;
    addToMine(title: string, isMine?: boolean): Task;
    updateTaskStatus(title: string): Promise<any>;
}

abstract class Tasks implements PriorityInterface {
    protected tasks: Task[] = [];
    protected isMine: boolean = false;
    protected isPriority: boolean = false;

    constructor() {
    }

    public getTasks(): Task[] {
        return this.tasks.filter(this.filter);
    }

    public addTask(title: string): boolean {
        try {
            if (!this.getTask(title)) {
                let t = new Task(title);
                t.isMine = this.isMine;
                t.isPriority = this.isPriority;

                this.tasks.push(t);
                this.sort();

                return true;
            }
        }
        catch (e) {
            return false;
        }
    }

    public getTask(title: string): Task {
        for (const task of this.tasks) {
            if (task.title == title) {
                return task;
            }
        }
        new Task(title);
    }

    public sort() {
        this.tasks.sort((a, b) => (a.title > b.title) ? 1 : -1);
    }

    public clear(): void {
        this.tasks.length = 0;
    }

    protected filter(element: Task, index: number, array: Task[]): boolean {
        return true;
    }

    public removeStatuses(): void {
        for (const task of this.tasks)
            delete task.status;
    }

    public addToMine(title: string, isMine: boolean = true): Task {
        let task = this.getTask(title);
        task.isMine = isMine;
        return task;
    }

    async updateTaskStatus(title: string): Promise<string> {
        let task = this.getTask(title);
        await task.updateStatus();
        return task.status;
    }
}

export class Priority extends Tasks {
    protected isMine: boolean = false;
    protected isPriority: boolean = true;

    public clear(): void {
        this.tasks = this.tasks.filter(obj => {
            return obj.isMine == true;
        });
        for (const task of this.tasks)
            task.isPriority = false;
    }

    protected filter(element: Task, index: number, array: Task[]): boolean {
        return element.isPriority == true;
    }
}

export class MyTasks extends Tasks {
    protected isMine: boolean = true;
    protected isPriority: boolean = false;

    public clear(): void {
        this.tasks = this.tasks.filter(obj => {
            return obj.isPriority == true;
        });
        for (const task of this.tasks)
            task.isMine = false;
    }

    protected filter(element: Task, index: number, array: Task[]): boolean {
        return element.isMine == true;
    }
}