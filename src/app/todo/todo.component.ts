import { Component, OnInit } from '@angular/core';
import { remult } from 'remult';
import { TasksController } from 'src/shared/TasksController';
import { Task } from '../../shared/Task';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent implements OnInit {
  taskRepo = remult.repo(Task);
  tasks: Task[] = [];
  hideCompleted = false;
  ngOnInit() {
    this.fetchTasks();
  }

  async fetchTasks() {
    try {
      this.tasks = await this.taskRepo.find({
        limit: 20,
        orderBy: { completed: 'asc' },
        where: { completed: this.hideCompleted ? false : undefined },
      });
    } catch (error: any) {
      alert(error.message);
    }
    
  }

  async saveTask(task: Task) {
    try {
      const savedTask = await this.taskRepo.save(task);
      this.tasks = this.tasks.map((t) => (t === task ? savedTask : t));
    } catch (error: any) {
      alert(error.message);
    }
  }
  addTask() {
    this.tasks.push(new Task());
  }

  async deleteTask(task: Task) {
    try {
      await this.taskRepo.delete(task);
      this.tasks = this.tasks.filter((t) => t !== task);
    } catch (error: any) {
      alert(error.message);
    }
  }
  async setAll(completed: boolean) {
    // for (const task of await this.taskRepo.find()) {
    //   await this.taskRepo.save({ ...task, completed });
    // }
    await TasksController.setAll(completed);
    this.fetchTasks()
  };
}
