import { Actions } from './actions';

const initialState = {
    items: []
};

const rndInt = () => Math.round(Math.random() * 100);
const createID = () => [rndInt(), rndInt(), rndInt(), rndInt()].join("-");
const createItem = (headline, description) => ({
    id : createID(),
    headline,
    description,
    checked : false
});

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

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case Actions.CREATE_TODO :
            return {
                ...state,
                items : [createItem(action.payload.headline,action.payload.description), ...state.items]
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