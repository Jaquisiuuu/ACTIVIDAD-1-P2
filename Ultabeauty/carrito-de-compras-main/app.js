// Variable que mantiene el estado visible del carrito
var carritoVisible = false;
var descuento = 0.10; // Ejemplo: 10% de descuento predeterminado
var puntosMaximos = 100; // Máximo de puntos de lealtad que se pueden usar
var codigoDescuentoValido = "DESCUENTO10"; // Código de descuento válido

document.addEventListener('DOMContentLoaded', function() {
    ocultarCarrito(); // Ocultar el carrito al iniciar
    ready(); // Llamamos a la función ready
});

function ready() {
    var botonesAgregarAlCarrito = document.getElementsByClassName('boton-item');
    for (var i = 0; i < botonesAgregarAlCarrito.length; i++) {
        var button = botonesAgregarAlCarrito[i];
        // Reemplaza esta línea
        button.addEventListener('click', agregarAlCarritoClicked); // Esta es tu lógica actual
    }
    document.getElementsByClassName('btn-pagar')[0].addEventListener('click', pagarClicked);
}

function agregarAlCarritoClicked(event) {
    var button = event.target;
    var item = button.parentElement;
    var titulo = item.getElementsByClassName('titulo-item')[0].innerText;
    var precioTexto = item.getElementsByClassName('precio-item')[0].innerText;
    var precio = parseFloat(precioTexto.replace('$', '').replace(/\./g, '').replace(',', '.').trim());
    var imagenSrc = item.getElementsByClassName('img-item')[0].src; // Obtiene la URL de la imagen

    agregarItemAlCarrito(titulo, precio, imagenSrc); // Actualiza la llamada a la función
    if (!carritoVisible) {
        hacerVisibleCarrito();
    }
}

function hacerVisibleCarrito() {
    carritoVisible = true;
    var carrito = document.getElementsByClassName('carrito')[0];
    carrito.style.marginRight = '0'; // Mostrar el carrito
    carrito.style.opacity = '1'; // Cambiar opacidad a visible
}


function agregarItemAlCarrito(titulo, precio, imagenSrc) {
    var itemsCarrito = document.getElementsByClassName('carrito-items')[0];
    var itemCarrito = document.createElement('div');
    itemCarrito.classList.add('carrito-item');

    // Contenido del nuevo item en el carrito
    itemCarrito.innerHTML = `
        <img src="${imagenSrc}" width="50" height="50" alt="${titulo}">
        <div class="carrito-item-detalles">
            <span class="carrito-item-titulo">${titulo}</span>
            <div class="selector-cantidad">
                <i class="fa-solid fa-minus restar-cantidad"></i>
                <input type="text" value="1" class="carrito-item-cantidad" id="cantidad-${titulo.replace(/\s+/g, '-')}" disabled>
                <i class="fa-solid fa-plus sumar-cantidad"></i>
            </div>
            <span class="carrito-item-precio">$${precio.toLocaleString('es')}</span>
        </div>
        <button class="btn-eliminar"><i class="fa-solid fa-trash"></i></button>
    `;
    
    itemsCarrito.appendChild(itemCarrito);

    // Agregar eventos a los nuevos elementos
    itemCarrito.getElementsByClassName('btn-eliminar')[0].addEventListener('click', eliminarItemCarrito);
    itemCarrito.getElementsByClassName('sumar-cantidad')[0].addEventListener('click', sumarCantidad);
    itemCarrito.getElementsByClassName('restar-cantidad')[0].addEventListener('click', restarCantidad);

    // Actualizamos total
    actualizarTotalCarrito();
}

function sumarCantidad(event) {
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    var cantidadActual = parseInt(selector.getElementsByClassName('carrito-item-cantidad')[0].value);
    cantidadActual++;
    selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
    actualizarTotalCarrito();
}

function restarCantidad(event) {
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    var cantidadActual = parseInt(selector.getElementsByClassName('carrito-item-cantidad')[0].value);
    cantidadActual--;
    if (cantidadActual >= 1) {
        selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
        actualizarTotalCarrito();
    }
}

function eliminarItemCarrito(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    actualizarTotalCarrito();
    ocultarCarrito();
}

function actualizarTotalCarrito() {
    var carritoItems = document.getElementsByClassName('carrito-items')[0];
    var total = 0;

    for (var i = 0; i < carritoItems.children.length; i++) {
        var item = carritoItems.children[i];
        var precioTexto = item.getElementsByClassName('carrito-item-precio')[0].innerText;
        var precio = parseFloat(precioTexto.replace('$', '').replace(/\./g, '').replace(',', '.').trim());
        var cantidad = parseInt(item.getElementsByClassName('carrito-item-cantidad')[0].value);
        total += precio * cantidad;
    }

    // Verificar si se ha introducido un código de descuento válido
    var codigoDescuento = document.getElementById('codigo-descuento').value;
    var descuentoAplicado = 0;
    if (codigoDescuento === codigoDescuentoValido) {
        descuentoAplicado = total * descuento; // 10% de descuento
    }

    // Aplicar puntos de lealtad
    var puntosUsados = parseInt(document.getElementById('puntos-lealtad').value);
    if (isNaN(puntosUsados) || puntosUsados < 0) {
        puntosUsados = 0; // Si no es un número o es negativo, lo establecemos en 0
    } else if (puntosUsados > puntosMaximos) {
        puntosUsados = puntosMaximos; // Máximo de puntos permitidos
    }

    var descuentoPuntos = puntosUsados; // 1 punto = 1 unidad de moneda

    // Calcular el total final
    var totalFinal = total - descuentoAplicado - descuentoPuntos;
    if (totalFinal < 0) totalFinal = 0; // Evitar que el total sea negativo

    // Mostrar el total actualizado
    document.getElementsByClassName('carrito-precio-total')[0].innerText = `$${totalFinal.toLocaleString('es')}`;
}

function pagarClicked() {
    alert(`Gracias por tu compra. Usaste ${document.getElementById('puntos-lealtad').value} puntos de lealtad.`);
    var carritoItems = document.getElementsByClassName('carrito-items')[0];
    while (carritoItems.hasChildNodes()) {
        carritoItems.removeChild(carritoItems.firstChild);
    }
    actualizarTotalCarrito();
    ocultarCarrito();
}

function ocultarCarrito() {
    var carrito = document.getElementsByClassName('carrito')[0];
    if (carrito.getElementsByClassName('carrito-items')[0].children.length === 0) {
        carrito.style.marginRight = '-300px'; // Ajusta el valor según necesites
        carrito.style.opacity = '0';
        carritoVisible = false;
    }
}
