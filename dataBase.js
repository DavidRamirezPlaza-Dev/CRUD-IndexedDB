var bd;
var boxClientes;
var boxProductos;
var boxVentas;

function iniciarBD()
{
    // Llamar Boxes del html
    boxClientes = document.querySelector(".boxClientes");
    boxProductos = document.querySelector(".boxProductos");
    boxVentas = document.querySelector(".boxVentas");
    // Guardar botones en variables.
    var btnRegistrarCliente = document.querySelector("#btnRegistrarCliente"); // Se llama al btnRegistrarCliente del html.
    var btnRegistrarProducto = document.querySelector("#btnRegistrarProducto"); //Se llama al btnRegistrarProducto del html.
    var btnRegistrarVenta = document.querySelector("#btnRegistrarVenta"); //Se llama al btnRegistrarVenta del html.
    
    // Agregar "EventListener" a cada boton.
    btnRegistrarCliente.addEventListener("click", registrarCliente); // Cuando se le da click, se llama a la funcion registrarCliente.
    btnRegistrarProducto.addEventListener("click", registrarProducto); // Cuando se le da click, se llama a la funcion registrarProducto.
    btnRegistrarVenta.addEventListener("click", registrarVenta); // Cuando se le da click, se llama a la funcion registrarVenta.

    //Solicitud para abrir base de datos.
    var solicitud = indexedDB.open("T3-Base-De-Datos","1"); // indexedDB.open("nombre de la base de datos", "version").
    //Posibles resultados de la solicitud.
    solicitud.addEventListener("error", MostrarError); // Si tiene exito la solicitud, llama a la funcion "MostrarError", donde, de haber errores, se muestran en pantalla.
    solicitud.addEventListener("success", Comenzar); // Si tiene exito la solicitud, llama a la funcion "Comenzar", la cual a su vez, llama a la funcion "Mostrar".
    solicitud.addEventListener("upgradeneeded", CrearAlmacen); // Si tiene exito la solicitud, llama a la funcion "CrearAlmacen", donde se van a crear los "objectStore".
}

function MostrarError(evento) //muestra un mensaje de error.
{
    const error = evento.target.error;
    alert("ERROR:" + error.code + "/" + error.message);
}

function Comenzar(evento) //apertura exitosa de la base de datos.
{
    bd = evento.target.result;
    TransaccionMostrarListaClientes();
    TransaccionMostrarListaProductos();
    TransaccionMostrarListaVentas();
}

//Esto corresponderia al "Create Table" de sql. (DDL) -> CREATE TABLE, ALTER TABLE, DROP TABLE.
function CrearAlmacen(evento) //la base de datos no existe o esta desactualizada.
{
    baseDeDatos = evento.target.result;
    //Clientes
    var almacenClientes = baseDeDatos.createObjectStore("Clientes", {keyPath: "rut"}); //Aqui creamos un "objectStore", es el equivalente a las tablas de sql.
    almacenClientes.createIndex("BuscarRut","rut", {unique: true}); //Aqui creamos un indice; .createIndex("nombre del indice","identificador","unique: false or true").
    //Productos
    var almacenProductos = baseDeDatos.createObjectStore("Productos", {keyPath: "productoID"});
    almacenProductos.createIndex("BuscarIdProducto","productoID", {unique: true});
    //Ventas
    var almacenVentas = baseDeDatos.createObjectStore("Ventas", {keyPath: "ventaID", autoIncrement: true});
    almacenVentas.createIndex("BuscarIdVenta","ventaID", {unique: true}); 
}

//Esto corresponderia a un "Insert" de sql. (DML) -> INSERT, SELECT, UPDATE, DELETE.
function registrarCliente()
{
    //Clientes
    var R = document.querySelector("#rut").value; //Capturamos los valores de cada caja de texto en el formulario
    var N = document.querySelector("#nombre").value; //Capturamos los valores de cada caja de texto en el formulario
    var D = document.querySelector("#direccion").value; //Capturamos los valores de cada caja de texto en el formulario
    var T = document.querySelector("#telefono").value; //Capturamos los valores de cada caja de texto en el formulario

    var transaccionClientes = bd.transaction(["Clientes"], "readwrite"); //le informamos a indexedDB que queremos hacer una "transaction"; el equivalente a las queries de sql.
    var almacenClientes = transaccionClientes.objectStore("Clientes"); //Aqui abrimos el "objectStore" "Clientes".
    transaccionClientes.addEventListener("complete",TransaccionMostrarListaClientes); //Despues de que se registre el cliente, se activa la funcion "TransaccionMostrarListaClientes()", para actualizar la lista de clientes.

    almacenClientes.add( //Aqui finalmente guardamos los datos.
        {
            rut: R,
            nombre: N,
            direccion: D,
            telefono: T
        }
    );

    document.querySelector("#rut").value = ""; //Limpiamos los campos, para poder almacenar nuevos datos.
    document.querySelector("#nombre").value = ""; //Limpiamos los campos, para poder almacenar nuevos datos.
    document.querySelector("#direccion").value = ""; //Limpiamos los campos, para poder almacenar nuevos datos.
    document.querySelector("#telefono").value = ""; //Limpiamos los campos, para poder almacenar nuevos datos.
}

