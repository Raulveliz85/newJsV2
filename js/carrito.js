let cartContainer = document.getElementById("cart-section");

let cartStorage = JSON.parse(localStorage.getItem("cartPrincipal")) || [];


function guardarCarrito() {
  localStorage.setItem("cartPrincipal", JSON.stringify(cartStorage));
}

function renderCarrito() {
  cartContainer.innerHTML = "";

  if (cartStorage.length === 0) {
    cartContainer.innerHTML = "<p>El carrito está vacío</p>";
    return;
  }

  cartStorage.forEach((producto, index) => {
    let subtotal = producto.precio * producto.cantidad;

    let card = document.createElement("div");
    card.innerHTML = `
      <h3>${producto.nombre}</h3>
      <p>Precio: $${producto.precio}</p>
      <p>Cantidad: ${producto.cantidad}</p>
      <p>Subtotal: $${subtotal}</p>

      <button class="btn-mas" data-index="${index}">+</button>
      <button class="btn-menos" data-index="${index}">-</button>
      <button class="btn-eliminar" data-index="${index}">Eliminar</button>
    `;

    cartContainer.appendChild(card);
  });

  agregarEventos();
}

//  + - y eliminar
function agregarEventos() {
  document.querySelectorAll(".btn-mas").forEach(btn => {
    btn.addEventListener("click", (e) => {
      let index = e.target.dataset.index;
      cartStorage[index].cantidad++;
      guardarCarrito();
      renderCarrito();
    });
  });

  document.querySelectorAll(".btn-menos").forEach(btn => {
    btn.addEventListener("click", (e) => {
      let index = e.target.dataset.index;

      if (cartStorage[index].cantidad > 1) {
        cartStorage[index].cantidad--;
      } else {
        cartStorage.splice(index, 1);
      }

      guardarCarrito();
      renderCarrito();
    });
  });

  document.querySelectorAll(".btn-eliminar").forEach(btn => {
    btn.addEventListener("click", (e) => {
      let index = e.target.dataset.index;
      cartStorage.splice(index, 1);
      guardarCarrito();
      renderCarrito();
    });
  });
}

// Vaciar carrito
document.getElementById("vaciar-carrito")?.addEventListener("click", () => {
  cartStorage = [];
  guardarCarrito();
  renderCarrito();
});

// Formulario de compra
function mostrarFormulario() {
  if (cartStorage.length === 0) {
    document.getElementById("realizar-compra")?.addEventListener("click", () => {
        window.location.href = "../pages/carrito.html";
        return;
    });
    
  }

  cartContainer.innerHTML = `
    <h2>Datos del pedido</h2>
    <form id="form-pedido">
      <label>Nombre</label>
      <input id="nombre" type="text" />

      <label>Dirección</label>
      <input id="direccion" type="text" />

      <label>Teléfono</label>
      <input id="telefono" type="text" />

      <button type="submit">Confirmar pedido</button>
    </form>
  `;

  let form = document.getElementById("form-pedido");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let nombre = document.getElementById("nombre").value.trim();
    let direccion = document.getElementById("direccion").value.trim();
    let telefono = document.getElementById("telefono").value.trim();

    
    if (nombre.length < 3) {
      alert("Ingresá un nombre válido.");
      return;
    }

    if (direccion.length < 5) {
      alert("Ingresá una dirección válida.");
      return;
    }

    if (telefono.length < 6 || isNaN(telefono)) {
      alert("Ingresá un teléfono válido.");
      return;
    }

 
    let pedidoFinal = [...cartStorage];

    let total = pedidoFinal.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

    // Vacio el carrito
    cartStorage = [];
    guardarCarrito();

    // Ticket
    cartContainer.innerHTML = `
      <h2>¡Gracias por tu compra!</h2>
      <p><strong>Cliente:</strong> ${nombre}</p>
      <p><strong>Dirección:</strong> ${direccion}</p>
      <p><strong>Teléfono:</strong> ${telefono}</p>
      <h3>Detalle:</h3>
    `;

    pedidoFinal.forEach(item => {
      let detalle = document.createElement("div");
      detalle.innerHTML = `
        <p>${item.nombre} — Cant: ${item.cantidad} — $${item.precio * item.cantidad}</p>
      `;
      cartContainer.appendChild(detalle);
    });

    cartContainer.innerHTML += `<h2>Total: $${total}</h2>`;
  });
}

// Botón comprar
document.getElementById("realizar-compra")?.addEventListener("click", mostrarFormulario);


renderCarrito();
