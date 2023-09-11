import { Inject, Service } from 'typedi';
import { IProjectFlowActionDef, IProjectTarget, IProjectTargetStream } from '../project';
import { IActionService } from './action.service';
import { ProjectsService } from '../projects.service';
import { EntityService } from '../entities.service';
import { Autowired } from '../utils';

@Service()
export class MoveActionService extends EntityService implements IActionService {
  @Autowired() protected projectsService: ProjectsService;

  get description() {
    return 'Moves selected streams between targets';
  }

  get type() {
    return 'move';
  }

  async run(
    action: IProjectFlowActionDef,
    targetsStreams?: Record<IProjectTarget['id'], [ IProjectTargetStream['id'], ...IProjectTargetStream['id'][] ] | true>,
  ): Promise<void> {
    const project = this.projectsService.get(action.ref.projectId);
    const sourceTargetIds = targetsStreams
      ? Object.keys(targetsStreams)
      : project.getFlowByFlowId(action.ref.flowId).targets;

    for (let tIdOfSource of sourceTargetIds) {
      for (let tIdOfTarget of action.targets) {
        const [ sId, tId ] = tIdOfTarget.split(':');

        if (tId) {
          tIdOfSource = sId;
          tIdOfTarget = tId;
        }

        const source = project.getTargetByTargetId(tIdOfSource);
        const target = project.getTargetByTargetId(tIdOfTarget);
        const streamIds = targetsStreams?.[tIdOfSource] === true
          ? Object.keys(target.streams)
          : targetsStreams?.[tIdOfSource] as string[] ?? Object.keys(target.streams);

        for (const sId of streamIds) {
          const sourceStream = project.getTargetStreamByTargetIdAndStreamId(tIdOfSource, sId, true);
          const targetStream = project.getTargetStreamByTargetIdAndStreamId(tIdOfTarget, sId, true);

          if (sourceStream && targetStream) {
            await project.getEnvStreamByTargetStream(targetStream)
              .streamMove(targetStream, sourceStream);

            sourceStream.isDirty = true;
            targetStream.isDirty = true;
          }
        }
      }
    }
  }
}