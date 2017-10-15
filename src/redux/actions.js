
export const Actions = {
  CREATE_TODO : "CREATE",
  DELETE_TODO : "DELETE",
  TOGGLE_TODO : "TOGGLE"
};

export default (todoDatabaseService) => ({

   createToDo : (headline, description) => {
      return {
        type : Actions.CREATE_TODO,
        payload : { headline, description : description || ""  }
      };
   },

   deleteToDo : (id) => ({
      type : Actions.DELETE_TODO,
      payload : { id }
   }),

   toggleToDo : (id) => ({
      type : Actions.TOGGLE_TODO,
      payload : { id }
   })

});