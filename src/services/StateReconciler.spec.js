import { reconcileLocal } from './StateReconciler';

describe("Algorithm to reconcile the local db-state with the state fetched from the central mlab service", function() {
  
    it("does nothing and returns the 'localState' parameter when one of the parameters is not an array",function() {
        const nonArray = {};
        const anArray = {};
        expect(reconcileLocal(nonArray).withCentral(anArray)).toBe(nonArray);
        expect(reconcileLocal(anArray).withCentral(nonArray)).toBe(anArray);
        expect(reconcileLocal(nonArray).withCentral(nonArray)).toBe(nonArray);
    });
    
    it("does nothing and returns the empty list when both lists are empty",function() {
        expect(reconcileLocal([]).withCentral([])).toEqual([]);
    });

    it("returns the local-state of pending objects when the central state list is empty",function() {
        const state = [
            { _id : "1", state: "insert_pending" },
            { _id : "2", state: "update_pending" },
            { _id : "3", state: "dummy" },
        ];
        expect(reconcileLocal(state).withCentral([])).toEqual(state);
    });  

    it("returns the central state when the local-state list is empty",function() {
        const state = [
            { _id : "1", state: "persistent" },
            { _id : "2", state: "persistent" },
            { _id : "3", state: "persistent" },
        ];
        expect(reconcileLocal([]).withCentral(state)).toEqual(state);
    });

    it("inserts, updates and deletes objects on the local state as expected",function() {
        const localState = [
            { _id : "30", state: "persistent", dummy: "c"},  // Present in both with no difference should remain the same
            { _id : "20", state: "persistent", dummy: "b"},  // Present in both with difference in state, should take over central state
            { _id : "40", state: "persistent", dummy: "d"},  // Deleted in Central, should be removed
            { _id : "60", state: "pending", dummy: "f"},  // In Central With different State but pending, should be kept
            { _id : "50", state: "pending", dummy: "e"}   // Not in Central but pending should be kept
        ];
        const centralState = [
            { _id : "60", state: "persistent", dummy: "F"},  // In Central With different State but pending, should be kept
            { _id : "20", state: "persistent", dummy: "B"},  // Present in both with difference in state, should take over central state
            { _id : "30", state: "persistent", dummy: "c"},  // Present in both with no difference should remain the same
            { _id : "10", state: "persistent", dummy: "a"}   // only present in central, should be added to local state
        ];
        const expectedResult = [
            { _id : "10", state: "persistent", dummy: "a"},   // only present in central, should be added to local state
            { _id : "20", state: "persistent", dummy: "B"},  // Present in both with difference in state, should take over central state
            { _id : "30", state: "persistent", dummy: "c"},  // Present in both with no difference should remain the same
            { _id : "50", state: "pending", dummy: "e"},   // Not in Central but pending should be kept
            { _id : "60", state: "pending", dummy: "f"},  // In Central With different State but pending, should be kept
        ];
        expect(reconcileLocal(localState).withCentral(centralState)).toEqual(expectedResult);
    });

});