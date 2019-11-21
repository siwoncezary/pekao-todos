let restTodos = new AJAX("https://jsonplaceholder.typicode.com/todos");

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
    this.create = function(object, callback){
        let ajax = new XMLHttpRequest();
        ajax.open("POST",this.url);
        ajax.setRequestHeader("Content-Type","application/json");
        ajax.onreadystatechange = function(){
            if (this.readyState === 4 && this.status === 201){
                callback(this.response);
            }
        }
        ajax.send(JSON.stringify(object));
    }
}

function processTask(){
    console.log("processTask button clicked");
    let operation = document.getElementById("operation").value;
    switch(operation){
        case "create":{
            let titleX = document.getElementById("title").value;
            let completedX = document.getElementById("completed").checked;
            let userIdX = document.getElementById("userId").value;
            let object = {
                id:0,
                userId: userIdX,
                title: titleX,
                completed: completedX};
            console.log("Task " + JSON.stringify(object));
            restTodos.create(object,
                                function(response){
                                    console.log(response);
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
                    <td>${item.completed}</td>
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


