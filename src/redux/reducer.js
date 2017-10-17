import { Actions } from './actions';

const reducer = (state , action) => {
    switch (action.type) {
        case `${Actions.CREATE_TODO}_FULFILLED` :
        case `${Actions.DELETE_TODO}_FULFILLED` :
        case `${Actions.TOGGLE_TODO}_FULFILLED` : 
        return {
                ...state,
                items : action.payload
            };
        default : 
            return state;
    }
}

export default reducer;