function registrarProducto()
{
    //Productos
    var I = document.querySelector("#idProducto").value; //Capturamos los valores de cada caja de texto en el formulario
    var DE = document.querySelector("#descripcion").value; //Capturamos los valores de cada caja de texto en el formulario
    var P = document.querySelector("#precio").value; //Capturamos los valores de cada caja de texto en el formulario

    var transaccionProductos = bd.transaction(["Productos"], "readwrite"); //le informamos a indexedDB que queremos hacer una "transaction"; el equivalente a las queries de sql.
    var almacenProductos = transaccionProductos.objectStore("Productos"); //Aqui abrimos el "objectStore" "Productos".
    transaccionProductos.addEventListener("complete",TransaccionMostrarListaProductos); //Despues de que se registre el producto, se activa la funcion "TransaccionMostrarListaProductos()", para actualizar la lista de productos.

    almacenProductos.add( //Aqui finalmente guardamos los datos.
        {
            productoID: I,
            descripcion: DE,
            precio: P
        }
    );

    document.querySelector("#idProducto").value = ""; //Limpiamos los campos, para poder almacenar nuevos datos.
    document.querySelector("#descripcion").value = ""; //Limpiamos los campos, para poder almacenar nuevos datos.
    document.querySelector("#precio").value = ""; //Limpiamos los campos, para poder almacenar nuevos datos.
}

function registrarVenta()
{
    //Ventas
    var F = document.querySelector("#fecha").value; //Capturamos los valores de cada caja de texto en el formulario
    var C = document.querySelector("#clienteID").value; //Capturamos los valores de cada caja de texto en el formulario
    var PID = document.querySelector("#productoID").value; //Capturamos los valores de cada caja de texto en el formulario
    var CA = document.querySelector("#cantidad").value; //Capturamos los valores de cada caja de texto en el formulario

    var transaccionClientes = bd.transaction(["Clientes"]); //le informamos a indexedDB que queremos hacer una "transaction"; el equivalente a las queries de sql. Como es de solo lectura, no es necesario especificar el tipo.
    var almacenClientes = transaccionClientes.objectStore("Clientes"); //Aqui abrimos el "objectStore" "Clientes".
    var solicitudClientes = almacenClientes.get(C);

    solicitudClientes.addEventListener("success", function(){
        var clienteIdExiste = solicitudClientes.result;
        if(clienteIdExiste)
        {
            var transaccionProductos = bd.transaction(["Productos"]);
            var almacenProductos = transaccionProductos.objectStore(["Productos"]);
            var solicitudProductos = almacenProductos.get(PID);

            solicitudProductos.addEventListener("success", function(){
                var productoIdExiste = solicitudProductos.result;
                if(productoIdExiste){
                    var transaccionVentas = bd.transaction(["Ventas"], "readwrite"); //le informamos a indexedDB que queremos hacer una "transaction"; el equivalente a las queries de sql.
                    var almacenVentas = transaccionVentas.objectStore("Ventas"); //Aqui abrimos el "objectStore" "Ventas".
                    transaccionVentas.addEventListener("complete",TransaccionMostrarListaVentas); //Despues de que se registre el cliente, se activa la funcion "TransaccionMostrarListaVentas()", para actualizar la lista de ventas.
                
                    almacenVentas.add( //Aqui finalmente guardamos los datos.
                        {
                            fecha: F,
                            clienteID: C,
                            productoID: PID,
                            cantidad: CA
                        }
                    );
                
                    document.querySelector("#fecha").value = ""; //Limpiamos los campos, para poder almacenar nuevos datos.
                    document.querySelector("#clienteID").value = ""; //Limpiamos los campos, para poder almacenar nuevos datos.
                    document.querySelector("#productoID").value = ""; //Limpiamos los campos, para poder almacenar nuevos datos.
                    document.querySelector("#cantidad").value = ""; //Limpiamos los campos, para poder almacenar nuevos datos.
                } else {
                    alert("El producto con ID " + PID + " no existe en la base de datos.");
                }
            });
        } else {
            alert("El RUT " + C + " no existe en la base de datos.");
        }
    } );

};

// FUNCIONES PARA MOSTRAR LISTAS

