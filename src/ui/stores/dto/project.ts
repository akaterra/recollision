export interface IProjectRef {
  actionId?: IProjectFlowAction['id'],
  flowId?: IProjectFlow['id'],
  projectId?: IProject['id'],
  streamId?: IProjectTargetStream['id'],
  targetId?: IProjectTarget['id'],
}

export interface IProjectFlowActionStep {
  id: string;
  type: string;

  ref: IProjectRef;
  
  title: string;
  description: string;
  targets: string[];
}

export interface IProjectFlowActionParam {
  type: string;

  title?: string;
  description?: string;

  constraints?: {
    enum?: any[];
    min?: number;
    minLength?: number;
    max?: number;
    maxLength?: number;
    optional?: boolean;
  };
  initialValue: any;
}

export interface IProjectFlowAction {
  id: string;
  type: string;

  ref: IProjectRef;
  
  title: string;
  description: string;

  streams?: IProjectTargetStream['id'][];
  steps: IProjectFlowActionStep[];
  params?: Record<string, IProjectFlowActionParam>;
  targets?: IProjectTarget['id'][];
}

export interface IProjectFlow {
  id: string;
  type: string;

  ref: IProjectRef;

  title: string;
  desription: string;

  actions: Record<string, IProjectFlowAction>;
  targets: string[];
}

export interface IProjectTargetStream {
  id: string;
  type: string;

  ref: IProjectRef;

  title: string;
  description: string;

  actions: Record<string, IProjectFlowAction>;
  tags: string[];
  targets: string[];
}

export interface IProjectTarget {
  id: string;
  type: string;

  ref: IProjectRef;

  title: string;
  description: string;

  streams: Record<string, IProjectTargetStream>;
  tags: string[];
  versioning: string;
}

export interface IProject {
  id: string;
  type: string;

  title: string;
  description: string;
  flows: Record<string, IProjectFlow>;
  targets: Record<string, IProjectTarget>;
}
