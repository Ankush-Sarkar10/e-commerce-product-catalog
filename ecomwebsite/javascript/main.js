// Main application controller

class EcomApp {
    constructor() {
        this.initializeApp();
        this.setupEventListeners();
        this.setupNavigation();
    }

    initializeApp() {
        console.log('=== E-Commerce Application Started ===');
        
        // Wait for all components to load
        this.ensureComponentsLoaded();
    }

    ensureComponentsLoaded() {
        // Check if all required components are initialized
        const componentsReady = setInterval(() => {
            if (window.cart && window.wishlist && window.productManager && window.filterManager) {
                clearInterval(componentsReady);
                this.onAllComponentsReady();
            }
        }, 100);

        // Timeout after 5 seconds
        setTimeout(() => {
            clearInterval(componentsReady);
            console.warn('Some components did not load within timeout');
        }, 5000);
    }

    onAllComponentsReady() {
        console.log('✓ All components loaded successfully');
        console.log('✓ Cart Manager ready');
        console.log('✓ Wishlist Manager ready');
        console.log('✓ Product Manager ready');
        console.log('✓ Filter Manager ready');
        
        this.displayAppInfo();
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-link');
        navItems.forEach(item => {
            const text = item.textContent.trim();
            
            if (text === 'Home') {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Navigating to Home');
                    alert('Welcome to Home! Scroll down to see our products.');
                });
            } else if (text === 'Logo') {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Clicked Logo');
                    window.scrollTo({top: 0, behavior: 'smooth'});
                });
            } else if (text === 'Search Product') {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Opening Search');
                    this.openSearchModal();
                });
            } else if (text === 'Wishlist') {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (window.wishlist) {
                        window.wishlist.displayWishlistModal();
                    }
                });
            } else if (text === 'Cart') {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (window.cart) {
                        this.displayCartModal();
                    }
                });
            } else if (text === 'About Us') {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    alert('About Us: We are an e-commerce platform dedicated to providing quality products at great prices!');
                });
            } else if (text === 'Terms & Conditions') {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    alert('Terms & Conditions: By using our platform, you agree to our policies.');
                });
            } else if (text === 'Contact') {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    alert('Contact Us:\nEmail: support@ecomwebsite.com\nPhone: 1-800-ECOM-123');
                });
            } else if (text === 'Privacy Policy') {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    alert('Privacy Policy: We respect your privacy and protect your personal data.');
                });
            }
        });
    }

    openSearchModal() {
        let searchHTML = `
            <div class="modal fade" id="searchModal" tabindex="-1" aria-labelledby="searchModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="searchModalLabel">Search Products</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <input type="text" id="searchInput" class="form-control" placeholder="Search for products...">
                            <div id="searchResults" class="mt-3"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const existingModal = document.getElementById('searchModal');
        if (existingModal) existingModal.remove();

        document.body.insertAdjacentHTML('beforeend', searchHTML);
        const modal = new bootstrap.Modal(document.getElementById('searchModal'));
        modal.show();

        document.getElementById('searchInput').addEventListener('input', (e) => {
            const results = window.productManager.searchProducts(e.target.value);
            const resultsDiv = document.getElementById('searchResults');
            
            if (results.length > 0) {
                resultsDiv.innerHTML = results.map(p => `
                    <div class="alert alert-light p-2">
                        <strong>${p.title}</strong><br>
                        Price: Rs. ${p.price} | Rating: ⭐ ${p.rating}/5
                    </div>
                `).join('');
            } else if (e.target.value.trim() !== '') {
                resultsDiv.innerHTML = '<p class="text-muted">No products found</p>';
            } else {
                resultsDiv.innerHTML = '';
            }
        });
    }

    displayCartModal() {
        let cartHTML = `
            <div class="modal fade" id="cartModal" tabindex="-1" aria-labelledby="cartModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="cartModalLabel">Shopping Cart (${window.cart.getCartCount()} items)</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            ${window.cart.cartItems.length > 0 ? this.generateCartHTML() : '<p class="text-center text-muted">Your cart is empty</p>'}
                        </div>
                        <div class="modal-footer">
                            ${window.cart.cartItems.length > 0 ? `<strong>Total: Rs. ${window.cart.getCartTotal().toFixed(2)}</strong>` : ''}
                            ${window.cart.cartItems.length > 0 ? '<button class="btn btn-danger" id="clearCartBtn">Clear Cart</button>' : ''}
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            ${window.cart.cartItems.length > 0 ? '<button class="btn btn-success">Proceed to Checkout</button>' : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;

        const existingModal = document.getElementById('cartModal');
        if (existingModal) existingModal.remove();

        document.body.insertAdjacentHTML('beforeend', cartHTML);
        const modal = new bootstrap.Modal(document.getElementById('cartModal'));
        modal.show();

        // Add event listeners to all remove buttons
        document.querySelectorAll('.remove-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'), 10);
                window.cart.removeFromCart(productId);
                this.displayCartModal(); // Refresh modal
            });
        });

        // Add event listener to "Clear Cart" button
        const clearBtn = document.getElementById('clearCartBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear your entire cart?')) {
                    window.cart.clearCart();
                    this.displayCartModal();
                }
            });
        }
    }

    generateCartHTML() {
        return `
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Qty</th>
                            <th>Total</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${window.cart.cartItems.map(item => `
                            <tr>
                                <td>${item.title}</td>
                                <td>${item.price}</td>
                                <td>${item.quantity}</td>
                                <td>Rs. ${(parseFloat(item.price.replace('Rs. ', '')) * item.quantity).toFixed(2)}</td>
                                <td>
                                    <button class="btn btn-sm btn-danger remove-cart-btn" data-id="${item.id}">Remove</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.querySelector('input[placeholder*="Search"]');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }
    }

    handleSearch(searchTerm) {
        if (window.productManager) {
            if (searchTerm.trim() === '') {
                console.log('Search cleared');
            } else {
                const results = window.productManager.searchProducts(searchTerm);
                console.log(`Search results for "${searchTerm}":`, results);
            }
        }
    }

    displayAppInfo() {
        if (window.productManager) {
            const stats = window.productManager.getProductStats();
            console.log('');
            console.log('=== APPLICATION STATS ===');
            console.log('Total Products:', stats.totalProducts);
            console.log('Average Price: Rs.', stats.averagePrice);
            console.log('Average Rating:', stats.averageRating, '/ 5');
            console.log('Categories:', stats.categories.join(', '));
            console.log('Price Range: Rs.', stats.priceRange.min, '-', stats.priceRange.max);
            console.log('');
        }
    }

    // Utility method to get app state
    getAppState() {
        return {
            cart: {
                items: window.cart ? window.cart.cartItems : [],
                total: window.cart ? window.cart.getCartTotal() : 0,
                count: window.cart ? window.cart.getCartCount() : 0
            },
            wishlist: {
                items: window.wishlist ? window.wishlist.getWishlistItems() : [],
                count: window.wishlist ? window.wishlist.getWishlistCount() : 0
            },
            products: {
                total: window.productManager ? window.productManager.getAllProducts().length : 0,
                filtered: window.productManager ? window.productManager.getFilteredProducts().length : 0
            }
        };
    }

    // Utility method to display app state
    displayAppState() {
        const state = this.getAppState();
        console.log('=== CURRENT APP STATE ===');
        console.log(JSON.stringify(state, null, 2));
    }

    // Debugging helper
    runDiagnostics() {
        console.log('');
        console.log('=== RUNNING DIAGNOSTICS ===');
        
        console.log('Cart Items:', window.cart?.cartItems.length || 0);
        console.log('Wishlist Items:', window.wishlist?.wishlistItems.length || 0);
        console.log('Total Products:', window.productManager?.products.length || 0);
        
        if (window.cart) {
            console.log('Cart Total: Rs.', window.cart.getCartTotal().toFixed(2));
        }
        
        if (window.productManager) {
            const stats = window.productManager.getProductStats();
            console.log('Product Stats:', stats);
        }
        
        console.log('');
        console.log('Diagnostics complete!');
    }
}

// Initialize the app when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    window.ecomApp = new EcomApp();
});

// Log when page is fully loaded
window.addEventListener('load', () => {
    console.log('✓ Page fully loaded and ready');
});
