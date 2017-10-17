
export const Actions = {
  CREATE_TODO : "CREATE",
  DELETE_TODO : "DELETE",
  TOGGLE_TODO : "TOGGLE"
};

export default (todoDatabaseService) => ({

   createToDo : (headline, description) => {
      return {
        type : Actions.CREATE_TODO,
        payload : todoDatabaseService.insertToDo(headline,description)
                                     .then(() => todoDatabaseService.allToDos())
      };
   },

   deleteToDo : (id) => {
      return {
         type : Actions.DELETE_TODO,
         payload : todoDatabaseService.removeToDo(id)
                                      .then(() => todoDatabaseService.allToDos())
      }
  },

   toggleToDo : (id) => ({
      type : Actions.TOGGLE_TODO,
      payload : todoDatabaseService.toggleToDo(id)
                                   .then(() => todoDatabaseService.allToDos())
   })

});