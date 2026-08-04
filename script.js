document.addEventListener('DOMContentLoaded', () => {
    
    // --- Audios ---
    const bgMusic = document.getElementById('bg-music');
    const openSound = document.getElementById('open-sound');
    const successSound = document.getElementById('success-sound');
    
    const musicToggleBtn = document.getElementById('music-toggle');
    let isMusicPlaying = false;
    
    function playMusic() {
        if (!isMusicPlaying) {
            bgMusic.volume = 0.3;
            bgMusic.play().catch(e => console.log("Audio play blocked by browser", e));
            isMusicPlaying = true;
            musicToggleBtn.innerText = '🔊';
        }
    }
    
    musicToggleBtn.addEventListener('click', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicToggleBtn.innerText = '🔇';
        } else {
            bgMusic.play();
            musicToggleBtn.innerText = '🔊';
        }
        isMusicPlaying = !isMusicPlaying;
    });

    // --- Preloader ---
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    });

    // --- Starfall Generation ---
    const starsContainer = document.getElementById('stars');
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        // Randomize size, position, and duration
        const size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}vw`;
        star.style.animationDuration = `${Math.random() * 5 + 5}s`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        starsContainer.appendChild(star);
    }

    // --- Parallax Effect ---
    const clouds = document.getElementById('clouds');
    const bears = document.getElementById('floating-bears');
    const goTopBtn = document.getElementById('go-top');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        // Move clouds slightly up on scroll
        clouds.style.transform = `translateY(${scrollY * -0.2}px)`;
        // Move bears faster
        bears.style.transform = `translateY(${scrollY * -0.4}px)`;
        
        // Go Top Button
        if (scrollY > 300) {
            goTopBtn.classList.remove('hidden');
        } else {
            goTopBtn.classList.add('hidden');
        }
    });
    
    goTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- Envelope Logic & Confetti ---
    const envelope = document.getElementById('envelope');
    const envelopeContainer = document.getElementById('envelope-container');
    const mainContent = document.getElementById('main-content');
    let isOpen = false;

    envelope.addEventListener('click', () => {
        if (!isOpen) {
            isOpen = true;
            envelope.classList.add('open');
            openSound.volume = 0.5;
            openSound.play().catch(e => console.log(e));
            
            // Fire Confetti!
            setTimeout(() => {
                const duration = 3 * 1000;
                const end = Date.now() + duration;

                (function frame() {
                    confetti({
                        particleCount: 5,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0 },
                        colors: ['#A2C2E1', '#F1C4D3'] // Boy and Girl colors
                    });
                    confetti({
                        particleCount: 5,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1 },
                        colors: ['#A2C2E1', '#F1C4D3']
                    });

                    if (Date.now() < end) {
                        requestAnimationFrame(frame);
                    }
                }());
            }, 300); // Fire slightly after click
            
            // Wait for envelope animation to finish before fading out container
            setTimeout(() => {
                envelopeContainer.classList.add('fade-out');
                playMusic(); // Start music when entering page
                
                setTimeout(() => {
                    envelopeContainer.style.display = 'none';
                    mainContent.classList.remove('hidden');
                    void mainContent.offsetWidth; // Force reflow
                    mainContent.classList.add('visible');
                    window.scrollTo(0, 0);
                }, 1000); 
                
            }, 1200); 
        }
    });

    // --- 3D Flip Countdown Logic ---
    // Target Date: 5 de Septiembre 2026 a las 17:30
    // Usamos new Date(year, monthIndex, day, hours, minutes, seconds)
    // El mes es 0-indexado, por lo que 8 = Septiembre
    const targetDate = new Date(2026, 8, 5, 17, 30, 0).getTime();

    // Elements
    const timeEls = {
        days: { front: document.getElementById('days-front'), back: document.getElementById('days-back'), card: document.getElementById('days-card') },
        hours: { front: document.getElementById('hours-front'), back: document.getElementById('hours-back'), card: document.getElementById('hours-card') },
        mins: { front: document.getElementById('mins-front'), back: document.getElementById('mins-back'), card: document.getElementById('mins-card') },
        secs: { front: document.getElementById('secs-front'), back: document.getElementById('secs-back'), card: document.getElementById('secs-card') }
    };

    let previousValues = { days: -1, hours: -1, mins: -1, secs: -1 };

    function updateFlipCard(unit, newValue) {
        const valStr = newValue < 10 ? '0' + newValue : newValue;
        const el = timeEls[unit];
        
        if (previousValues[unit] === -1) {
            // First time initialization: set both faces to prevent '00' getting stuck
            el.front.innerText = valStr;
            el.back.innerText = valStr;
            previousValues[unit] = newValue;
            return;
        }
        
        if (previousValues[unit] !== newValue) {
            // Check which face is currently visible (based on flipping class)
            const isFlipped = el.card.classList.contains('flipping');
            
            if (isFlipped) {
                // Front is currently hidden in the back, update it and flip to show it
                el.front.innerText = valStr;
                el.card.classList.remove('flipping');
            } else {
                // Back is currently hidden, update it and flip to show it
                el.back.innerText = valStr;
                el.card.classList.add('flipping');
            }
            previousValues[unit] = newValue;
        }
    }

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            clearInterval(countdownInterval);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        updateFlipCard('days', days);
        updateFlipCard('hours', hours);
        updateFlipCard('mins', minutes);
        updateFlipCard('secs', seconds);
    }

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); 

    // --- FORM SUBMISSION LOGIC ---
    const rsvpForm = document.getElementById('rsvp-form');
    const formMessage = document.getElementById('form-message');

    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const attendance = document.querySelector('input[name="attendance"]:checked').value;
        
        rsvpForm.style.display = 'none';
        formMessage.classList.remove('hidden');
        
        successSound.volume = 0.5;
        successSound.play().catch(e => {});
        
        if (attendance === 'yes') {
            formMessage.classList.add('success');
            formMessage.innerText = `¡Gracias ${name}! Hemos confirmado tu asistencia. Nos vemos pronto.`;
            
            // Celebration confetti!
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#A2C2E1', '#F1C4D3', '#C89F82']
            });
            
        } else {
            formMessage.classList.add('success');
            formMessage.innerText = `Gracias ${name} por avisarnos. Lamentamos que no puedas asistir.`;
        }
    });
});
