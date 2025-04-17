// Wait for the HTML document to be fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // --- Selectors ---
    // Select all elements with the class 'drum-button'
    const buttons = document.querySelectorAll('.drum-button');

    // --- Main Function to Play Sound and Add Feedback ---
    function playSound(soundId, buttonElement) {
        // Construct the selector for the audio element based on the soundId
        const audioElement = document.getElementById(soundId);

        // Check if the corresponding audio element exists
        if (!audioElement) {
            console.warn(`Audio element with ID '${soundId}' not found.`);
            return; // Exit if no audio element
        }

        // Rewind the audio to the start
        audioElement.currentTime = 0;

        // Play the audio
        audioElement.play()
            .catch(error => {
                // Catch and log potential playback errors
                console.error(`Error playing sound '${soundId}':`, error);
            });

        // --- Visual Feedback ---
        // Check if a button element was provided for feedback
        if (buttonElement) {
            buttonElement.classList.add('playing'); // Add the 'playing' class

            // Remove the 'playing' class after a short delay (matches CSS transition)
            // Using 'transitionend' event is more robust than setTimeout if transition duration changes
            buttonElement.addEventListener('transitionend', function removeTransition(e) {
                // Ensure we only react to the transform transition ending
                if (e.propertyName !== 'transform') return;
                this.classList.remove('playing');
                // Remove the event listener to prevent it from firing multiple times
                this.removeEventListener('transitionend', removeTransition);
            }, { once: true }); // {once: true} is an alternative way to auto-remove listener
        }
    }

    // --- Event Listener for Button Clicks ---
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Get the sound identifier (e.g., 'kick') from the button's data-sound attribute
            const soundId = button.dataset.sound;
            // Call playSound, passing the soundId and the button itself for feedback
            playSound(soundId, button);
        });
    });

    // --- Event Listener for Keyboard Presses ---
    window.addEventListener('keydown', (event) => {
        // Convert the pressed key to lowercase for case-insensitive matching
        const key = event.key.toLowerCase();

        // Find the button element that corresponds to the pressed key
        // using the 'data-key' attribute
        const buttonElement = document.querySelector(`.drum-button[data-key='${key}']`);

        // If a matching button is found
        if (buttonElement) {
            // Get the sound identifier from the button's data-sound attribute
            const soundId = buttonElement.dataset.sound;
            // Call playSound, passing the soundId and the found button for feedback
            playSound(soundId, buttonElement);
        }
        // Optional: Prevent default action if the key corresponds to a drum sound
        // E.g., prevent scrolling if 'space' was used for a sound.
        // if (buttonElement) {
        //     event.preventDefault();
        // }
    });

    // --- Initial Check ---
    if (buttons.length === 0) {
        console.warn("No drum buttons found on the page.");
    }

}); // End of DOMContentLoaded listener