const URL = "./db/data.json"; 
const principalContainer = document.getElementById("principal-container");

let cartPrincipal = JSON.parse(localStorage.getItem("cartPrincipal")) || [];

function guardarCarrito() {
  localStorage.setItem("cartPrincipal", JSON.stringify(cartPrincipal));
}

async function obtenerProductos() {
  try {
    const response = await fetch(URL);
    const data = await response.json();

    renderizarProductos(data);

  } catch (error) {
    alert("No se pudieron cargar los productos.");
  }
}

function renderizarProductos(productos) {
  principalContainer.innerHTML = "";

  productos.forEach(producto => {
    const card = document.createElement("div");

    card.innerHTML = `
      <h3>${producto.nombre}</h3>
      <p>$${producto.precio}</p>
      <button class="btn-agregar" data-id="${producto.id}">Agregar</button>
    `;

    principalContainer.appendChild(card);
  });

  agregarEventos(productos);
}


function agregarEventos(productos) {
  const botones = document.querySelectorAll(".btn-agregar");

  botones.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;

      const producto = productos.find(p => p.id == id);

      if (producto) {
      
        let itemEnCarrito = cartPrincipal.find(p => p.id == producto.id);

        if (itemEnCarrito) {
         
          itemEnCarrito.cantidad++;
        } else {
   
          cartPrincipal.push({
            ...producto,
            cantidad: 1
          });
        }

        guardarCarrito();
       // alert("Producto agregado al carrito.");
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Producto agregado",
          showConfirmButton: false,
          timer:1000
        });
      }
    });
  });
}


obtenerProductos();
