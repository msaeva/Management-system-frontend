import {Project} from "@core/types/projects/Project";
import {Task} from "@core/types/Task";

export interface ProjectTask {
  project: Project;
  tasks: Task[];
}
