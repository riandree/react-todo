import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { ToDoItem } from './ToDoItem';

export class ToDoList extends Component {

     static propTypes = {
        items: PropTypes.array.isRequired,
        checked: PropTypes.func.isRequired,
        deleteItem: PropTypes.func.isRequired
    };

    render() {
        const items = this.props.items
            .map((item) => (<li key={ item.id }><ToDoItem
                id={ item.id }
                checked={ this.props.checked }
                deleteItem={ this.props.deleteItem }
                headline={ item.headline }
                isChecked={ item.checked }
                description={ item.description}/></li>));
        return (
            <div className="ToDoList">
                <ul>
                    { items }
                </ul>
            </div>
        );
    }
}

