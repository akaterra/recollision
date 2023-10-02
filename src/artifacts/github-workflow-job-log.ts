import { Service } from 'typedi';
import { IArtifactService } from './artifact.service';
import { IProjectArtifact, IProjectDef } from '../project';
import { StreamState } from '../stream';
import { GithubIntegrationService } from '../integrations/github';
import { EntityService } from '../entities.service';
import { Autowired, hasScope } from '../utils';
import { ProjectsService } from '../projects.service';
import { AwaitedCache } from '../cache';
import { Status } from '../enums/status';

export type IGithubWorkflowJobLogArtifactConfig = {
  integration: IProjectDef['id'];
  cacheTtlSec?: number;
  saveAs?: string;
};

@Service()
export class GithubWorkflowJobLogArtifactService extends EntityService implements IArtifactService {
  static readonly type: string = 'github:workflowJob:log';

  @Autowired() protected projectsService: ProjectsService;
  protected cache = new AwaitedCache();

  constructor(public readonly config?: IGithubWorkflowJobLogArtifactConfig) {
    super();
  }

  async run(
    entity: { ref: IProjectArtifact['ref'], context?: Record<string, unknown> },
    streamState: StreamState,
    params?: Record<string, unknown>,
    scopes?: Record<string, boolean>,
  ): Promise<void> {
    if (!params?.githubWorkflowJobId) {
      return;
    }

    if (![ Status.FAILED, Status.COMPLETED ].includes(params?.githubWorkflowRunJobStatus as Status)) {
      return;
    }

    let artifact = hasScope('artifact', scopes)
      ? null
      : this.cache.get(params.githubWorkflowJobId as string);

    if (!artifact) {
      artifact = await this.getIntegration(entity.ref).workflowJobLogGet(
        params?.githubWorkflowJobId,
        entity.ref?.streamId,
      );
    }

    if (!artifact) {
      return;
    }

    this.cache.set(params.githubWorkflowJobId as string, artifact, this.config?.cacheTtlSec ?? 3600);

    if (entity.context) {
      entity.context.githubWorkflowJobLog = artifact;

      if (this.config?.saveAs) {
        const artifact = {
          id: this.config.saveAs,
          type: this.type,
          author: null,
          description: entity.context.githubWorkflowArtifact as string,
          link: null,
          metadata: {},
          steps: null,
          time: null,
        };

        streamState.pushArtifactUniq(artifact);
      }
    }
  }

  private getIntegration(ref: IProjectArtifact['ref']): GithubIntegrationService {
    return this.config?.integration
      ? this.projectsService
        .get(ref?.projectId)
        .getEnvIntegraionByIntegrationId<GithubIntegrationService>(this.config?.integration, 'github')
      : this.projectsService
        .get(ref?.projectId)
        .getEnvIntegraionByTargetIdAndStreamId<GithubIntegrationService>(
          ref?.targetId,
          ref?.streamId,
          'github',
        );
  }
}
