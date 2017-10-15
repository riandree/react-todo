import React from 'react';
import PropTypes from 'prop-types';

export const ToDoItem = (props) => {
    const onChecked = () => props.checked(props.id);
    const onDelete = () => props.deleteItem(props.id);
    return (
        <section className={ props.isChecked ? "item done" : "item"} >
            <h3>{ props.headline }</h3>
            <p>{ props.description }</p>
            <label htmlFor={props.id}>Done</label>
            <input id={props.id}
                   type="checkbox"
                   onClick={ onChecked }
                   checked={ props.isChecked }
                   readOnly/>
            {
                props.isChecked && <button onClick={ onDelete }>delete item</button>
            }
        </section>
    );
};

ToDoItem.propTypes = {
    id: PropTypes.string.isRequired,
    headline: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    checked: PropTypes.func.isRequired,
    deleteItem: PropTypes.func.isRequired,
    isChecked: PropTypes.bool
};
