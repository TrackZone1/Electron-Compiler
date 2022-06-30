const ws = new WebSocket("ws://localhost:8029");

function Compile(){
  ws.send(JSON.stringify({
    compile:true,
    directory_app: document.getElementById("directory_app").value,
    directory_output: document.getElementById("directory_output").value,
    directory_loading: document.getElementById("directory_loading").value,
    authors: document.getElementById("authors").value,
    check_obfuscate: document.getElementById("check_obfuscate").checked,
  }));
}

ws.addEventListener("open", () => {
  console.log("[CONNECTED] WebSocket");
});

ws.addEventListener('message', function (event) {
  var res = JSON.parse(event.data);

  if(res.result){
    document.getElementById("result").innerHTML = res.result;
  }

});