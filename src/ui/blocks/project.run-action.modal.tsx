import * as React from 'react';
import { ProjectFlowActionDto, ProjectTargetDto, ProjectTargetStreamDto } from '../stores/dto/project';
import { ModalStore } from '../stores/modal';

export const ProjectRunActionModalTitle = ({
  store,
  projectTarget,
  projectTargetActions,
  projectTargetStreams,
}: {
  store: ModalStore;
  projectTarget?: ProjectTargetDto;
  projectTargetActions?: ProjectFlowActionDto;
  projectTargetStreams?: ProjectTargetStreamDto[];
}) => {
  return <React.Fragment>
    {projectTargetActions?.title}
    &nbsp;
    <span className='font-sml sup'>{projectTargetActions?.description}</span>
  </React.Fragment>;
};

export const ProjectRunActionModalContent = ({
  store,
  projectTarget,
  projectTargetActions,
  projectTargetStreams,
}: {
  store: ModalStore;
  projectTarget?: ProjectTargetDto;
  projectTargetActions?: ProjectFlowActionDto;
  projectTargetStreams?: ProjectTargetStreamDto[];
}) => {
  return <div className='row'>
    <div className='c18'>
      Are you sure to run action for
      <ul>
        {
          projectTargetStreams?.map((stream) => <li>{ stream.title ?? stream.id }</li>)
        }
      </ul>
      on <span className='bold'>{projectTarget?.title ?? projectTarget?.id}</span>?
    </div>
  </div>;
};
