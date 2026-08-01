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

    // --- OTP Auto-Focus Functionality ---
    const otpInputs = document.querySelectorAll('.otp-group input');

    if (otpInputs.length > 0) {
        otpInputs.forEach((input, index) => {
            input.addEventListener('input', () => {
                // If a character is entered and there's a next input, focus it
                if (input.value.length === 1 && index + 1 < otpInputs.length) {
                    otpInputs[index + 1].focus();
                }
            });

            input.addEventListener('keydown', (e) => {
                // If backspace is pressed on an empty input, focus the previous one
                if (e.key === 'Backspace' && input.value.length === 0 && index > 0) {
                    otpInputs[index - 1].focus();
                }
            });
        });

        // Optional: Focus the first input on page load
        otpInputs[0].focus();
    }
});
