// Filter functionality for products

class ProductFilter {
    constructor() {
        this.minRange = document.getElementById('minRange');
        this.maxRange = document.getElementById('maxRange');
        this.minValue = document.getElementById('minValue');
        this.maxValue = document.getElementById('maxValue');
        this.ratingRange = document.getElementById('maxrate');
        this.ratingValue = document.getElementById('ratingValue');
        this.categoryCheckboxes = document.querySelectorAll('.form-check-input');
        this.productsContainer = document.querySelector('.row.g-4');
        
        this.initializeFilters();
    }

    initializeFilters() {
        // Price range sliders
        if (this.minRange) {
            this.minRange.addEventListener('input', (e) => this.updateMinPrice(e));
        }
        if (this.maxRange) {
            this.maxRange.addEventListener('input', (e) => this.updateMaxPrice(e));
        }

        // Rating slider
        if (this.ratingRange) {
            this.ratingRange.addEventListener('input', (e) => this.updateRating(e));
        }

        // Category checkboxes
        this.categoryCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.applyFilters());
        });

        // Apply initial filters so products are shown correctly on page load
        this.applyFilters();
    }

    updateMinPrice(event) {
        const value = parseInt(event.target.value);
        const maxVal = parseInt(this.maxRange.value);
        
        if (value >= maxVal) {
            event.target.value = maxVal - 1;
        }
        
        this.minValue.textContent = event.target.value;
        this.applyFilters();
    }

    updateMaxPrice(event) {
        const value = parseInt(event.target.value);
        const minVal = parseInt(this.minRange.value);
        
        if (value <= minVal) {
            event.target.value = minVal + 1;
        }
        
        this.maxValue.textContent = event.target.value;
        this.applyFilters();
    }

    updateRating(event) {
        const value = parseFloat(event.target.value).toFixed(1);
        if (this.ratingValue) {
            this.ratingValue.textContent = value;
        }
        // Ensure the input value is also updated for filter comparison
        this.ratingRange.value = parseFloat(value);
        this.applyFilters();
    }

    applyFilters() {
        const minPrice = parseInt(this.minRange.value);
        const maxPrice = parseInt(this.maxRange.value);
        const minRating = parseFloat(this.ratingRange.value);
        const selectedCategories = this.getSelectedCategories();

        console.log('Filters Applied:', {
            minPrice: minPrice,
            maxPrice: maxPrice,
            minRating: minRating,
            categories: selectedCategories
        });

        // Update DOM - hide/show products based on filter
        this.updateProductDisplay(minPrice, maxPrice, minRating, selectedCategories);

        // Trigger product filtering
        if (window.productManager) {
            const filtered = window.productManager.filterProducts(minPrice, maxPrice, selectedCategories, minRating);
            console.log('Filtered products count:', filtered.length, filtered);
        }
    }

    updateProductDisplay(minPrice, maxPrice, minRating, selectedCategories) {
        const productCards = document.querySelectorAll('.row.g-4 > div');
        let visibleCount = 0;
        
        productCards.forEach(card => {
            const title = card.querySelector('.card-title').textContent;
            const priceText = card.querySelector('.card-text').textContent;
            const ratingText = card.querySelector('.rating-value') ? card.querySelector('.rating-value').textContent : '5';
            const price = parseInt(priceText.replace('Rs. ', ''));
            const rating = parseFloat(ratingText);
            
            // Get category from title or product data
            let category = 'Electronics'; // default
            
            // Try to get from product manager first
            if (window.productManager) {
                const product = window.productManager.products.find(p => p.title === title);
                if (product) {
                    category = product.category;
                }
            } else {
                // Fallback to title-based detection
                if (title.includes('Jean') || title.includes('Fashion')) category = 'Fashion';
                if (title.includes('Football') || title.includes('Sports')) category = 'Sports';
                if (title.includes('Book')) category = 'Books';
            }
            
            const priceMatch = price >= minPrice && price <= maxPrice;
            // If categories are selected, product must be in one of them. If no categories selected, show all
            const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(category);
            const ratingMatch = rating >= minRating;
            
            console.log(`Product: ${title} | Price: ${price} (${priceMatch}) | Rating: ${rating} >= ${minRating} (${ratingMatch}) | Category: ${category} (${categoryMatch})`);
            
            if (priceMatch && categoryMatch && ratingMatch) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        console.log(`Total visible products: ${visibleCount}`);
        // Show or hide "no items" message
        this.toggleNoItemsMessage(visibleCount);
    }

    toggleNoItemsMessage(visibleCount) {
        let noItemsMsg = document.getElementById('noItemsMessage');
        
        if (visibleCount === 0) {
            if (!noItemsMsg) {
                noItemsMsg = document.createElement('div');
                noItemsMsg.id = 'noItemsMessage';
                noItemsMsg.className = 'alert alert-warning text-center mt-4';
                noItemsMsg.innerHTML = '<h5>Oops! No items like these can be found</h5><p>Try adjusting your filters</p>';
                this.productsContainer.parentElement.insertBefore(noItemsMsg, this.productsContainer.nextSibling);
            }
        } else {
            if (noItemsMsg) {
                noItemsMsg.remove();
            }
        }
    }

    getSelectedCategories() {
        const categories = [];
        document.querySelectorAll('.form-check-input:checked').forEach(checkbox => {
            const label = checkbox.nextElementSibling;
            if (label && label.classList.contains('form-check-label')) {
                const catText = label.textContent.trim();
                if (catText) {
                    categories.push(catText);
                    console.log('Category Found:', catText);
                }
            }
        });
        console.log('All Selected Categories:', categories);
        return categories;
    }

    resetFilters() {
        this.minRange.value = 0;
        this.maxRange.value = 20000;
        this.minValue.textContent = '0';
        this.maxValue.textContent = '20000';
        this.ratingRange.value = 0;
        if (this.ratingValue) this.ratingValue.textContent = '0.0';
        
        document.querySelectorAll('.form-check-input').forEach(checkbox => {
            checkbox.checked = false;
        });

        this.applyFilters();
    }
}

// Initialize filters on page load
document.addEventListener('DOMContentLoaded', () => {
    window.filterManager = new ProductFilter();
});
