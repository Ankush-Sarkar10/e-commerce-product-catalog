// Wishlist functionality

class Wishlist {
    constructor() {
        this.wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
        this.initializeWishlist();
        this.setupWishlistNavigation();
    }

    initializeWishlist() {
        document.querySelectorAll('.card').forEach(card => {
            const buttons = card.querySelectorAll('.btn-secondary');
            buttons.forEach(button => {
                if (button.textContent.includes('Wishlist')) {
                    button.addEventListener('click', (e) => this.addToWishlist(e, card));
                    
                    // Check if product is already in wishlist and update style
                    const productTitle = card.querySelector('.card-title').textContent;
                    if (this.isInWishlist(productTitle)) {
                        button.classList.add('active');
                        button.style.backgroundColor = '#dc3545';
                        button.style.borderColor = '#dc3545';
                    }
                }
            });
        });
    }

    setupWishlistNavigation() {
        // Add click event to Wishlist navigation link
        const wishlistLink = document.querySelector('a[href*="Wishlist"]');
        if (wishlistLink) {
            wishlistLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.displayWishlistModal();
            });
        }
    }

    addToWishlist(event, productCard) {
        event.preventDefault();

        const productTitle = productCard.querySelector('.card-title').textContent;
        const productPrice = productCard.querySelector('.card-text').textContent;
        const productImage = productCard.querySelector('.card-img-top').src;
        const button = event.target;

        const product = {
            id: Date.now(),
            title: productTitle,
            price: productPrice,
            image: productImage,
            addedDate: new Date().toLocaleString()
        };

        // Check if product already exists in wishlist
        const existingProduct = this.wishlistItems.find(item => item.title === product.title);
        
        if (existingProduct) {
            this.removeFromWishlist(existingProduct.id);
            this.showNotification(`${productTitle} removed from wishlist`);
            button.classList.remove('active');
            button.style.backgroundColor = '';
            button.style.borderColor = '';
        } else {
            this.wishlistItems.push(product);
            this.saveWishlist();
            this.showNotification(`${productTitle} added to wishlist!`);
            button.classList.add('active');
            button.style.backgroundColor = '#dc3545';
            button.style.borderColor = '#dc3545';
        }

        console.log('Wishlist Items:', this.wishlistItems);
    }

    displayWishlistModal() {
        let modalHTML = `
            <div class="modal fade" id="wishlistModal" tabindex="-1" aria-labelledby="wishlistModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="wishlistModalLabel">My Wishlist (${this.wishlistItems.length} items)</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            ${this.wishlistItems.length > 0 ? this.generateWishlistHTML() : '<p class="text-center text-muted">Your wishlist is empty</p>'}
                        </div>
                        <div class="modal-footer">
                            ${this.wishlistItems.length > 0 ? '<button class="btn btn-danger" id="clearWishlistBtn">Clear Wishlist</button>' : ''}
                            ${this.wishlistItems.length > 0 ? '<button class="btn btn-warning" id="addAllToCartBtn">Add All to Cart</button>' : ''}
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('wishlistModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add new modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('wishlistModal'));
        modal.show();

        // Add event listeners to all remove buttons
        document.querySelectorAll('.remove-wishlist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                this.removeFromWishlist(productId);
                this.displayWishlistModal(); // Refresh modal
            });
        });

        // Add event listener to "Add All to Cart" button
        const addAllBtn = document.getElementById('addAllToCartBtn');
        if (addAllBtn) {
            addAllBtn.addEventListener('click', () => {
                this.addAllToCart();
                this.displayWishlistModal(); // Refresh to show cleared wishlist
            });
        }

        // Add event listener to "Clear Wishlist" button
        const clearBtn = document.getElementById('clearWishlistBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear your entire wishlist?')) {
                    this.clearWishlist();
                    this.displayWishlistModal();
                }
            });
        }
    }

    generateWishlistHTML() {
        return `
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.wishlistItems.map(item => `
                            <tr>
                                <td>
                                    <div style="display: flex; gap: 10px; align-items: center;">
                                        <img src="${item.image}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: cover;">
                                        <span>${item.title}</span>
                                    </div>
                                </td>
                                <td>${item.price}</td>
                                <td>
                                    <button class="btn btn-sm btn-danger remove-wishlist-btn" data-id="${item.id}">Remove</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    removeFromWishlist(productId) {
        this.wishlistItems = this.wishlistItems.filter(item => item.id !== productId);
        this.saveWishlist();
    }

    saveWishlist() {
        localStorage.setItem('wishlistItems', JSON.stringify(this.wishlistItems));
    }

    getWishlistCount() {
        return this.wishlistItems.length;
    }

    isInWishlist(productTitle) {
        return this.wishlistItems.some(item => item.title === productTitle);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'alert alert-info alert-dismissible fade show';
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

    getWishlistItems() {
        return this.wishlistItems;
    }

    clearWishlist() {
        this.wishlistItems = [];
        this.saveWishlist();
        this.showNotification('Wishlist cleared');
    }

    displayWishlist() {
        console.log('=== WISHLIST ===');
        console.log('Total Items:', this.getWishlistCount());
        console.log('Wishlist Items:', this.wishlistItems);
    }

    // Add all wishlist items to cart
    addAllToCart() {
        if (window.cart) {
            this.wishlistItems.forEach(item => {
                window.cart.cartItems.push({
                    id: Date.now() + Math.random(),
                    title: item.title,
                    price: item.price,
                    image: item.image,
                    quantity: 1
                });
            });
            window.cart.saveCart();
            this.showNotification('All wishlist items added to cart!');
        }
    }
}

// Initialize wishlist on page load
document.addEventListener('DOMContentLoaded', () => {
    window.wishlist = new Wishlist();
});
