var nock = require('nock');
var fetch = require('node-fetch');
var workerServices = require('./workerServices');
//var mlabKey = require('./mlab.key'); 
  
describe("Services for the Service-Worker", function() {
    const services=workerServices({
        mlabKey : "DummyKey",
        fetch
    });
    
    it("provides access to mlab", function() {
      expect(services).toBeDefined();  
      expect(services.mlab).toBeDefined();  
    });
  
    it("can create todo documents in mlab", function() {
        const dummyDoc = { "_id" : 1, dummy : "dataDummyData"};
        
        nock('https://api.mlab.com', {
            reqheaders: {
              'Content-Type': 'application/json'
            }
          })
        .post(/\/api\/1\/databases\/reacttodo\/collections\/todo\?apiKey=.+/,dummyDoc) 
        .reply(200, function(uri, requestBody) {
          return requestBody;
        }); 

        return services.mlab.createToDo(dummyDoc).catch(err => {
            fail(JSON.stringify(err));
        }).then(result => {
            expect(result).toEqual(dummyDoc);
        });
    });

    it("rejects to persist documents without an _id field", function () {
        return services.mlab.createToDo({ dummy : "dataDummyData"})
        .then(() => fail("did not get expected failure"))  
        .catch(err => {
             console.log("got expected failure");  
        });        
    });

    it("rejects to delete documents without an _id field", function () {
        return services.mlab.deleteToDo({ dummy : "dataDummyData"})
        .then(() => fail("did not get expected failure"))  
        .catch(err => {
             console.log("got expected failure");  
        });        
    });

    it("can delete todo documents in mlab", function() {
        const dummyDoc = { "_id" : "42deleteMe", dummy : "dataDummyData"};
        
        nock('https://api.mlab.com')
        .delete(/\/api\/1\/databases\/reacttodo\/collections\/todo\/42deleteMe\?apiKey=.+/) 
        .reply(200  , function(uri, requestBody) {  
          return requestBody;
        });   

        return services.mlab.deleteToDo(dummyDoc).catch(err => {
            fail(JSON.stringify(err));
        });
    }); 

    it("will not fail on deleting todo documents not in mlab", function() {
        const dummyDoc = { "_id" : "iDontExist", dummy : "dataDummyData"};
        
        nock('https://api.mlab.com')
        .delete(/\/api\/1\/databases\/reacttodo\/collections\/todo\/iDontExist\?apiKey=.+/) 
        .reply(404  , function(uri, requestBody) {  
          return requestBody;
        });   

        return services.mlab.deleteToDo(dummyDoc).catch(err => {
            fail(JSON.stringify(err));
        });
    }); 

    it("rejects to update documents without an _id field", function () {
        return services.mlab.updateToDo({ dummy : "dataDummyData"})
        .then(() => fail("did not get expected failure"))  
        .catch(err => {
             console.log("got expected failure");  
        });        
    });

    it("can update todo documents in mlab", function() {
        const dummyDocNew = { "_id" : "updateMe", dummy : "dataDummyData"};
        const dummyDocNewWithoutID = { dummy : "dataDummyData"};
        
        nock('https://api.mlab.com', {
            reqheaders: {
              'Content-Type': 'application/json'
            }
          })
        .put(/\/api\/1\/databases\/reacttodo\/collections\/todo\/updateMe\?apiKey=.+/,dummyDocNewWithoutID) 
        .reply(200);   

        return services.mlab.updateToDo(dummyDocNew).catch(err => {
            fail(JSON.stringify(err));
        });
    }); 

    it("rejects update on non existing todo documents in mlab", function() {
        const dummyDocNew = { "_id" : "dummy", dummy : "dataDummyData"};
        const dummyDocNewWithoutID = { dummy : "dataDummyData"};
        
        nock('https://api.mlab.com', {
            reqheaders: {
              'Content-Type': 'application/json'
            }
          })
        .put(/\/api\/1\/databases\/reacttodo\/collections\/todo\/dummy\?apiKey=.+/,dummyDocNewWithoutID) 
        .reply(404);   

        return services.mlab.updateToDo(dummyDocNew)
        .then(() => fail("expected reject"))
        .catch(err => {
            console.log("got expected 404");
        });
    }); 


});