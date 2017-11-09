import dbEventService from './DBEventStoreService'; 

const rndInt = () => Math.round(Math.random() * 100);
const createID = () => [rndInt(), rndInt(), rndInt(), rndInt()].join("-");

const insert = async (db, headline,description) => {
    const id = createID(); 
    const todo2Add = {
        id,
        createdAt : Date.now(),
        headline : headline,
        description : description || "",
        checked : false
    };
    await db.toDoStore.add(todo2Add);
    dbEventService.pushCreateEvent({ id });
}
  
const allToDos = (db) => {
    return db.toDoStore.toArray();
}

const removeById = async (db,id) => {
    await db.toDoStore.delete(id);
    dbEventService.pushDeleteEvent({ id });
}

const toggleToDoById = async (db,id) => {
    await db.toDoStore.where({ id : id }).modify((todo) => {
        todo.checked = !todo.checked;
        return todo;
    });
    dbEventService.pushUpdateEvent({ id });
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