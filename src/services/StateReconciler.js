const reconcilerCentral = {};

const localReconciler = (localState) => {
    return {
        withCentral : (centralState) => {
            if (!Array.isArray(localState) || !Array.isArray(centralState)) {
                return localState;
            }

            const compareByID = (a,b) => a._id.localeCompare(b._id);
            localState = [ ...localState].sort(compareByID);
            centralState = [ ...centralState].sort(compareByID);
            
            const result = [];
            let li=0,ci=0;
            while (li < localState.length || ci < centralState.length) {
                if (li >= localState.length) {
                    // no more local state, add all remaining from central to result
                    result.push(centralState[ci++]);
                } else if (ci >= centralState.length) {
                    // No more central state, only retain those local objects that are pending
                    // all others have been deleted and wont be part of the next local state
                    if (localState[li].state!=="persistent") {
                        result.push(localState[li]);
                    }
                    li++;
                } else {
                    const compareResult = compareByID(localState[li],centralState[ci]); 
                    if (compareResult === 0) {
                        // both local and central state contain this id  ... 
                        // take over the object from the central state into the result when local is not
                        // pending
                        result.push(localState[li].state!=="persistent" ? localState[li] : centralState[ci]);
                        ci++; li++;                             
                    } else if (compareResult <0) {
                        // local id is smaller (i.e. not contained within central state) 
                        // only keep in local state if pending
                        if (localState[li].state!=="persistent") {
                            // retain all local objects that are pending
                            result.push(localState[li]);
                        }
                        li++; 
                    } else {
                        // central id is smaller (i.e. not contained within central state) 
                        // object was added and will be part of the result
                        result.push(centralState[ci++]);
                    }
                }
            }
            return result;
        }
    };
};

export const reconcileLocal = localReconciler;