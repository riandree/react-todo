const rndInt = () => Math.round(Math.random() * 100);
const createID = () => [rndInt(), rndInt(), rndInt(), rndInt()].join("-");

const insert = async (db, headline,description) => {
    const todo2Add = {
        id : createID(),
        createdAt : Date.now(),
        headline : headline,
        description : description || "",
        checked : false
    };
    return await db.toDoStore.add(todo2Add);
}
  
const allToDos = (db) => {
    return db.toDoStore.toArray();
}

const removeById = (db,id) => {
    return db.toDoStore.delete(id);
}

const toggleToDoById = (db,id) => {
    return db.toDoStore.where({ id : id }).modify((todo) => {
        todo.checked = !todo.checked;
        return todo;
    });
}

const DatabaseServiceConstructor = (db) => {
    const service = {};
    service.insertToDo = insert.bind(service,db); 
    service.allToDos = allToDos.bind(service,db);
    service.removeToDo = removeById.bind(service,db);
    service.toggleToDo = toggleToDoById.bind(service,db);
    return service;
};

export default DatabaseServiceConstructor;