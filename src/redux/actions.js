
export const Actions = {
  CREATE_TODO : "CREATE",
  DELETE_TODO : "DELETE",
  TOGGLE_TODO : "TOGGLE"
};

export const createToDo = (headline, description) => {
    console.log("creating "+headline+" "+description);
    return {
        type : Actions.CREATE_TODO,
        payload : { headline, description : description || ""  }
    };
};

export const deleteToDo = (id) => ({
    type : Actions.DELETE_TODO,
    payload : { id }
});

export const toggleToDo = (id) => ({
    type : Actions.TOGGLE_TODO,
    payload : { id }
});