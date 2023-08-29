import { Inject, Service } from 'typedi';
import semver from 'semver';
import { IVersioningService } from './versioning.service';
import { IProjectTargetDef, IProjectTargetStreamDef } from '../project';
import { EntityService } from '../entities.service';
import { IStorageService } from '../storages/storage.service';
import { Autowired, resolvePlaceholders } from '../utils';
import { ProjectsService } from '../projects.service';

@Service()
export class StubVersioningService extends EntityService implements IVersioningService {
  static readonly type: string = null;

  async getCurrent(target: IProjectTargetDef): Promise<string> {
    return null;
  }

  async format(target: IProjectTargetDef, entity) {
    return entity;
  }

  async override(source: IProjectTargetDef, target: IProjectTargetDef): Promise<string> {
    return null;
  }

  async patch(target: IProjectTargetDef): Promise<string> {
    return null;
  }

  async release(target: IProjectTargetDef): Promise<string> {
    return null;
  }

  async getCurrentStream(target: IProjectTargetStreamDef): Promise<string> {
    return null;
  }

  async formatStream(stream: IProjectTargetStreamDef, entity) {
    return entity;
  }

  async overrideStream(source: IProjectTargetDef, target: IProjectTargetStreamDef): Promise<string> {
    return null;
  }

  async patchStream(target: IProjectTargetStreamDef): Promise<string> {
    return null;
  }

  async releaseStream(target: IProjectTargetStreamDef): Promise<string> {
    return null;
  }

  async exec(source: IProjectTargetDef, target: IProjectTargetDef, action: string): Promise<string> {
    return null;
  }
}