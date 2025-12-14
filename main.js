function addToCart(id, name, price, image) {
    let cart = JSON.parse(localStorage.getItem('myChickenCart')) || [];
    let existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        let imgUrl = image || 'https://via.placeholder.com/200?text=No+Image';
        cart.push({ id: id, name: name, price: price, image: imgUrl, quantity: 1 });
    }
    
    localStorage.setItem('myChickenCart', JSON.stringify(cart));
    alert(name + " added to cart!");
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('myChickenCart')) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('myChickenCart', JSON.stringify(cart));
    loadCartPage();
}

function loadCartPage() {
    let cartContainer = document.getElementById('cart-list-container');
    let totalElement = document.getElementById('grand-total');
    let totalSection = document.querySelector('.total-section');
    
    if (!cartContainer || !totalElement) return;

    let cart = JSON.parse(localStorage.getItem('myChickenCart')) || [];
    let total = 0;
    
    cartContainer.innerHTML = ''; 

    if(cart.length === 0) {
        cartContainer.innerHTML = '<p style="text-align:center; padding: 50px;">Your cart is empty. 🍗</p>';
        if(totalSection) totalSection.style.display = 'none';
    } else {
        if(totalSection) totalSection.style.display = 'block';
        
        cart.forEach(item => {
            let itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            let cardHTML = `
                <div class="cart-item-card reveal active"> 
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <div style="display: flex; justify-content: space-between;">
                            <h3>${item.name}</h3>
                            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                        </div>
                        <p>Price: $${item.price.toFixed(2)} | Qty: ${item.quantity}</p>
                        <p style="margin-top: 10px; font-weight:bold;">Subtotal: $${itemTotal.toFixed(2)}</p>
                    </div>
                </div>
            `;
            cartContainer.innerHTML += cardHTML;
        });
    }
    totalElement.innerText = '$' + total.toFixed(2);
    setupScrollAnimation();
}

function placeOrder() {
    let cart = JSON.parse(localStorage.getItem('myChickenCart')) || [];
    if(cart.length === 0) { alert("Cart is empty!"); return; }
    document.getElementById('order-modal').style.display = 'flex';
    localStorage.removeItem('myChickenCart');
}

function closeModal() {
    document.getElementById('order-modal').style.display = 'none';
    window.location.href = 'home.html';
}

document.addEventListener('DOMContentLoaded', () => {

    // --- FILTER LOGIC ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const foodItems = document.querySelectorAll('.food-card');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
    
                filterButtons.forEach(btn => btn.classList.remove('active'));
            
                button.classList.add('active');

                const category = button.getAttribute('data-filter');

                foodItems.forEach(item => {
                
                    item.classList.remove('active');
                    item.classList.remove('reveal');
                    
                    if (category === 'all' || item.classList.contains(category)) {
                        item.style.display = 'block';
                
                        setTimeout(() => {
                            item.classList.add('reveal');
                            item.classList.add('active');
                        }, 50);
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }


    const sortSelect = document.getElementById('sort-select');
    const menuContainer = document.getElementById('menu-container');

    if (sortSelect && menuContainer) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
        
            const cards = Array.from(menuContainer.getElementsByClassName('food-card'));

    
            cards.sort((a, b) => {
                const priceA = parseFloat(a.querySelector('.price').textContent.replace('$', ''));
                const priceB = parseFloat(b.querySelector('.price').textContent.replace('$', ''));
                const nameA = a.querySelector('h3').textContent.toLowerCase();
                const nameB = b.querySelector('h3').textContent.toLowerCase();

                if (sortValue === 'low-high') {
                    return priceA - priceB;
                } else if (sortValue === 'high-low') {
                    return priceB - priceA;
                } else if (sortValue === 'alpha') {
                    return nameA.localeCompare(nameB);
                } else {
                    return 0; 
                }
            });
            menuContainer.innerHTML = '';
            cards.forEach(card => {
                menuContainer.appendChild(card);

                card.classList.add('reveal');
                card.classList.add('active');
            });
        });
    }

    if (document.getElementById('cart-list-container')) {
        loadCartPage();
    }

    setupScrollAnimation();
});



function setupScrollAnimation() {
    const elementsToAnimate = document.querySelectorAll('.food-card, .promo-card, .mini-card, .hero-content, section h2, .loc-card, .cart-item-card');

    elementsToAnimate.forEach(el => {
        el.classList.add('reveal');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    elementsToAnimate.forEach(el => observer.observe(el));
}