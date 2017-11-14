const mLabCollectionsBaseURL="https://api.mlab.com/api/1/databases/reacttodo/collections/";
const todoCollection="todo"

function mlabService({ mlabKey, fetch }) {
    
        const mlabURLFromCollection = (collection) => `${mLabCollectionsBaseURL}${collection}?apiKey=${mlabKey}`;
        const mlabURLFromCollectionAndID = (collection, id) => `${mLabCollectionsBaseURL}${collection}/${id}?apiKey=${mlabKey}`;
        
        const mlab = {};
          
        mlab.createToDo = (todo) => {
            if (!todo["_id"]) {
               return Promise.reject("No '_id' member in "+JSON.stringify(todo));
            }
    
            // npm-fetch only supports simple object hash not 'Headers' Type
            // Browsers support both
            var headers = {}; 
            headers["Content-Type"]="application/json";
    
            return fetch(mlabURLFromCollection(todoCollection), {
                method: "POST",
                headers,
                body: JSON.stringify(todo)   
              }).then((response) => {
                if (response.status !== 200) {
                    return Promise.reject(response);
                }
                return response.json();
              });
        };
    
        mlab.updateToDo = (todo) => {
            if (!todo["_id"]) {
                return Promise.reject("No '_id' member in "+JSON.stringify(todo));
            }
    
            var headers = {}; 
            headers["Content-Type"]="application/json";
            const todoWithoutID = { ...todo };
            delete(todoWithoutID._id);
    
            return fetch(mlabURLFromCollectionAndID(todoCollection,todo._id), {
                method: "PUT",   
                headers,
                body : JSON.stringify(todoWithoutID)     
            }).then((response) => {
              if (response.status !== 200) {
                  return Promise.reject(response);
              };
            }); 
        };
    
        mlab.deleteToDo = (todo) => {
            if (!todo["_id"]) {
                return Promise.reject("No '_id' member in "+JSON.stringify(todo));
            }
    
            return fetch(mlabURLFromCollectionAndID(todoCollection,todo._id), {
                method: "DELETE",
              }).then((response) => {
                if (response.status !== 200 && response.status !== 404) {
                    return Promise.reject(response);
                };
              });
        };
        
        return mlab;
};

function syncPending(mlabService, db) {
    return (pendingToDo) => {
        console.log("will sync "+JSON.stringify(pendingToDo));
        const todoInPersistentState = { ...pendingToDo , state : "persistent" };
        switch (pendingToDo.state) {
           case "pending_insert" :  
               console.log("will insert ");
               return mlabService.createToDo(todoInPersistentState)
               .then(() => {
                   return db.toDoStore.put(todoInPersistentState);
               });
            case "pending_update" :  
                console.log("will update " + JSON.stringify(todoInPersistentState));
                return mlabService.updateToDo(todoInPersistentState)
                .then(() => {
                    console.log("updated");
                    return db.toDoStore.put(todoInPersistentState);
                });                 
            case "pending_delete" :  
                console.log("will delete ");
                return mlabService.deleteToDo(pendingToDo)
               .then(() => {
                   console.log("deleted");
                   return db.toDoStore.delete(pendingToDo._id);
               });
           default :
               console.warn("unexpected state "+JSON.stringify(pendingToDo));
       }
       return Promise.resolve();
    }
}

function fetchAllPending (db) {
    return () => db.toDoStore.where("state").notEqual("persistent").toArray(); 
}

const workerServices=function ({ mlabKey, fetch, db }) {
  
    const services = {};

    services.mlab = mlabService({ mlabKey, fetch });
    services.fetchPending = fetchAllPending(db);
    services.syncPending = syncPending(services.mlab, db);
    
    return services;
};

// export for unit-tests if module is present
if (typeof module !== "undefined") {
     module.exports = workerServices;
}