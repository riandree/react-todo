import { Actions } from './actions';

const removeItemById = (items, id) => {
   return items.filter(item => item.id !== id);
}

const toggleItemById = (items, id) => {
   function flipState (item) {
       if (item.id === id) {
           const flipped = Object.assign({}, item);
           flipped.checked = !flipped.checked;
           return flipped;
       }
       return item;
   };
   return items.map(flipState);
}

const reducer = (state , action) => {
    switch (action.type) {
        case `${Actions.CREATE_TODO}_FULFILLED` :
            return {
                ...state,
                items : action.payload
            };
        case Actions.DELETE_TODO :
            return {
                ...state,
                items : removeItemById(state.items, action.payload.id)
            };
        case Actions.TOGGLE_TODO : 
            return {
                ...state,
                items : toggleItemById(state.items, action.payload.id)
            };
        default : 
            return state;
    }
}

export default reducer;