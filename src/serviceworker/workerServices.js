const mLabCollectionsBaseURL="https://api.mlab.com/api/1/databases/reacttodo/collections/";
const todoCollection="todo"

const workerServices=function ({ mlabKey, fetch }) {

    const mlabURLFromCollection = (collection) => `${mLabCollectionsBaseURL}${collection}?apiKey=${mlabKey}`;
    const mlabURLFromCollectionAndID = (collection, id) => `${mLabCollectionsBaseURL}${collection}/${id}?apiKey=${mlabKey}`;
    
    const services = {};

    services.mlab = {};
  
    services.mlab.createToDo = (todo) => {
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

    services.mlab.updateToDo = (todo) => {
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

    services.mlab.deleteToDo = (todo) => {
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
    
    return services;
};

// export for unit-tests if module is present
module && (module.exports = workerServices); 