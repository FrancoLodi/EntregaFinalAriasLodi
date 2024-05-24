// Entrega final - Arias Lodi - JavaScript Coderhouse

let productos = []
let total = 0
let carrito = []
const submits = []

// Seleccionar contenedor productos
const contenedorProductos = document.querySelector("#contenedor-productos")
console.log(contenedorProductos)

// Importar productos de json
async function importarProductos() {
    try {
        const response = await fetch('productos.json')
        if (!response.ok) {
        throw new Error('No se pudo importar los datos del archivo json')
    }
        productos = await response.json()
        cargarProducto(productos)
    } catch (error) {
        console.error('Hubo un problema con fetch:', error)
    }
}

console.table(productos)

// Cargar tarjeta de producto
const cargarProducto = (elemento) =>{
    elemento.forEach (producto =>{
        const tarjetaProducto = document.createElement("div")
        tarjetaProducto.setAttribute("id", "tarjeta-producto")
        tarjetaProducto.innerHTML = `
                                    <img class="producto-imagen" src="${producto.imagen}">
                                    <div class="producto-detalles">
                                        <p class="producto-nombre">${producto.nombre}</p>
                                        <p class="producto-precio">$${producto.precio}</p>
                                    </div>
                                    <div class="producto-cantidad">
                                        <button id=${producto.id} class="boton-restar-cantidad">-</button>
                                        <p id="cantidad-productos-${producto.id}">Cantidad: ${producto.cantidad}</p>
                                        <button id=${producto.id} class="boton-sumar-cantidad">+</button>
                                    </div>
                                    <div class="producto-boton-agregar">
                                        <button id=${producto.id} class="boton-agregar-carrito">Agregar a carrito</button>
                                    </div>
                                    `
        contenedorProductos.appendChild(tarjetaProducto)
    })
    // boton agregar
    const botonAgregarCarrito = document.querySelectorAll(".boton-agregar-carrito")
    botonAgregarCarrito.forEach( elemento =>{
        elemento.addEventListener('click', (evento)=>{
            agregarCarrito(evento.target.id)
        })
    })
    // boton +
    const botonSumarCantidad = document.querySelectorAll(".boton-sumar-cantidad")
    botonSumarCantidad.forEach( elemento =>{
        elemento.addEventListener('click', (evento)=>{
            sumarCantidad(evento.target.id)
        })
    })
    // boton -
    const botonRestarCantidad = document.querySelectorAll(".boton-restar-cantidad")
    botonRestarCantidad.forEach( elemento =>{
        elemento.addEventListener('click', (evento)=>{
            restarCantidad(evento.target.id)
        })
    })
}

// Agregar producto al carrito
const agregarCarrito = (id) =>{
    let productoSeleccionado = productos.find( producto => producto.id === parseInt(id))
    // Copia del objeto para agregar a Carrito
    let productoClonado = {...productoSeleccionado}
    // Verificar si existe en carrito
    existe = carrito.some(producto => producto.id === parseInt(id))
    if (existe){
        let productoSeleccionadoDelCarrito = carrito.find( producto => producto.id === parseInt(id))
        productoSeleccionadoDelCarrito.cantidad += productoClonado.cantidad
    } else {
        carrito.push(productoClonado)
    }
    console.table(carrito)
    mostrarCarrito(carrito)
}

// Seleccionar contenedor carrito
const contenedorCarrito = document.querySelector("#contenedor-carrito")
console.log(contenedorCarrito)

// Mostrar carrito
const mostrarCarrito = (elemento) =>{
    contenedorCarrito.innerHTML = ""
    elemento.forEach(producto=>{
        let carritoProductos = document.createElement("div")
        carritoProductos.innerHTML = `
                                    <div class="producto-detalles-carrito">
                                        <p class="producto-carrito-nombre">${producto.nombre}</p>
                                        <p id="precio-carrito-${producto.id}" class="producto-carrito-precio">$${producto.precio * producto.cantidad}</p>
                                        <div class="producto-carrito-cantidad">
                                            <button id=${producto.id} class="boton-restar-carrito">-</button>
                                            <p id="cantidad-productos-carrito-${producto.id}">Cantidad: ${producto.cantidad}</p>
                                            <button id=${producto.id} class="boton-sumar-carrito">+</button>
                                        </div>
                                        <button id=${producto.id} class="boton-carrito-eliminar">Eliminar</button>
                                    </div>
                                    `
        contenedorCarrito.appendChild(carritoProductos)
        
    })
    // boton + 
    const botonSumarCarrito = document.querySelectorAll(".boton-sumar-carrito")
    botonSumarCarrito.forEach( elemento =>{
        elemento.addEventListener('click', (evento)=>{
            sumarCarrito(evento.target.id)
        })
    })
    // boton -
    const botonRestarCarrito = document.querySelectorAll(".boton-restar-carrito")
    botonRestarCarrito.forEach( elemento =>{
        elemento.addEventListener('click', (evento)=>{
            restarCarrito(evento.target.id)
        })
    })
    // boton eliminar carrito
    const botonEliminarDeCarrito = document.querySelectorAll(".boton-carrito-eliminar")
    botonEliminarDeCarrito.forEach( elemento =>{
        elemento.addEventListener('click', (evento)=>{
            eliminarDeCarrito(evento.target.id)
        })
    })
    // total en carrito
    calcularTotal(carrito)
    const totalCarrito = document.querySelector("#total-carrito")
    totalCarrito.innerText = `SUBTOTAL: $${total}`
    // guardar carrito
    guardarCarritoStorage()
}

