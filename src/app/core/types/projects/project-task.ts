import {Project} from "@core/types/projects/project";
import {Task} from "@core/types/task";

export interface ProjectTask {
  project: Project;
  tasks: Task[];
}
