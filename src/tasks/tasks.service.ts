import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
    findAll() {
        return ['Task A', 'Task B', 'Task C', 'Task D'];
    }
}