// funcion calcular total
const calcularTotal = (elemento) =>{
    total = 0
    elemento.forEach (producto =>{
        total += producto.precio * producto.cantidad
    })
}

// funcion sumar cantidad
const sumarCantidad = (id) =>{
    let productoSeleccionado = productos.find ( producto => producto.id === parseInt(id))
    productoSeleccionado.cantidad++
    const cantidadProductos = document.querySelector(`#cantidad-productos-${id}`)
    cantidadProductos.innerText = `Cantidad: ${productoSeleccionado.cantidad}`
}

// funcion restar cantidad
const restarCantidad = (id) =>{
    let productoSeleccionado = productos.find ( producto => producto.id === parseInt(id))
    if (productoSeleccionado.cantidad > 1){
        productoSeleccionado.cantidad--
    }
    const cantidadProductos = document.querySelector(`#cantidad-productos-${id}`)
    cantidadProductos.innerText = `Cantidad: ${productoSeleccionado.cantidad}`
}

// funcion sumar en carrito
const sumarCarrito = (id) =>{
    let productoSeleccionadoDelCarrito = carrito.find ( producto => producto.id === parseInt(id))
    productoSeleccionadoDelCarrito.cantidad++
    const cantidadProductosCarrito = document.querySelector(`#cantidad-productos-carrito-${id}`)
    cantidadProductosCarrito.innerText = `Cantidad: ${productoSeleccionadoDelCarrito.cantidad}`
    // precio actualizado en carrito
    const precioProductoCarrito = document.querySelector(`#precio-carrito-${id}`)
    precioProductoCarrito.innerText = `$${productoSeleccionadoDelCarrito.precio * productoSeleccionadoDelCarrito.cantidad}`
    // actualizar subtotal en carrito
    calcularTotal(carrito)
    const totalCarrito = document.querySelector("#total-carrito")
    totalCarrito.innerText = `SUBTOTAL: $${total}`
    guardarCarritoStorage()
}

// funcion restar en carrito
const restarCarrito = (id) =>{
    let productoSeleccionadoDelCarrito = carrito.find ( producto => producto.id === parseInt(id))
    if (productoSeleccionadoDelCarrito.cantidad > 1){
        productoSeleccionadoDelCarrito.cantidad--
    }
    const cantidadProductosCarrito = document.querySelector(`#cantidad-productos-carrito-${id}`)
    cantidadProductosCarrito.innerText = `Cantidad: ${productoSeleccionadoDelCarrito.cantidad}`
    // precio actualizado en carrito
    const precioProductoCarrito = document.querySelector(`#precio-carrito-${id}`)
    precioProductoCarrito.innerText = `$${productoSeleccionadoDelCarrito.precio * productoSeleccionadoDelCarrito.cantidad}`
    // actualizar subtotal del carrito
    calcularTotal(carrito)
    const totalCarrito = document.querySelector("#total-carrito")
    totalCarrito.innerText = `SUBTOTAL: $${total}`
    guardarCarritoStorage()
}

// funcion eliminar de carrito
const eliminarDeCarrito = (id) =>{
    let productoSeleccionadoDelCarrito = carrito.find ( producto => producto.id === parseInt(id))
    console.log(carrito.indexOf(productoSeleccionadoDelCarrito))
    indiceProductoEliminado = carrito.indexOf(productoSeleccionadoDelCarrito)
    carrito.splice(indiceProductoEliminado, 1)
    console.table(carrito)
    mostrarCarrito(carrito)
}

// funcion guardar carrito en almacenamiento
const guardarCarritoStorage = () => {
    // objeto a JSON
    let carritoJSON = JSON.stringify(carrito)
    console.log(carritoJSON)
    // guardar en localStorage
    localStorage.setItem('carrito', carritoJSON)
}

// funcion cargar carrito del almacenamiento
const cargarCarritoStorage = () => {
    // cargar de localStorage
    let carritoJSON = localStorage.getItem('carrito')
    if (carritoJSON){
        // JSON a objeto
        return carrito = JSON.parse(carritoJSON)
    } else {
        carrito = []
    }
    console.log(carrito)
}

// formulario
const formulario = document.getElementById("formulario")

