import { Allow, BackendMethod, remult } from "remult";
import { Roles } from "./Roles";
import { Task } from "./Task";

export class TasksController {
   @BackendMethod({ allowed: Roles.admin })
   static async setAll(completed: boolean) {
      const taskRepo = remult.repo(Task);

      for (const task of await taskRepo.find()) {
         await taskRepo.save({ ...task, completed });
      }
   }
}