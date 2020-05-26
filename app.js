var app = require('http').createServer(resposta);
app.listen(3001);
console.log("Aplicação está em execução...");
console.log("Para encerrar, pressione 'Ctrl + C'");

var usuarios = []; 

function resposta (req, res) {
    var arquivo = "";
    if(req.url == "/"){
        arquivo = __dirname + '/index.html';
    }else{
        arquivo = __dirname + req.url;
    }
    fs.readFile(arquivo,
        function (err, data) {
             if (err) {
                  res.writeHead(404);
                  return res.end('Página ou arquivo não encontrados');
             }
 
             res.writeHead(200);
             res.end(data);
        }
    );
}

var fs = require('fs');

var io = require('socket.io')(app);

io.on("connection", function(socket){
	
    socket.on("entrar", function(apelido, callback){
        if(!(apelido in usuarios)){
            socket.apelido = apelido;
            usuarios[apelido] = socket;
            callback(true);
        } 
        else callback(false);
    });
    socket.on("enviar mensagem", function(dados, callback){
        var mensagem_enviada = dados.msg;
        var usuario = dados.usu;
        var remetente = socket.apelido;
        var obj_mensagem = {msg: mensagem_enviada, rem: remetente};
        usuarios[remetente].emit("atualizar mensagens", obj_mensagem);
        usuarios[usuario].emit("atualizar mensagens", obj_mensagem);
        callback();
    });
});