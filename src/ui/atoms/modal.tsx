import * as React from 'react';
import { SubTitle } from './title';
import { Button } from './button';

export const Modal = ({
  buttons = {
    cancel: {
      action: 'cancel',
      disabled: false,
      onSelect: null,
      title: 'Cancel',
      type: '',
    },
    ok: {
      action: 'ok',
      disabled: false,
      onSelect: null,
      title: 'OK',
      type: 'active',
    },
  },
  children,
  isShowing = true,
  title = undefined,
  onClose = undefined,
  onSelect = undefined,
  onTransitionEnd = undefined,
}: {
  buttons?: Record<string, { action?: string; disabled?: boolean; onSelect?: (action?) => void, title?: string, type?: string }>;
  children,
  isShowing?: boolean;
  title: React.ReactElement | string;
  onClose?: () => void,
  onSelect?: (action?: string) => void,
  onTransitionEnd?: () => void,
}) => {
  return <div className={ isShowing ? "ef-show" : "ef-hide" }><div className="modal ef-fade" onAnimationEnd={ onTransitionEnd }>
    <div className="modal-content f10 f14-s- bg-light shadow shadow-high pad-hor triple flex ef-slide">
      <div className='w00 paragraph paragraph-lrg'>
        <div className='c18'>
          <div>
            <div className='flex flex-hor'>
              {
                typeof title === 'string'
                  ? <SubTitle>{ title }</SubTitle>
                  : title
              }
              {
                onClose
                  ? <Button className='button-sml default transparent w-auto' x={ null } onClick={ onClose }><i className="fa-solid fa-xmark fa-lg"></i></Button>
                  : null
              }
            </div>
          </div>
        </div>
        <div className='c18 children-gap'>
          { children }
        </div>
        <div className='c18'>
          <div className='row flex-right'>
            {
              Object.entries(buttons).map(([ key, button ]) => {
                return <Button
                  className={ button.type === 'active' ? '' : 'default transparent' }
                  disabled={ button.disabled }
                  key={ key }
                  x={ 4 }
                  onClick={ () => button.onSelect ? button.onSelect(button.action) : onSelect ? onSelect(button.action) : null }
                >{ button.title }</Button>
              })
            }
          </div>
        </div>
      </div>
    </div>
  </div></div>;
}
