document.addEventListener('DOMContentLoaded', function() {
    // Loading Screen Elements
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Show application content after loading is complete
    setTimeout(function() {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            // Remove from DOM after animation completes
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 800);
        }
    }, 3000); // Show loading screen for 3 seconds
    
    // Elements
    const slides = document.querySelectorAll('.question-slide');
    const backButton = document.getElementById('backBtn');
    const nextButton = document.getElementById('nextBtn');
    const progressBar = document.querySelector('.progress');
    const container = document.querySelector('.container');
    const floatingHearts = document.querySelector('.floating-hearts');
    const playButton = document.getElementById('playSong');
    const prevSongButton = document.getElementById('prevSong');
    const nextSongButton = document.getElementById('nextSong');
    const currentSongDisplay = document.getElementById('currentSong');
    const giftBox = document.getElementById('giftBox');
    const anniversaryLetter = document.getElementById('anniversaryLetter');
    const closeLetter = document.getElementById('closeLetter');
    const sendWhatsAppBtn = document.getElementById('sendWhatsAppBtn');
    
    // Create audio element
    const audioPlayer = new Audio();
    audioPlayer.volume = 0.5; // Set default volume to 50%
    
    // State
    let currentSlide = 1;
    const totalSlides = slides.length;
    let answers = {
        1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: ''
    };
    let isPlaying = false;
    let currentSongIndex = 0;

    // Hindi Romantic Songs Playlist
    const songs = [
        { title: "Kushagra, Bharath - Finding Her", url: "assets/Finding-Her.mp3" },
        { title: "Kailash Kher - Teri Deewani", url: "assets/Teri Diwani.mp3" },
        { title: "Lady Gaga, Bruno Mars - Die With A Smile", url: "assets/Die With A Smile.mp3" },
        { title: "Afusic - Pal Pal", url: "assets/Pal Pal.mp3" },
        { title: "Tera Ban Jaunga - Kabir Singh", url: "https://www.youtube.com/embed/mQiiw7uRngA?autoplay=1" },
        { title: "Hawayein - Jab Harry Met Sejal", url: "https://www.youtube.com/embed/cYOB941gyXI?autoplay=1" },
        { title: "Ve Maahi - Kesari", url: "https://www.youtube.com/embed/j6eyUU383Xg?autoplay=1" },
        { title: "O Mere Dil Ke Chain - Mere Jeevan Saathi", url: "https://www.youtube.com/embed/4J9JdpaVAzQ?autoplay=1" },
        { title: "Pehla Nasha - Jo Jeeta Wohi Sikandar", url: "https://www.youtube.com/embed/tPuvr-wVLgM?autoplay=1" },
        { title: "Soch Na Sake - Airlift", url: "https://www.youtube.com/embed/MK-k10iEp-Q?autoplay=1" }
    ];

    // Initialize
    updateProgressBar();
    createFloatingHearts();
    updateSongDisplay();
    
    // Initialize timeline with a delay to ensure DOM is ready
    setTimeout(initializeTimeline, 1000);

    // Event Listeners
    backButton.addEventListener('click', goToPreviousSlide);
    nextButton.addEventListener('click', goToNextSlide);
    playButton.addEventListener('click', togglePlayPause);
    prevSongButton.addEventListener('click', playPreviousSong);
    nextSongButton.addEventListener('click', playNextSong);
    
    // Gift box and letter event listeners
    if (giftBox) {
        giftBox.addEventListener('click', function() {
            openLetterModal();
        });
    }
    
    if (closeLetter) {
        closeLetter.addEventListener('click', function() {
            closeLetterModal();
        });
    }
    
    if (sendWhatsAppBtn) {
        sendWhatsAppBtn.addEventListener('click', function() {
            const phoneNumber = '9746838422'; // Your phone number
            const message = formatMessage();
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            closeLetterModal();
        });
    }

    // Save answers when typing
    document.querySelectorAll('.question-answer').forEach(textarea => {
        textarea.addEventListener('input', function() {
            const questionId = this.id.replace('answer', '');
            answers[questionId] = this.value.trim();
        });
    });

    // Functions
    function goToNextSlide() {
        if (currentSlide < totalSlides) {
            const currentTextarea = document.getElementById(`answer${currentSlide}`);
            if (currentTextarea) {
                answers[currentSlide] = currentTextarea.value.trim();
            }

            if (currentSlide < totalSlides - 1 && !answers[currentSlide]) {
                shakeElement(currentTextarea);
                currentTextarea.focus();
                return;
            }

            slides[currentSlide - 1].classList.remove('active');
            currentSlide++;
            slides[currentSlide - 1].classList.add('active');

            updateButtons();
            updateProgressBar();
            addRandomHeart();
        }
    }

    function goToPreviousSlide() {
        if (currentSlide > 1) {
            slides[currentSlide - 1].classList.remove('active');
            currentSlide--;
            slides[currentSlide - 1].classList.add('active');
            updateButtons();
            updateProgressBar();
        }
    }

    function updateButtons() {
        // Enable/disable back button
        backButton.disabled = currentSlide === 1;
        
        // Change next button to send on last slide
        if (currentSlide === totalSlides) {
            nextButton.style.display = 'none';
        } else {
            nextButton.style.display = 'block';
        }
    }

    function updateProgressBar() {
        const progressPercentage = (currentSlide / totalSlides) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        
        // Add subtle animation to the progress bar
        progressBar.style.transition = 'width 0.5s cubic-bezier(0.65, 0, 0.35, 1)';
        
        // Change progress bar color based on completion
        if (progressPercentage < 30) {
            progressBar.style.background = 'linear-gradient(to right, var(--primary-color), var(--secondary-light))';
        } else if (progressPercentage < 60) {
            progressBar.style.background = 'linear-gradient(to right, var(--primary-color), var(--secondary-color))';
        } else {
            progressBar.style.background = 'linear-gradient(to right, var(--primary-dark), var(--secondary-dark))';
        }
    }

    function shakeElement(element) {
        element.classList.add('shake');
        
        // Add shake animation class
        if (!element.style.animation) {
            element.style.animation = 'shake 0.5s ease-in-out';
            
            // Remove the class after the animation completes
            setTimeout(() => {
                element.style.animation = '';
            }, 500);
        }
    }

    function sendToWhatsApp() {
        // Format the answers
        const message = formatMessage();
        
        // Create and download a text file
        downloadTextFile(message, 'anniversary_responses.txt');
    }
    
    // Letter modal functions
    function openLetterModal() {
        if (anniversaryLetter) {
            anniversaryLetter.style.display = 'flex';
            setTimeout(() => {
                anniversaryLetter.classList.add('show');
                createHeartBurst();
            }, 50);
        }
    }
    
    function closeLetterModal() {
        if (anniversaryLetter) {
            anniversaryLetter.classList.remove('show');
            setTimeout(() => {
                anniversaryLetter.style.display = 'none';
            }, 500);
        }
    }
    
    function createHeartBurst() {
        // Create a burst of hearts when the letter opens
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'floating-heart';
                
                // Random position and size
                const size = 20 + Math.random() * 30;
                const posX = Math.random() * 100;
                const posY = Math.random() * 100;
                
                // Set styles
                heart.style.position = 'absolute';
                heart.style.width = `${size}px`;
                heart.style.height = `${size}px`;
                heart.style.left = `${posX}vw`;
                heart.style.top = `${posY}vh`;
                heart.style.backgroundImage = "url('assets/heart.svg')";
                heart.style.backgroundSize = 'contain';
                heart.style.backgroundRepeat = 'no-repeat';
                heart.style.opacity = '0.7';
                heart.style.zIndex = '0';
                heart.style.animation = `float ${5 + Math.random() * 10}s ease-in forwards`;
                
                // Add to the letter modal
                anniversaryLetter.appendChild(heart);
                
                // Remove after animation
                setTimeout(() => {
                    heart.remove();
                }, 10000);
            }, i * 200);
        }
    }
    
    function downloadTextFile(content, fileName) {
        // Create a blob with the content
        const blob = new Blob([content], { type: 'text/plain' });
        
        // Create a URL for the blob
        const url = URL.createObjectURL(blob);
        
        // Create a temporary anchor element
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        
        // Append to the document, click it, and remove it
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }

    function formatMessage() {
        return `❤️ Anniversary Responses ❤️\n\n` +
               `1️⃣ Favorite memory: ${answers[1]}\n\n` +
               `2️⃣ What I love most about us: ${answers[2]}\n\n` +
               `3️⃣ Dream place to visit: ${answers[3]}\n\n` +
               `4️⃣ Song that reminds me of you: ${answers[4]}\n\n` +
               `5️⃣ My secret wish for our future: ${answers[5]}\n\n` +
               `6️⃣ When I knew you were special: ${answers[6]}\n\n` +
               `7️⃣ What makes me smile: ${answers[7]}\n\n` +
               `8️⃣ Our love story movie title: ${answers[8]}\n\n` +
               `❤️ I love you! ❤️`;
    }

    function createFloatingHearts() {
        // Create initial floating hearts
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                addRandomHeart();
            }, i * 1000);
        }
        
        // Add new hearts periodically
        setInterval(addRandomHeart, 3000);
    }

    function addRandomHeart() {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        
        // Random position, size, and animation duration
        const left = Math.random() * 100; // Random horizontal position
        const size = 20 + Math.random() * 30; // Random size between 20-50px
        const duration = 10 + Math.random() * 15; // Random duration between 10-25s
        const delay = Math.random() * 5; // Random delay up to 5s
        
        // Set heart styles
        heart.style.position = 'absolute';
        heart.style.left = `${left}vw`;
        heart.style.bottom = '-50px';
        heart.style.width = `${size}px`;
        heart.style.height = `${size}px`;
        heart.style.backgroundImage = "url('assets/heart.svg')";
        heart.style.backgroundSize = 'contain';
        heart.style.backgroundRepeat = 'no-repeat';
        heart.style.opacity = '0.7';
        heart.style.animation = `float ${duration}s ease-in ${delay}s forwards`;
        
        // Add heart to container and remove after animation
        floatingHearts.appendChild(heart);
        setTimeout(() => {
            heart.remove();
        }, (duration + delay) * 1000);
    }

    // Music Player Functions
    function togglePlayPause() {
        isPlaying = !isPlaying;
        
        if (isPlaying) {
            playButton.innerHTML = '❚❚';
            playSong(currentSongIndex);
            addRandomHeart();
            showMusicNotes();
        } else {
            playButton.innerHTML = '▶';
            pauseSong();
            hideMusicNotes();
        }
    }
    
    function showMusicNotes() {
        const notes = document.querySelectorAll('.music-note');
        notes.forEach(note => {
            note.style.animationPlayState = 'running';
        });
    }
    
    function hideMusicNotes() {
        const notes = document.querySelectorAll('.music-note');
        notes.forEach(note => {
            note.style.animationPlayState = 'paused';
        });
    }

    function playNextSong() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        updateSongDisplay();
        
        if (isPlaying) {
            playSong(currentSongIndex);
            addRandomHeart();
            addRandomHeart();
            // Restart music note animations
            resetMusicNotes();
        }
    }

    function playPreviousSong() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        updateSongDisplay();
        
        if (isPlaying) {
            playSong(currentSongIndex);
            addRandomHeart();
            addRandomHeart();
            // Restart music note animations
            resetMusicNotes();
        }
    }
    
    function resetMusicNotes() {
        const notes = document.querySelectorAll('.music-note');
        notes.forEach(note => {
            // Reset animation by removing and adding it back
            const animation = note.style.animation;
            note.style.animation = 'none';
            setTimeout(() => {
                note.style.animation = animation;
            }, 10);
        });
    }
    
    function playSong(index) {
        // Use our hidden iframe for playing YouTube content
        const song = songs[index];
        
        // Check if we already have an iframe
        let iframe = document.getElementById('music-iframe');
        if (!iframe) {
            // Create iframe if it doesn't exist
            iframe = document.createElement('iframe');
            iframe.id = 'music-iframe';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
        }
        
        // Set the iframe source to the YouTube embed URL
        iframe.src = song.url;
    }
    
    function pauseSong() {
        // To pause, we remove the iframe or set its src to empty
        const iframe = document.getElementById('music-iframe');
        if (iframe) {
            iframe.src = '';
        }
    }

    function updateSongDisplay() {
        currentSongDisplay.textContent = songs[currentSongIndex].title;
    }
    
    // Update the WhatsApp message format to include all 8 questions
    // Timeline Animation
    function initializeTimeline() {
        // Wait a short moment to make sure the timeline elements are fully rendered
        setTimeout(() => {
            // Get all timeline items
            const timelineItems = document.querySelectorAll('.timeline-item');
            
            if (timelineItems.length === 0) {
                console.log("Timeline items not found");
                return; // No timeline items found, exit early
            }
            
            console.log(`Found ${timelineItems.length} timeline items`);
            
            // Make timeline items visible immediately
            timelineItems.forEach((item, index) => {
                // Add animation class with staggered delay
                setTimeout(() => {
                    item.classList.add('animate');
                }, index * 200); // Stagger the animations
            });
            
            // Add click event to timeline items for highlighting
            timelineItems.forEach(item => {
                item.addEventListener('click', function() {
                    // Pulse animation for selected item
                    const circle = this.querySelector('.timeline-content');
                    if (circle) {
                        shakeElement(circle);
                    }
                    
                    // Create hearts around the selected milestone
                    const rect = this.getBoundingClientRect();
                    createMilestoneHearts(rect.left + rect.width/2, rect.top + rect.height/2);
                });
            });
        }, 500); // Wait 500ms to ensure DOM is fully loaded
    }
    
    // Create hearts around a milestone when clicked
    function createMilestoneHearts(x, y) {
        // Create a few hearts bursting from the milestone
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'floating-heart';
                
                // Position and size
                const size = 15 + Math.random() * 20;
                
                // Set styles - position relative to viewport
                heart.style.position = 'fixed';
                heart.style.width = `${size}px`;
                heart.style.height = `${size}px`;
                heart.style.left = `${x}px`;
                heart.style.top = `${y}px`;
                heart.style.backgroundImage = "url('assets/heart.svg')";
                heart.style.backgroundSize = 'contain';
                heart.style.backgroundRepeat = 'no-repeat';
                heart.style.opacity = '0.8';
                heart.style.zIndex = '5';
                
                // Random direction animation
                const angle = Math.random() * Math.PI * 2; // Random angle in radians
                const distance = 50 + Math.random() * 100; // Random distance
                const duration = 1 + Math.random() * 2; // Random duration
                
                // Calculate end position based on angle and distance
                const endX = Math.cos(angle) * distance;
                const endY = Math.sin(angle) * distance;
                
                // Create keyframes animation dynamically
                heart.animate([
                    { transform: `translate(0, 0) scale(0.2) rotate(0deg)`, opacity: 0.9 },
                    { transform: `translate(${endX}px, ${endY}px) scale(1.2) rotate(${Math.random() * 360}deg)`, opacity: 0 }
                ], {
                    duration: duration * 1000,
                    easing: 'ease-out',
                    fill: 'forwards'
                });
                
                // Add to the document and remove after animation
                document.body.appendChild(heart);
                setTimeout(() => {
                    heart.remove();
                }, duration * 1000);
            }, i * 100);
        }
    }

    const galleryImages = document.querySelectorAll('.gallery-image');
    const body = document.body;

    // Create popup container
    const popupContainer = document.createElement('div');
    popupContainer.classList.add('popup-container');
    popupContainer.style.display = 'none';
    popupContainer.style.position = 'fixed';
    popupContainer.style.top = '0';
    popupContainer.style.left = '0';
    popupContainer.style.width = '100%';
    popupContainer.style.height = '100%';
    popupContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    popupContainer.style.zIndex = '1000';
    popupContainer.style.justifyContent = 'center';
    popupContainer.style.alignItems = 'center';

    // Ensure popup container is hidden on page load
    popupContainer.style.visibility = 'hidden';

    // Create popup image
    const popupImage = document.createElement('img');
    popupImage.style.maxWidth = '90%';
    popupImage.style.maxHeight = '90%';
    popupImage.style.borderRadius = '10px';
    popupImage.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
    popupContainer.appendChild(popupImage);

    // Append popup container to body
    body.appendChild(popupContainer);

    // Add click event to gallery images
    galleryImages.forEach((image, index) => {
        image.id = `photo-${index + 1}`; // Assign unique ID to each image
        image.addEventListener('click', function() {
            popupImage.src = this.src;
            popupContainer.style.display = 'flex';
            popupContainer.style.visibility = 'visible';
        });
    });

    // Close popup on click outside the image
    popupContainer.addEventListener('click', function(event) {
        if (event.target === popupContainer) {
            popupContainer.style.display = 'none';
            popupContainer.style.visibility = 'hidden';
        }
    });
});
