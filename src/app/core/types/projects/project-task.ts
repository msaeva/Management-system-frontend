import {Project} from "@core/types/projects/project";
import {Task} from "@core/types/tasks/task";

export interface ProjectTask {
  project: Project;
  tasks: Task[];
}
