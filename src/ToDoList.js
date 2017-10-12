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
    return (
        <div className="item" onClick={ onChecked }>
            <p>{ props.headline }</p>
            <span>{ props.description }</span>
            <input type="checkbox" checked={ props.isChecked } readOnly/>
        </div>
    );
};

ToDoItem.propTypes = {
    id: PropTypes.string.isRequired,
    headline: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    checked: PropTypes.func.isRequired,
    isChecked: PropTypes.bool
};

class ToDoList extends Component {

    constructor(props) {
        super(props);
    }

    static propTypes = {
        items: PropTypes.array.isRequired,
        checked: PropTypes.func.isRequired
    }

    render() {
        const items = this.props.items
            .map((item) => (<li key={ item.id }><ToDoItem
                id={ item.id }
                checked={ this.props.checked }
                headline={ item.headline }
                isChecked={ item.checked }
                description={ item.description}/></li>));
        return (
            <div>
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
                items: [
                    createItem("1st", "lorem ipsum"),
                    createItem("2nd", "dolor sit"),
                    ...prevState.items
                ]
            }
        ));
    }

    render() {
        return (
            <div>
                <div>
                    <input type="text"
                           placeholder="Headline"
                           value={ this.state.currentHeadline }
                           name="headline"
                           onChange={ this.onChange }/>
                    <input type="text"
                           placeholder="Description"
                           value={ this.state.currentDescription }
                           name="description"
                           onChange={ this.onChange }/>
                    <button onClick={ this.handleCreate }>Neu</button>
                </div>
                <ToDoList checked={ this.itemChecked } items={ this.state.items }/>
            </div>
        );
    }

    handleCreate = () => {
        this.setState((prev) => (
            {
                items: [createItem(this.state.currentHeadline, this.state.currentDescription), ...prev.items],
                currentHeadline : "",
                currentDescription : ""
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