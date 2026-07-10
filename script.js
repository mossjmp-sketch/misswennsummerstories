document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reader-form');
    const btnSkip = document.getElementById('btn-skip');
    const formSection = document.getElementById('form-section');
    const downloadSection = document.getElementById('download-section');

    // Function to transition from form to downloads
    const showDownloads = () => {
        // Fade out form
        formSection.style.opacity = '0';
        formSection.style.transform = 'translateY(-10px)';
        formSection.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            formSection.classList.remove('active');
            formSection.classList.add('hidden');
            
            downloadSection.classList.remove('hidden');
            downloadSection.classList.add('active');
        }, 300);
    };

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Retrieve values
        const emailInput = document.getElementById('email').value;
        const formData = new FormData(form);
        const formValues = Object.fromEntries(formData.entries());
        
        // Form Validation: If they click submit, they should provide at least a valid email
        const errorDiv = document.getElementById('form-error');
        const errorSpan = errorDiv.querySelector('span');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailInput.trim() || !emailRegex.test(emailInput)) {
            if (!emailInput.trim()) {
                errorSpan.innerText = "Please provide an email to subscribe, or click 'Skip & Download' to proceed directly.";
            } else {
                errorSpan.innerText = "Please enter a valid email address.";
            }
            errorDiv.classList.remove('hidden');
            setTimeout(() => errorDiv.classList.add('visible'), 10);
            return;
        } else {
            errorDiv.classList.remove('visible');
            setTimeout(() => errorDiv.classList.add('hidden'), 300);
        }
        
        // Formspree submission logic
        const action = form.getAttribute('action');
        
        // Only attempt to send if the user has replaced the placeholder ID
        if (action.includes('YOUR_FORM_ID_HERE')) {
            console.log('Formspree ID not set. Simulating submission for:', formValues);
            showDownloads();
            return;
        }

        // Change button text to show loading
        const btnSubmit = document.getElementById('btn-submit');
        const originalText = btnSubmit.innerText;
        btnSubmit.innerText = 'Sending...';
        btnSubmit.disabled = true;

        try {
            const response = await fetch(action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                console.log('Form successfully submitted to Formspree');
                showDownloads();
            } else {
                console.error('Form submission failed');
                // Even on failure, show the downloads so readers aren't blocked
                showDownloads();
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showDownloads();
        } finally {
            btnSubmit.innerText = originalText;
            btnSubmit.disabled = false;
        }
    });

    // Handle skip button
    btnSkip.addEventListener('click', () => {
        console.log('User skipped form');
        // Show the download section without validating or submitting
        showDownloads();
    });
});
