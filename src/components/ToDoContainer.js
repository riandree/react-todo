import EditableToDoList from './EditableToDoList';
import { connect } from 'react-redux';
import { createToDo, deleteToDo, toggleToDo } from '../redux/actions';

const mapStateToProps = (state) => ({
    items : state.items
}); 

const mapDispatchToProps = (dispatch) => ({
    doCreate : (headline,description) => {
        dispatch(createToDo(headline,description))
    },
    doRemove : (id) => {
        dispatch(deleteToDo(id));
    },
    doToggleItem : (id) => {
        dispatch(toggleToDo(id));
    }
});

const ToDoListContainer = connect(mapStateToProps,mapDispatchToProps)(EditableToDoList);
  
export default ToDoListContainer;