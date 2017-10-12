import React, {Component} from 'react';
import PropTypes from 'prop-types';

const rndInt = () => Math.round(Math.random() * 100);
const createID = () => [rndInt(), rndInt(), rndInt(), rndInt()].join("-");
const createItem = (headline, description) => ({
    id: createID(),
    headline,
    description,
    checked: false
});

const ToDoItem = (props) => {
    const onChecked = () => props.checked(props.id);
    const onDelete = () => props.deleteItem(props.id);
    return (
        <section className="item">
            <h3>{ props.headline }</h3>
            <p>{ props.description }</p>
            <label for={props.id}>Done</label>
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

class ToDoList extends Component {

    constructor(props) {
        super(props);
    }

    static propTypes = {
        items: PropTypes.array.isRequired,
        checked: PropTypes.func.isRequired,
        deleteItem: PropTypes.func.isRequired
    }

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

class ToDo extends Component {

    constructor(props) {
        super();
        this.state = {
            currentHeadline: "",
            currentDescription: "",
            items: []
        };
    }

    componentDidMount() {
        this.setState((prevState) => (
            {
                items: []
            }
        ));
    }

    render() {
        return (
            <div className="ToDo">
                <div className="ToDoCreate">
                    <input type="text"
                           placeholder="Headline"
                           value={ this.state.currentHeadline }
                           name="headline"
                           onChange={ this.onChange }/>
                    <textarea
                        placeholder="Description"
                        value={ this.state.currentDescription }
                        name="description"
                        rows="10"
                        onChange={ this.onChange }/>
                    <button onClick={ this.handleCreate }>Neu</button>
                </div>
                <ToDoList checked={ this.itemChecked }
                          deleteItem={ this.itemDelete }
                          items={ this.state.items }/>
            </div>
        );
    }

    handleCreate = () => {
        this.setState((prev) => (
            {
                items: [createItem(this.state.currentHeadline, this.state.currentDescription), ...prev.items],
                currentHeadline: "",
                currentDescription: ""
            }
        ));
    }

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
    }

    itemDelete = (id) => {
        this.setState((prev) => {
            return {
              items : prev.items.filter(item => item.id!==id)
            };
        });
    }

    itemChecked = (id) => {
        const flipState = (item) => {
            if (item.id === id) {
                const flipped = Object.assign({}, item);
                flipped.checked = !flipped.checked;
                return flipped;
            }
            return item;
        };

        this.setState((prev) => ({
            items: prev.items.map(flipState)
        }));
    }

}

export default ToDo;