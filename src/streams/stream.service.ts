import { IStreamStateContext, StreamState } from '../stream';
import { IProjectTargetDef, IProjectTargetStreamDef } from '../project';
import { TargetState } from '../target';
import { IService } from '../entities.service';

export interface IStreamService extends IService {
  actionRun(id: string);

  streamBookmark(stream: IProjectTargetStreamDef): Promise<StreamState>;

  streamDetach(stream: IProjectTargetStreamDef): Promise<StreamState>;

  streamGetState(stream: IProjectTargetStreamDef, scopes?: Record<string, boolean>, context?: IStreamStateContext): Promise<StreamState>;

  streamMove(sourceStream: IProjectTargetStreamDef, targetStream: IProjectTargetStreamDef);

  targetGetState(target: IProjectTargetDef, scopes?: Record<string, boolean>): Promise<TargetState>;
}
