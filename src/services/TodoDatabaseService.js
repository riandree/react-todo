import dbEventService from './DBEventStoreService'; 

const rndInt = () => Math.round(Math.random() * 100);
const createID = () => [rndInt(), rndInt(), rndInt(), rndInt()].join("-");

const insert = async (db, headline,description) => {
    const id = createID(); 
    const todo2Add = {
        _id : id,
        createdAt : Date.now(),
        state : "pending_insert",
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
    //await db.toDoStore.delete(id);
    db.toDoStore.get(id)
      .then((todo) => {
        if (todo) {
            return db.toDoStore.put({ ...todo, state : "pending_delete" })
        }
        return Promise.reject("not found");
      })
      .then(() => {
        dbEventService.pushDeleteEvent({ id });
      });
}

const toggleToDoById = async (db,id) => {
    await db.toDoStore.where({ _id : id }).modify((todo) => {
        todo.checked = !todo.checked;
        todo.state = "pending_update";
        return todo;
    }).then(() => dbEventService.pushUpdateEvent({ id }));
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