function TransaccionMostrarListaClientes()
{
    boxClientes.innerHTML = "";
    var transaccion = bd.transaction(["Clientes"]); //le informamos a indexedDB que queremos hacer una "transaction"; el equivalente a las queries de sql. Como es de solo lectura, no es necesario especificar el tipo.
    var almacen = transaccion.objectStore("Clientes"); //Aqui abrimos el "objectStore" "Clientes".
    var puntero = almacen.openCursor(); //Para acceder a los datos de indexedDB, necesitamos usar los "Cursors" o punteros en español.
    puntero.addEventListener("success", MostrarListaClientes); //Si se tiene exito al abrir el "Cursor", se ejecuta la funcion "MostrarListaClientes";
}

function MostrarListaClientes(evento)
{
    var puntero = evento.target.result;
    if(puntero)
    {
        boxClientes.innerHTML += "<div><input type='button' class='btn btn-success' value='Venta' onclick='seleccionarCliente(\"" + puntero.value.rut + "\")'>" + "&nbsp;<input type='button' class='btn btn-danger' value='Borrar' onclick='eliminarCliente(\"" + puntero.value.rut + "\")'>&nbsp;&nbsp;&nbsp;" + puntero.value.rut + " / " + puntero.value.nombre + " / " + puntero.value.direccion + " / " + puntero.value.telefono +"</div>";
        puntero.continue(); //Es necesario añadir la funcion "continue()", para que el puntero pase al siguiente objeto y no se quede pegado en el primero.
    }
}

function TransaccionMostrarListaProductos()
{
    boxProductos.innerHTML = "";
    var transaccion = bd.transaction(["Productos"]); //le informamos a indexedDB que queremos hacer una "transaction"; el equivalente a las queries de sql. Como es de solo lectura, no es necesario especificar el tipo.
    var almacen = transaccion.objectStore("Productos"); //Aqui abrimos el "objectStore" "Productos".
    var puntero = almacen.openCursor(); //Para acceder a los datos de indexedDB, necesitamos usar los "Cursors" o punteros en español.
    puntero.addEventListener("success", MostrarListaProductos); //Si se tiene exito al abrir el "Cursor", se ejecuta la funcion "MostrarListaProductos";
}

function MostrarListaProductos(evento)
{
    var puntero = evento.target.result;
    if(puntero)
    {
        boxProductos.innerHTML += "<div><p><input type='button' class='btn btn-success'  value='Venta' onclick='seleccionarProducto(\"" + puntero.value.productoID + "\")'>&nbsp;&nbsp;&nbsp;" + puntero.value.productoID + " / " + puntero.value.descripcion + " / " + puntero.value.precio +"</p><input type='button' class='btn btn-danger' value='Borrar' onclick='eliminarProducto(\"" + puntero.value.productoID + "\")'></div>";

        puntero.continue(); //Es necesario añadir la funcion "continue()", para que el puntero pase al siguiente objeto y no se quede pegado en el primero.
    }
}

function eliminarProducto(key)
{
    var transaccion = bd.transaction(["Productos"], "readwrite");
    var almacen = transaccion.objectStore("Productos");
    transaccion.addEventListener("complete",TransaccionMostrarListaProductos);
    var solicitud = almacen.delete(key);
}

function TransaccionMostrarListaVentas()
{
    boxVentas.innerHTML = "";
    var transaccion = bd.transaction(["Ventas"]); //le informamos a indexedDB que queremos hacer una "transaction"; el equivalente a las queries de sql. Como es de solo lectura, no es necesario especificar el tipo.
    var almacen = transaccion.objectStore("Ventas"); //Aqui abrimos el "objectStore" "Ventas".
    var puntero = almacen.openCursor(); //Para acceder a los datos de indexedDB, necesitamos usar los "Cursors" o punteros en español.
    puntero.addEventListener("success", MostrarListaVentas); //Si se tiene exito al abrir el "Cursor", se ejecuta la funcion "MostrarListaVentas";
}

function MostrarListaVentas(evento)
{
    var puntero = evento.target.result;
    if(puntero)
    {
        boxVentas.innerHTML += "<div><input type='button' class='btn btn-danger' value='Borrar' onclick='eliminarVenta(\"" + puntero.value.ventaID + "\")'>&nbsp;&nbsp;&nbsp;" + puntero.value.ventaID + " / " + puntero.value.fecha + " / " + puntero.value.clienteID + " / " + puntero.value.productoID + " / "  + puntero.value.cantidad + "</div>";
        puntero.continue(); //Es necesario añadir la funcion "continue()", para que el puntero pase al siguiente objeto y no se quede pegado en el primero.
    }
}

