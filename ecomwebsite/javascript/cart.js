// Shopping cart functionality

class ShoppingCart {
    constructor() {
        this.cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        this.initializeCart();
    }

    initializeCart() {
        // Setup quantity sliders
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('qty-slider')) {
                const qtyValue = e.target.closest('.card-body').querySelector('.qty-value');
                if (qtyValue) {
                    qtyValue.textContent = e.target.value;
                }
            }
        });

        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.textContent.includes('Add to Cart') && e.target.classList.contains('btn')) {
                this.addToCart(e);
            }
        });
    }

    addToCart(event) {
        event.preventDefault();

        // Find the product card
        const productCard = event.target.closest('.card');
        if (!productCard) return;

        const productTitle = productCard.querySelector('.card-title').textContent;
        const productPrice = productCard.querySelector('.card-text').textContent;
        const productImage = productCard.querySelector('.card-img-top').src;
        const quantity = parseInt(productCard.querySelector('.qty-slider').value);

        const product = {
            id: Date.now(),
            title: productTitle,
            price: productPrice,
            image: productImage,
            quantity: quantity
        };

        // Check if product already exists in cart
        const existingProduct = this.cartItems.find(item => item.title === product.title);
        
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            this.cartItems.push(product);
        }

        this.saveCart();
        this.showNotification(`${quantity} x ${productTitle} added to cart!`);
        console.log('Cart Items:', this.cartItems);
        
        // Reset quantity slider to 1
        productCard.querySelector('.qty-slider').value = 1;
        productCard.querySelector('.qty-value').textContent = '1';
    }

    removeFromCart(productId) {
        this.cartItems = this.cartItems.filter(item => item.id !== productId);
        this.saveCart();
        this.showNotification('Item removed from cart');
        console.log('Cart Items:', this.cartItems);
    }

    updateQuantity(productId, quantity) {
        const product = this.cartItems.find(item => item.id === productId);
        if (product) {
            product.quantity = quantity;
            if (product.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.saveCart();
            }
        }
    }

    saveCart() {
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    }

    getCartTotal() {
        return this.cartItems.reduce((total, item) => {
            const price = parseFloat(item.price.replace('Rs. ', ''));
            return total + (price * item.quantity);
        }, 0);
    }

    getCartCount() {
        return this.cartItems.reduce((count, item) => count + item.quantity, 0);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'alert alert-success alert-dismissible fade show';
        notification.setAttribute('role', 'alert');
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        document.body.insertBefore(notification, document.body.firstChild);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    clearCart() {
        this.cartItems = [];
        this.saveCart();
        this.showNotification('Cart cleared');
    }

    displayCart() {
        console.log('=== SHOPPING CART ===');
        console.log('Total Items:', this.getCartCount());
        console.log('Cart Total: Rs. ' + this.getCartTotal().toFixed(2));
        console.log('Cart Items:', this.cartItems);
    }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    window.cart = new ShoppingCart();
});
