import { Inject, Service } from 'typedi';
import { IProjectFlowActionDef } from '../project';
import { IActionService } from './action.service';
import { ProjectsService } from '../projects.service';
import { EntityService } from '../entities.service';

@Service()
export class VersionOverrideActionService extends EntityService implements IActionService {
  @Inject() protected projectsService: ProjectsService;

  get type() {
    return 'version:override';
  }

  async run(action: IProjectFlowActionDef, targetsStreams?: Record<string, [ string, ...string[] ] | true>): Promise<void> {
    const project = this.projectsService.get(action.ref.projectId);
    const sourceTargetIds = targetsStreams
      ? Object.keys(targetsStreams)
      : project.getFlow(action.ref.flowId).targets;

    for (let sIdOfSource of sourceTargetIds) {
      for (let tIdOfTarget of action.targets) {
        const [ sId, tId ] = tIdOfTarget.split(':');

        if (tId) {
          sIdOfSource = sId;
          tIdOfTarget = tId;
        }

        const source = project.getTargetByTargetId(sIdOfSource);
        const target = project.getTargetByTargetId(tIdOfTarget);

        await project.getEnvVersioningByTarget(target).override(source, target);

        source.isDirty = true;
        target.isDirty = true;
      }
    }
  }
}
