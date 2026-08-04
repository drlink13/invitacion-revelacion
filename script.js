document.addEventListener('DOMContentLoaded', () => {
    
    // --- Audios ---
    // IMPORTANTE: Recuerda que en GitHub tu carpeta se llama 'Audio' con "A" mayúscula
    const bgMusic = document.getElementById('bg-music');
    const openSound = document.getElementById('open-sound');
    const successSound = document.getElementById('success-sound');
    
    const musicToggleBtn = document.getElementById('music-toggle');
    let isMusicPlaying = false;
    
    function playMusic() {
        if (!isMusicPlaying) {
            bgMusic.volume = 0.3;
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                musicToggleBtn.innerText = '🔊';
            }).catch(e => console.log("Audio play blocked by browser", e));
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
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    });

    // --- Starfall Generation ---
    const starsContainer = document.getElementById('stars');
    if (starsContainer) {
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            const size = Math.random() * 3 + 1;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${Math.random() * 100}vw`;
            star.style.animationDuration = `${Math.random() * 5 + 5}s`;
            star.style.animationDelay = `${Math.random() * 5}s`;
            starsContainer.appendChild(star);
        }
    }

    // --- Parallax Effect ---
    const clouds = document.getElementById('clouds');
    const bears = document.getElementById('floating-bears');
    const goTopBtn = document.getElementById('go-top');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (clouds) clouds.style.transform = `translateY(${scrollY * -0.2}px)`;
        if (bears) bears.style.transform = `translateY(${scrollY * -0.4}px)`;
        
        if (goTopBtn) {
            if (scrollY > 300) {
                goTopBtn.classList.remove('hidden');
            } else {
                goTopBtn.classList.add('hidden');
            }
        }
    });
    
    if (goTopBtn) {
        goTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Envelope Logic & Audio Unlock ---
    const envelope = document.getElementById('envelope');
    const envelopeContainer = document.getElementById('envelope-container');
    const mainContent = document.getElementById('main-content');
    let isOpen = false;

    if (envelope) {
        envelope.addEventListener('click', () => {
            if (!isOpen) {
                isOpen = true;
                
                // Activar música de inmediato en la interacción del usuario (Evita bloqueo en celulares)
                playMusic();

                envelope.classList.add('open');
                if (openSound) {
                    openSound.volume = 0.5;
                    openSound.play().catch(e => console.log(e));
                }
                
                // Lanzar confeti al abrir
                setTimeout(() => {
                    const duration = 3 * 1000;
                    const end = Date.now() + duration;

                    (function frame() {
                        confetti({
                            particleCount: 5,
                            angle: 60,
                            spread: 55,
                            origin: { x: 0 },
                            colors: ['#A2C2E1', '#F1C4D3']
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
                }, 300);
                
                // Ocultar sobre y mostrar contenido principal
                setTimeout(() => {
                    envelopeContainer.classList.add('fade-out');
                    
                    setTimeout(() => {
                        envelopeContainer.style.display = 'none';
                        mainContent.classList.remove('hidden');
                        void mainContent.offsetWidth;
                        mainContent.classList.add('visible');
                        window.scrollTo(0, 0);
                    }, 1000); 
                    
                }, 1200); 
            }
        });
    }

    // --- Countdown Logic ---
    const targetDate = new Date(2026, 8, 5, 17, 30, 0).getTime();

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
        if (!el.front || !el.back || !el.card) return;
        
        if (previousValues[unit] === -1) {
            el.front.innerText = valStr;
            el.back.innerText = valStr;
            previousValues[unit] = newValue;
            return;
        }
        
        if (previousValues[unit] !== newValue) {
            const isFlipped = el.card.classList.contains('flipping');
            if (isFlipped) {
                el.front.innerText = valStr;
                el.card.classList.remove('flipping');
            } else {
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

    // --- ENVÍO DE FORMULARIO A WHATSAPP ---
    const rsvpForm = document.getElementById('rsvp-form');
    const formMessage = document.getElementById('form-message');

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // ⚠️ CAMBIA ESTE NÚMERO POR EL TUYO CON CÓDIGO DE PAÍS (Sin el signo +)
            // Ejemplo para Chile (+569...): '56912345678'
            const phoneNumber = '56958709091'; 
            
            const name = document.getElementById('name').value;
            const diet = document.getElementById('diet').value || 'Ninguna';
            const teamSelected = document.querySelector('input[name="team"]:checked');
            const team = teamSelected ? (teamSelected.value === 'boy' ? 'Team Niño 👦' : 'Team Niña 👧') : 'Sin definir';
            const attendanceSelected = document.querySelector('input[name="attendance"]:checked');
            const attendance = attendanceSelected && attendanceSelected.value === 'yes' ? '¡Sí, asistiré! 🎉' : 'No podré asistir 😢';
            
            // Construir texto formateado para WhatsApp
            const messageText = `*CONFIRMACIÓN DE ASISTENCIA*%0A%0A` +
                                `*Nombre:* ${encodeURIComponent(name)}%0A` +
                                `*¿Asistirá?:* ${encodeURIComponent(attendance)}%0A` +
                                `*Voto:* ${encodeURIComponent(team)}%0A` +
                                `*Alergias/Dieta:* ${encodeURIComponent(diet)}`;

            rsvpForm.style.display = 'none';
            if (formMessage) {
                formMessage.classList.remove('hidden');
                formMessage.classList.add('success');
                formMessage.innerText = `¡Gracias ${name}! Abriendo WhatsApp para enviar tu respuesta...`;
            }
            
            if (successSound) {
                successSound.volume = 0.5;
                successSound.play().catch(e => {});
            }
            
            if (attendanceSelected && attendanceSelected.value === 'yes') {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#A2C2E1', '#F1C4D3', '#C89F82']
                });
            }

            // Redirección a WhatsApp tras 1.5 segundos
            setTimeout(() => {
                window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${messageText}`, '_blank');
            }, 1500);
        });
    }
});
