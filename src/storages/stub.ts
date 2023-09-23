import { Service } from 'typedi';
import { IStorageService } from './storage.service';
import { AwaitedCache } from '../cache';
import { IProjectTargetDef, IProjectTargetStream, IProjectTargetStreamDef } from '../project';
import { EntityService } from '../entities.service';
import { IUser } from '../user';
import { Log } from '../logger';
import fs from 'node:fs/promises';
import path from 'path';

@Service()
export class StubStorageService extends EntityService implements IStorageService {
  static readonly type: string = 'stub';

  @Log('debug')
  async userGet(id: string): Promise<IUser> {
    return null;
  }

  @Log('debug')
  async varGet<D>(target: IProjectTargetDef, key: string | string[], def: D = null, isComplex?: boolean): Promise<D> {
    return null;
  }

  @Log('debug')
  async varSet<D>(target: IProjectTargetDef, key: string | string[], val: D = null, isComplex?: boolean): Promise<void> {

  }

  @Log('debug')
  async varAdd<D>(
    target: IProjectTargetDef,
    key: string | string[],
    val: D,
    uniq?: boolean | ((valExising: D, valNew: D) => boolean),
    maxLength?: number,
  ): Promise<D> {
    return null;
  }

  @Log('debug')
  async varInc(target: IProjectTargetDef, key: string | string[], add: number): Promise<number> {
    return null;
  }

  async varGetStream<D>(stream: IProjectTargetStreamDef, key: string | string[], def: D = null, isComplex?: boolean): Promise<D> {
    return null;
  }

  @Log('debug')
  async varSetStream<D>(stream: IProjectTargetStreamDef, key: string | string[], val: D = null, isComplex?: boolean): Promise<void> {
    return null;
  }

  @Log('debug')
  async varAddStream<D>(
    stream: IProjectTargetStreamDef,
    key: string | string[],
    val: D,
    uniq?: boolean | ((valExising: D, valNew: D) => boolean),
    maxLength?: number,
  ): Promise<D> {
    return null;
  }

  @Log('debug')
  async varIncStream(stream: IProjectTargetStreamDef, key: string | string[], add: number): Promise<number> {
    return null;
  }
}