let cart = [];
let token = '';

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const res = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (res.ok) {
        const data = await res.json();
        token = data.token;
        document.getElementById('login').style.display = 'none';
        document.getElementById('products').style.display = 'block';
        loadProducts();
    } else {
        alert('Login fallido');
    }
}

async function register() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const email = document.getElementById('reg-email').value;

    const res = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, email })
    });

    if (res.ok) {
        alert('Registro exitoso');
    } else {
        alert('Registro fallido');
    }
}

async function loadProducts() {
    const res = await fetch('/products');
    const products = await res.json();

    const productsList = document.getElementById('products-list');
    productsList.innerHTML = '';

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>$${product.price}</p>
            <button onclick="addToCart('${product._id}')">Añadir al carrito</button>
        `;
        productsList.appendChild(productDiv);
    });
}

async function addToCart(productId) {
    const res = await fetch('/add-to-cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ productId, quantity: 1 })
    });

    if (res.ok) {
        alert('Producto añadido al carrito');
    } else {
        alert('Error al añadir el producto');
    }
}

async function checkout() {
    const res = await fetch('/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ items: cart })
    });

    if (res.ok) {
        alert('Pedido procesado');
    } else {
        alert('Error al procesar el pedido');
    }
}

