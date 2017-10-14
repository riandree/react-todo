import React, {Component } from 'react';
import PropTypes from 'prop-types';
import { ToDoList } from './ToDoList';

class EditableToDoList extends Component {
    
        static propTypes = {
            doCreate : PropTypes.func.isRequired,
            doRemove : PropTypes.func.isRequired,
            doToggleItem : PropTypes.func.isRequired,
            items : PropTypes.arrayOf(
                PropTypes.shape(
                    {
                        id: PropTypes.string.isRequired,
                        headline : PropTypes.string.isRequired,
                        description : PropTypes.string,
                        checked: PropTypes.bool.isRequired
                    }
                )
            ).isRequired
        };
    
        constructor(props) {
            super(props);
            // current Headline and Text for the next item to create are local state
            // and are not hold by the redux container
            this.state = {
                currentHeadline: "",
                currentDescription: ""
            };
        }
    
        render() {
            return (
                <div className="ToDo">
                    <div className="ToDoCreate">
                        <input type="text"
                               placeholder="Headline"
                               className={ !this.state.currentHeadline.length ? "empty" : ""}
                               value={ this.state.currentHeadline }
                               name="headline"
                               onChange={ this.onChange }/>
                        <textarea
                            placeholder="Description"
                            value={ this.state.currentDescription }
                            name="description"
                            rows="10"
                            onChange={ this.onChange }/>
                        <button disabled={ !this.state.currentHeadline.length } onClick={ this.handleCreate }>Neu</button>
                    </div>
                    <ToDoList checked={ this.itemChecked }
                              deleteItem={ this.itemDelete }
                              items={ this.props.items }/>
                </div>
            );
        }
    
        handleCreate = () => {
            this.setState({
                currentHeadline : "",
                currentDescription : ""
            });
            this.props.doCreate(this.state.currentHeadline,this.state.currentDescription);
        };
    
        onChange = (event) => {
            switch (event.target.name) {
                case "headline" :
                    this.setState({currentHeadline: event.target.value});
                    break;
                case "description" :
                    this.setState({currentDescription: event.target.value});
                    break;
                default :
                    console.warn(`unknown target-name "${event.target.name}"`);
            }
        };
    
        itemDelete = (id) => {
            // ToDo: this is really really ugly ... use a proper dialog instead
            if (window.confirm("really delete item ?")) {
                this.props.doRemove(id);
            }
        };
    
        itemChecked = (id) => {
            this.props.doToggleItem(id);
        }
    
    }
    
    export default EditableToDoList;