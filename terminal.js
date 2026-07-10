document.addEventListener('DOMContentLoaded', () => {
    const outputElement = document.getElementById('output');
    const interactiveArea = document.getElementById('interactive-area');
    const successArea = document.getElementById('success-area');
    const form = document.getElementById('architect-form');
    const btnSubmit = document.getElementById('btn-submit');

    // Terminal Boot Sequence Text
    const lines = [
        "Initializing connection...",
        "Establishing secure link to Architect Directory...",
        "[OK]",
        "Verifying credentials bypass...",
        "[OK]",
        "",
        "Welcome, Operative.",
        "Please enter your designation and verify your quest completion to proceed."
    ];

    let currentLine = 0;
    let currentChar = 0;
    let isTyping = true;

    // Typing effect function
    function typeWriter() {
        if (currentLine < lines.length) {
            if (currentChar < lines[currentLine].length) {
                // Type next character
                outputElement.innerHTML += lines[currentLine].charAt(currentChar);
                currentChar++;
                setTimeout(typeWriter, Math.random() * 50 + 20); // Random typing speed
            } else {
                // End of line
                outputElement.innerHTML += '<br>';
                currentLine++;
                currentChar = 0;
                setTimeout(typeWriter, 400); // Pause between lines
            }
        } else {
            // Finished typing
            isTyping = false;
            interactiveArea.classList.remove('hidden');
            document.getElementById('operative').focus();
        }
    }

    // Start boot sequence
    setTimeout(typeWriter, 500);

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const action = form.getAttribute('action');
        
        btnSubmit.innerText = '[ INITIATING TRANSFER... ]';
        btnSubmit.disabled = true;

        // If formspree is not set up, simulate it
        if (action.includes('YOUR_FORM_ID_HERE')) {
            console.log('Terminal Formspree ID not set. Simulating transfer.');
            setTimeout(() => {
                interactiveArea.classList.add('hidden');
                
                // Generate certificate link
                const operativeName = document.getElementById('operative').value || 'Operative';
                document.getElementById('certificate-container').innerHTML = `<a href="certificate.html?operative=${encodeURIComponent(operativeName)}" target="_blank" class="btn-terminal" style="text-decoration:none; display:inline-block;">[ VIEW OFFICIAL CERTIFICATE ]</a>`;
                
                successArea.classList.remove('hidden');
            }, 1500);
            return;
        }

        try {
            // We use fetch with FormData so file uploads work seamlessly
            const response = await fetch(action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                console.log('Data successfully secured.');
                interactiveArea.classList.add('hidden');
                
                // Generate certificate link
                const operativeName = document.getElementById('operative').value || 'Operative';
                document.getElementById('certificate-container').innerHTML = `<a href="certificate.html?operative=${encodeURIComponent(operativeName)}" target="_blank" class="btn-terminal" style="text-decoration:none; display:inline-block;">[ VIEW OFFICIAL CERTIFICATE ]</a>`;
                
                successArea.classList.remove('hidden');
            } else {
                btnSubmit.innerText = '[ ERROR: CONNECTION LOST. RETRY? ]';
                btnSubmit.disabled = false;
            }
        } catch (error) {
            console.error('Error during transfer:', error);
            btnSubmit.innerText = '[ FATAL ERROR. RETRY? ]';
            btnSubmit.disabled = false;
        }
    });
});
