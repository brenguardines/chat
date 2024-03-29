/* CLASE 11 - CHAT COMUNITARIO */

//1) npm init --yes para generar el package.json de nuestro proyecto.
//2) Instalamos las dependencias que necesitamos para generar nuestro chat: npm install express express-handlebars socket.io
//3) Instalar nodemon como dependencia de desarrollo (npm i nodemon -D) y generar el script ("dev": "nodemon src/app.js")

const express = require("express");
const app = express();
const PUERTO = 8080;
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const viewsRouter = require("./routes/views.router.js");

//Configuramos Express-Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Middleware
app.use(express.static("./src/public"));

//Rutas
app.use("/", viewsRouter);

//1) Me guardo una referencia del servidor http para pasarsela a socket.io
const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO}`);
})

//Socket.io

//2)Creamos una instacia de socket.io pasandole como parametro el servidor http.
const io = new socket.Server(httpServer);

//3)Crear un array para guardar los mensajes que se vayan enviando en el chat.
let messages = [];

io.on("connection", (socket) => {
    console.log("Un cliente conectado");

    socket.on("message", (data) => {
        //Recibo la data del cliente y lo voy a pushear en el array que declaramos arriba:
        messages.push(data);
        //Utilizamos el metodo emit que nos permite emitir eventos desde el servidor hacia el cliente.
        io.emit("messagesLogs", messages);
    })
})
