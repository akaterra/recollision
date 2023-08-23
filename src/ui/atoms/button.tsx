import React from 'react';
import { mayBeLabeledControl, stylize } from './utils';

export const componentStyle = {

};
export const componentSingleStyle = {

};

export const Button = ({ children, className = null, disabled = false, label = null, x = undefined, onClick = undefined, style = {} }) => {
    const Component = <button
        className={ disabled ? `button unbound ${className ?? ''} disabled` : `button unbound ${className ?? ''}` }
        disabled={ disabled }
        style={ style }
        onClick={ !disabled ? onClick : undefined }
    >{ children }</button>;

    return mayBeLabeledControl(Component, x, label);
}

Button.Failure = stylize(Button, { className: 'failure' });

Button.Success = stylize(Button, { className: 'success' });