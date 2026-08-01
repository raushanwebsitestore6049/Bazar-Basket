document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Store original text
            const originalText = this.innerHTML;

            // Change button text and style
            this.innerHTML = 'Added!';
            this.style.backgroundColor = 'var(--secondary-color)';

            // Revert back after 2 seconds
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.backgroundColor = ''; // Reverts to CSS color
            }, 2000);
        });
    });
});