//TERMINAN FUNCIONES PARA MOSTRAR LISTAS
function seleccionarCliente(clave) 
{
    var transaccion = bd.transaction(["Clientes"], "readwrite");
    var almacen = transaccion.objectStore("Clientes");
    var solicitud = almacen.get(clave); //se usa el metodo .get() para obtener la clave del objectStore "Clientes"

    solicitud.addEventListener("success", function()
    {
        document.querySelector("#clienteID").value = solicitud.result.rut;
    });
}

function seleccionarProducto(clave) 
{
    var transaccion = bd.transaction(["Productos"], "readwrite");
    var almacen = transaccion.objectStore("Productos");
    var solicitud = almacen.get(clave); //se usa el metodo .get() para obtener la clave del objectStore "Clientes"

    solicitud.addEventListener("success", function()
    {
        document.querySelector("#productoID").value = solicitud.result.productoID;
    });
}

function eliminarVenta(key)
{
    console.log("Ejecutando función eliminarVenta. Clave a eliminar:", key); // Agregar log indicando que se está ejecutando la función y qué clave se está intentando eliminar
    var transaccion = bd.transaction(["Ventas"], "readwrite");
    var almacen = transaccion.objectStore("Ventas");
    transaccion.addEventListener("complete",TransaccionMostrarListaVentas);
    console.log("Ejecutando función eliminarVenta. Clave a eliminar:", key);
    var solicitud = almacen.delete(Number(key)); //El metodo .delete() borra el objeto. CUANDO ES AUTO INCREMENTAL HAY QUE PONER NUMBER.
    console.log(solicitud);
}

function eliminarCliente(key)
{
    var transaccion = bd.transaction(["Clientes"], "readwrite");
    var almacen = transaccion.objectStore("Clientes");
    transaccion.addEventListener("complete",TransaccionMostrarListaClientes);
    var solicitud = almacen.delete(key); //El metodo .delete() borra el objeto.
}

function buscarClientePorRut() {
    var rut = document.querySelector("#buscarRut").value;
    var transaccion = bd.transaction(["Clientes"], "readonly");
    var almacen = transaccion.objectStore("Clientes");
    var solicitud = almacen.get(rut);

    solicitud.addEventListener("success", function() {
        var cliente = solicitud.result;
        if (cliente) {
            document.querySelector("#nombreCliente").value = cliente.nombre;
            document.querySelector("#direccionCliente").value = cliente.direccion;
            document.querySelector("#telefonoCliente").value = cliente.telefono;
        } else {
            alert("Cliente no encontrado.");
        }
    });
}
// Función para buscar cliente por RUT
function buscarClientePorRut() {
    var rut = document.querySelector("#buscarRut").value;
    var transaccion = bd.transaction(["Clientes"], "readonly");
    var almacen = transaccion.objectStore("Clientes");
    var solicitud = almacen.get(rut);

    solicitud.addEventListener("success", function() {
        var cliente = solicitud.result;
        if (cliente) {
            document.querySelector("#nombreCliente").value = cliente.nombre;
            document.querySelector("#direccionCliente").value = cliente.direccion;
            document.querySelector("#telefonoCliente").value = cliente.telefono;
        } else {
            alert("Cliente no encontrado.");
        }
    });
}

// Función para buscar producto por ID
function buscarProductoPorId() {
    var idProducto = document.querySelector("#buscarIdProducto").value;
    var transaccion = bd.transaction(["Productos"], "readonly");
    var almacen = transaccion.objectStore("Productos");
    var solicitud = almacen.get(idProducto);

    solicitud.addEventListener("success", function() {
        var producto = solicitud.result;
        if (producto) {
            document.querySelector("#descripcionProducto").value = producto.descripcion;
            document.querySelector("#precioProducto").value = producto.precio;
        } else {
            alert("Producto no encontrado.");
        }
    });
}

// Función para editar precio de producto
function editarPrecioProducto() {
    var idProducto = document.querySelector("#buscarIdProducto").value;
    var nuevoPrecio = document.querySelector("#nuevoPrecio").value;

    var transaccion = bd.transaction(["Productos"], "readwrite");
    var almacen = transaccion.objectStore("Productos");
    var solicitud = almacen.get(idProducto);

    solicitud.addEventListener("success", function() {
        var producto = solicitud.result;
        if (producto) {
            producto.precio = nuevoPrecio;
            var actualizar = almacen.put(producto);
            actualizar.addEventListener("success", function() {
                alert("Precio del producto actualizado correctamente.");
                document.querySelector("#precioProducto").value = nuevoPrecio;
                location.reload();
            });
        } else {
            alert("Producto no encontrado.");
        }
    });
}
document.querySelector("#btnBuscarCliente").addEventListener("click", buscarClientePorRut);
document.querySelector("#btnBuscarProducto").addEventListener("click", buscarProductoPorId);
document.querySelector("#btnEditarPrecio").addEventListener("click", editarPrecioProducto);





window.addEventListener("load", iniciarBD);

