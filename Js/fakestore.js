let productosDB = []; // Variable global para guardar los productos

// Función para mostrar el modal del carrito
function mostrarModalCarrito() {
    const modal = document.getElementById("modal-carrito");
    const listaCarrito = document.getElementById("lista-carrito");
    const totalCarrito = document.getElementById("total-carrito");
    const carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];

    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {
        listaCarrito.innerHTML = "<p>No hay productos en el carrito.</p>";
        totalCarrito.textContent = "Total: $0.000";
    } else {
        let totalPrecio = 0;
       
        carrito.forEach((id) => {
            const producto = productosDB.find(p => p.id === id);
            if (!producto) return;
           
            totalPrecio += producto.price;
           
            const item = document.createElement("div");
            item.className = "item-carrito";
            item.innerHTML = `
                <span><strong>${producto.title}</strong></span>
                <span>$${producto.price.toFixed(3)}</span>
            `;
            listaCarrito.appendChild(item);
        });
       
        totalCarrito.textContent = `Total: $${totalPrecio.toFixed(3)}`;
    }

    modal.style.display = "block";
}

function cerrarModal() {
    document.getElementById("modal-carrito").style.display = "none";
}

function manejarClicksModal(event) {
    const modal = document.getElementById("modal-carrito");
    if (event.target === modal || event.target.classList.contains("cerrar-modal")) {
        cerrarModal();
    }
}

function actualizarContadorCarrito() {
    const carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
    const contador = document.getElementById("contador-carrito");

    if (contador) {

contador.textContent = carrito.length > 9 ? "9+" : carrito.length;

if (carrito.length > 0) {
            contador.style.display = "flex";
        } else {
            contador.style.display = "none";
        }
    }
}

function agregarAlCarrito(idProducto) {
    let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
    carrito.push(idProducto);
    sessionStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
}

function vaciarCarrito() {
    sessionStorage.removeItem("carrito");
    actualizarContadorCarrito();
    cerrarModal();
}

function pagar() {
    const carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        return;
    }
const productosCompra = [];
    let totalCompra = 0;

    carrito.forEach(id => {
        const producto = productosDB.find(p => p.id === id);
        if (producto) {
            productosCompra.push({
                nombre: producto.title,
                precio: producto.price
            });
            totalCompra += producto.price;
        }
    });    

    sessionStorage.setItem('productos', JSON.stringify(productosCompra));
    sessionStorage.setItem('total', totalCompra.toFixed(3));

    // Redirigir a la página de compra
    window.location.href = 'compra.html';
}

document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("fakestore-container");

    fetch("https://fakestoreapi.com/products")
        .then((response) => {
            if (!response.ok) throw new Error("Error en la red");
            return response.json();
        })
        .then((data) => {
            productosDB = data;
            contenedor.innerHTML = "";

            data.forEach((producto) => {
                const item = document.createElement("div");
                item.className = "item_flex";

                item.innerHTML = `
                    <div class="card">
                        <img src="${producto.image}" alt="${producto.title}">
                        <div class="card-content">
                            <h3>${producto.title}</h3>
                            <p>Precio: $${producto.price}</p>
                        </div>
                        <button class="comprar-btn" onclick="agregarAlCarrito(${producto.id})">
                            Añadir al carrito
                        </button>
                    </div>
                `;

                contenedor.appendChild(item);
            });

            actualizarContadorCarrito();
        })
       
        .catch((error) => {
            console.error("Error al obtener productos:", error);
            contenedor.innerHTML = "<p>Hubo un problema al cargar los productos.</p>";
        });

    document.getElementById("icono-carrito")?.addEventListener("click", mostrarModalCarrito);
    document.getElementById("vaciar-carrito")?.addEventListener("click", vaciarCarrito);
    document.getElementById("pagar")?.addEventListener("click", pagar);
    window.addEventListener("click", manejarClicksModal);
});

