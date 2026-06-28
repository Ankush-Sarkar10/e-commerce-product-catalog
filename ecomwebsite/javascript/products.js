// Product management and display

class ProductManager {
    constructor() {
        this.products = [
            {
                id: 1,
                title: 'JBL Tune 520BT Wireless On Ear Headphones',
                price: 9199,
                category: 'Electronics',
                rating: 4.5,
                image: 'headphone.jpg'
            },
            {
                id: 2,
                title: 'boAt Ultima Aeris 1.43" AMOLED Smartwatch',
                price: 18399,
                category: 'Electronics',
                rating: 4.7,
                image: 'smartwatch.webp'
            },
            {
                id: 3,
                title: 'Urbano Fashion Men Jeans',
                price: 1499,
                category: 'Fashion',
                rating: 4.2,
                image: 'jeans.jpg'
            },
            {
                id: 4,
                title: 'KIPSTA Men\'s Viralto I MG AG Football Shoes',
                price: 2499,
                category: 'Sports',
                rating: 4.6,
                image: 'bootssports.avif'
            }
        ];

        this.filteredProducts = [...this.products];
        this.currentSort = 'default';
        this.initializeProducts();
    }

    initializeProducts() {
        this.setupSortDropdown();
    }

    setupSortDropdown() {
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.sortProducts(item.textContent.trim());
            });
        });
    }

    sortProducts(sortType) {
        let sorted = [...this.filteredProducts];

        switch(sortType) {
            case 'Price Low-High':
                sorted.sort((a, b) => a.price - b.price);
                this.currentSort = 'price-low';
                break;
            case 'Price High-Low':
                sorted.sort((a, b) => b.price - a.price);
                this.currentSort = 'price-high';
                break;
            case 'Highest Rated':
                sorted.sort((a, b) => b.rating - a.rating);
                this.currentSort = 'rating';
                break;
            case 'Newest':
                sorted.reverse();
                this.currentSort = 'newest';
                break;
            default:
                this.currentSort = 'default';
        }

        this.filteredProducts = sorted;
        this.renderSortedProducts();
        console.log(`Products sorted by: ${sortType}`);
        console.log('Sorted Products:', this.filteredProducts);
    }

    renderSortedProducts() {
        const container = document.querySelector('.row.g-4');
        if (!container) return;

        const cardMap = new Map();
        container.querySelectorAll(':scope > div').forEach(card => {
            const title = card.querySelector('.card-title')?.textContent.trim();
            if (title) {
                if (!cardMap.has(title)) {
                    cardMap.set(title, []);
                }
                cardMap.get(title).push(card);
            }
        });

        this.filteredProducts.forEach(product => {
            const cards = cardMap.get(product.title);
            if (cards && cards.length > 0) {
                const card = cards.shift();
                container.appendChild(card);
            }
        });
    }

    filterProducts(minPrice, maxPrice, categories, minRating = 0) {
        this.filteredProducts = this.products.filter(product => {
            const priceMatch = product.price >= minPrice && product.price <= maxPrice;
            const categoryMatch = categories.length === 0 || categories.includes(product.category);
            const ratingMatch = product.rating >= minRating;
            return priceMatch && categoryMatch && ratingMatch;
        });

        console.log('Filtered Products:', this.filteredProducts);
        return this.filteredProducts;
    }

    getProductById(productId) {
        return this.products.find(product => product.id === productId);
    }

    getProductsByCategory(category) {
        return this.products.filter(product => product.category === category);
    }

    getAllProducts() {
        return this.products;
    }

    getFilteredProducts() {
        return this.filteredProducts;
    }

    searchProducts(searchTerm) {
        const term = searchTerm.toLowerCase();
        return this.filteredProducts.filter(product =>
            product.title.toLowerCase().includes(term) ||
            product.category.toLowerCase().includes(term)
        );
    }

    getPriceRange() {
        const prices = this.products.map(p => p.price);
        return {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };
    }

    getCategories() {
        const categories = new Set(this.products.map(p => p.category));
        return Array.from(categories);
    }

    displayProducts() {
        console.log('=== ALL PRODUCTS ===');
        console.log('Total Products:', this.products.length);
        console.log('Products:', this.products);
        console.log('');
        console.log('Price Range:', this.getPriceRange());
        console.log('Categories:', this.getCategories());
    }

    getProductStats() {
        return {
            totalProducts: this.products.length,
            categories: this.getCategories(),
            priceRange: this.getPriceRange(),
            averagePrice: (this.products.reduce((sum, p) => sum + p.price, 0) / this.products.length).toFixed(2),
            averageRating: (this.products.reduce((sum, p) => sum + p.rating, 0) / this.products.length).toFixed(1)
        };
    }
}

// Initialize product manager on page load
document.addEventListener('DOMContentLoaded', () => {
    window.productManager = new ProductManager();
});