formulario.addEventListener("submit", (evento)=>{
    evento.preventDefault()
    const informacion = new FormData(evento.target)
    const submit = Object.fromEntries(informacion)
    // limpiar submits para imprimir solo uno
    submits.pop()
    submits.push(submit)
    console.table(submits)
    
    contenedorResumen.innerHTML = ""
    cargarTituloResumen()
    cargarResumenCarrito(carrito)
    cargarResumenEntrega(submits)
    cargarResumenTotal()
    botonesFinales()
})

// contenedor resumen de compra
const contenedorResumen = document.querySelector("#contenedor-resumen")
console.log(contenedorResumen)

// funcion titulo resumen
const cargarTituloResumen = () =>{
    const tituloResumen = document.createElement("h2")
    tituloResumen.setAttribute("class", "titulo-resumen")
    tituloResumen.innerText = "Resumen de compra"
    contenedorResumen.appendChild(tituloResumen)
}

// funcion cargar resumen carrito
const cargarResumenCarrito = (elemento) =>{
    elemento.forEach( producto =>{
        const resumenCarrito = document.createElement("div")
        resumenCarrito.innerHTML = `
                            <div class="resumen-carrito">
                                <p>${producto.nombre}</p>
                                <p>$${producto.precio}</p>
                                <p>Cantidad: ${producto.cantidad}</p>
                            </div>
                            `
        contenedorResumen.appendChild(resumenCarrito)
    })
}

// funcion cargar resumen entrega y pago
const cargarResumenEntrega = (elemento) =>{
    elemento.forEach( dato =>{
        const resumenEntrega = document.createElement("div")
        resumenEntrega.setAttribute("class", "resumen-entrega")
        resumenEntrega.innerHTML = `
                            <div>
                                <p>Método de entrega: ${dato.entrega}</p>
                                <p>Nombre Completo: ${dato.nombreCompleto}</p>
                                <p>Email: ${dato.email}</p>
                                <p>Telefono: ${dato.telefono}</p>
                                <p>Forma de Pago: ${dato.pago}</p>
                            </div>
                            `
        contenedorResumen.appendChild(resumenEntrega)
    })
}

// funcion cargar resumen total
const cargarResumenTotal = () =>{
    const resumenTotal = document.createElement("div")
    resumenTotal.setAttribute("class", "resumen-total")
    resumenTotal.innerText = `TOTAL: $${total}`
    contenedorResumen.appendChild(resumenTotal)
}

// funcion cargar botones Confirmar y Cancelar
const botonesFinales = () =>{
    const contenedorBotones = document.createElement("div")
    contenedorBotones.setAttribute("class", "botones-cancelar-y-confirmar")
    contenedorBotones.innerHTML = `
                                <button class="boton-final-cancelar">Cancelar</button>
                                <button class="boton-final-confirmar">Confirmar</button>
                                `
    contenedorResumen.appendChild(contenedorBotones)
    // boton Cancelar
    const botonCancelar = document.querySelector(".boton-final-cancelar")
    botonCancelar.addEventListener("click", ()=>{
        // Sweet Alert Cancelar
        const botonCancelarSweetAlert = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });
        botonCancelarSweetAlert.fire({
            title: "¿Vaciar carrito?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, vaciar",
            cancelButtonText: "No, volver",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Confirmacion Vaciar carrito
                botonCancelarSweetAlert.fire({
                    title: "¡Carrito vaciado!",
                    icon: "success"
                });
                // vaciar carrito y submits
                carrito = []
                submits.pop()
                // limpia pantalla
                mostrarCarrito(carrito)
                contenedorResumen.innerHTML = ""
            } else if (
                // Cancelar vaciar carrito
                result.dismiss === Swal.DismissReason.cancel
            ) {
                botonCancelarSweetAlert.fire({
                title: "Cancelado",
                text: "Volviendo atras.",
                icon: "error"
                })
            }
        })
    })
    // boton Confirmar
    const botonConfirmar = document.querySelector(".boton-final-confirmar")
    botonConfirmar.addEventListener("click", ()=>{
        // Sweet alert confirm
        const botonConfirmarSweetAlert = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });
        botonConfirmarSweetAlert.fire({
            title: "¿Confirmar compra?",
            text: `TOTAL: $${total}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Confirmar y pagar",
            cancelButtonText: "Cancelar y volver",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Compra realizada
                botonConfirmarSweetAlert.fire({
                    title: "¡Compra exitosa!",
                    text: "Gracias por elegirnos.",
                    icon: "success"
                });
                // vaciar carrito y submits
                carrito = []
                submits.pop()
                // limpia pantalla
                mostrarCarrito(carrito)
                contenedorResumen.innerHTML = ""
            } else if (
                // Compra cancelada
                result.dismiss === Swal.DismissReason.cancel
            ) {
                botonConfirmarSweetAlert.fire({
                title: "Compra cancelada",
                text: "Volviendo atras.",
                icon: "error"
                })
            }
        })
    })
}

importarProductos()
cargarProducto(productos)
cargarCarritoStorage()
mostrarCarrito(carrito)