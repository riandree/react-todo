import EditableToDoList from './EditableToDoList';
import { connect } from 'react-redux';
import React from 'react';

export default function ToDoListContainer(props) {

   const actions = props.actions;

   const mapStateToProps = (state) => ({
      items : state.items
   }); 

   const mapDispatchToProps = (dispatch) => ({
      doCreate : (headline,description) => {
        dispatch(actions.createToDo(headline,description))
      },
      doRemove : (id) => {
        dispatch(actions.deleteToDo(id));
      },
      doToggleItem : (id) => {
        dispatch(actions.toggleToDo(id));
      }
   });

   const ToDoWrapper=connect(mapStateToProps,mapDispatchToProps)(EditableToDoList);
  
   return <ToDoWrapper/>;
};
