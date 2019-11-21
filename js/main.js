const restTodos = new AJAX("https://pko-one.glitch.me/todos");

function AJAX(url){
    this.url = url;
    this.read = function(callback){
        let ajax = new XMLHttpRequest();
        ajax.open("GET",this.url);
        ajax.onreadystatechange = function(){
            if (this.readyState === 4 && this.status === 200){
                callback(this.response);
            }
        }
        ajax.send();
    };
    this.findById = function (id, callback) {
        let ajax = new XMLHttpRequest();
        ajax.open("GET", this.url + `/${id}`);
        ajax.onreadystatechange = function(){
            if (this.readyState === 4 && this.status === 200){
                callback(this.response);
            }
        }
        ajax.send();
    }
    this.create = function(object, callback){
        let ajax = new XMLHttpRequest();
        ajax.open("POST",this.url);
        ajax.setRequestHeader("Content-Type","application/json");
        ajax.onreadystatechange = function(){
            if (this.readyState === 4 && this.status === 200){
                console.log("Create response");
                callback(this.response);
            }
        }
        ajax.send(JSON.stringify(object));
    }
    this.patch = function(id, object, callback){
        let ajax = new XMLHttpRequest();
        ajax.open("PATCH",this.url + `/${id}`);
        ajax.setRequestHeader("Content-Type","application/json");
        ajax.onreadystatechange = function(){
            if (this.readyState === 4 && this.status === 200){
                callback(this.response);
            }
        }
        ajax.send(JSON.stringify(object));
    }
}

function createTask(){
    console.log("processTask button clicked");
    let operation = document.getElementById("operation").value;
    switch(operation){
        case "create":{
            let title = document.getElementById("title").value;
            let completed = document.getElementById("completed").checked;
            let userId= document.getElementById("userId").value;
            let object = {
                "id":0,
                "userId": userId,
                "title": title,
                "completed": completed};
            restTodos.create(object, function(response){
                                    console.log("Task created " + response);
                                    getTodosFromRestApi();
                                });
            }
            break;
        case "update":
            break;
    }
}

function injectHtmlCodeInTableTodos() {
    return function (response) {
        let jsonTodos = JSON.parse(response);
        let html = jsonTodos.map(function (item) {
            return `<tr>
                    <td>${item.id}</td>
                    <td>${item.userId}</td>
                    <td>${item.title}</td>
                    <td><input type="checkbox" ${item.completed ? "checked" : ""} onchange="setCompleted(${item.id})"/></td>
                    </tr>`;
        });
        document.getElementById("todos").innerHTML = html.join("");
    };
}

function getTodosFromRestApi(){
    restTodos.read(injectHtmlCodeInTableTodos());
}

function initApp(){
    getTodosFromRestApi();
}

function setCompleted(id){
    const task = restTodos.findById(id, setCompletedTask);
}

function setCompletedTask(response){
    const task = JSON.parse(response);
    console.log(task);
    restTodos.patch(task.id, {completed: !task.completed}, function(response){
       console.log("Patched");
       getTodosFromRestApi();
    });
}


