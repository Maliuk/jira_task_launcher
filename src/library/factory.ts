import { MyTasks, Priority } from "./priority";

interface Factory {
    create(cls): any;
}


export enum flag {
    ALL_TASKS,
    PRIORITY,
    MY_TASKS
}

export class TaskFactory {
    create(cls: flag) {
        switch (cls) {
            case flag.PRIORITY:
                return new Priority();
            case flag.MY_TASKS:
                return new MyTasks();
        }
    }
}