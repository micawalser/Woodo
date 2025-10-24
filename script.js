// Configuración inicial
document.addEventListener('DOMContentLoaded', function() {
    setupNavigation();
    setupScrollAnimations();
    setupFormValidation();
    setupButtonEffects();
    setupAdvancedScrollEffects();
    setupHeaderScrollEffect();
    setupParticleEffect();
    setupCodeTypingEffect();
    setupMissionTypewriter();
});

// Navegación suave y activa
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Navegación suave
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Resaltar enlace activo al hacer scroll
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// Efectos de botones
function setupButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        button.addEventListener('click', function(e) {
            // Efecto de ripple
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Animaciones al hacer scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar elementos para animación
    const animatedElements = document.querySelectorAll(
        '.service-card, .portfolio-item, .contact-item, .section-header, .stat-item'
    );
    
    animatedElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
}

// Efectos avanzados de scroll
function setupAdvancedScrollEffects() {
    // Animación de números en stats
    animateCounters();
    
    // Efecto parallax sutil para el fondo
    setupParallaxEffect();
    
    // Animaciones de texto que aparece
    setupTextRevealAnimations();
}

// Animación de contadores
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent.replace(/\D/g, ''));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.floor(current) + (counter.textContent.includes('+') ? '+' : '') + 
                                           (counter.textContent.includes('%') ? '%' : '') +
                                           (counter.textContent.includes('/') ? '/7' : '');
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = counter.textContent;
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Efecto parallax sutil
function setupParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.hero-visual');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const rate = scrolled * -0.2;
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// Animaciones de texto que se revela
function setupTextRevealAnimations() {
    const textElements = document.querySelectorAll('.section-title, .section-description');
    
    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 1s ease-out forwards';
                textObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    textElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        textObserver.observe(el);
    });
}

// Validación de formulario
function setupFormValidation() {
    const form = document.querySelector('.contact-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Validación básica
            if (!data.name || !data.email) {
                showNotification('Por favor completa todos los campos obligatorios', 'error');
                return;
            }
            
            if (!isValidEmail(data.email)) {
                showNotification('Por favor ingresa un email válido', 'error');
                return;
            }
            
            // Simular envío
            showNotification('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
            form.reset();
        });
    }
}

// Validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos de la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    if (type === 'success') {
        notification.style.background = 'var(--primary-green)';
    } else if (type === 'error') {
        notification.style.background = '#e74c3c';
    } else {
        notification.style.background = '#3498db';
    }
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Efecto de hover en cards
function setupCardEffects() {
    const cards = document.querySelectorAll('.service-card, .portfolio-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Efecto de typing en el título (opcional)
function setupTypingEffect() {
    const title = document.querySelector('.hero-title');
    if (!title) return;
    
    const text = title.textContent;
    title.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            title.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    // Iniciar después de un delay
    setTimeout(typeWriter, 1000);
}

// Lazy loading para imágenes
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Smooth scroll para todos los enlaces internos
function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Efecto de partículas mejorado
function setupParticleEffect() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;
    
    // Crear partículas adicionales dinámicamente
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
    
    // Efecto de mouse para partículas interactivas
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Crear partícula temporal en la posición del mouse
        if (Math.random() > 0.95) {
            createTemporaryParticle(mouseX, mouseY);
        }
    });
    
    function createTemporaryParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.background = 'var(--primary-green)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        particle.style.opacity = '0.8';
        
        document.body.appendChild(particle);
        
        // Animar la partícula
        let opacity = 0.8;
        let size = 2;
        const animate = () => {
            opacity -= 0.02;
            size += 0.1;
            particle.style.opacity = opacity;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.transform = `translate(-50%, -50%)`;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                document.body.removeChild(particle);
            }
        };
        
        animate();
    }
}

// Efecto del header al hacer scroll
function setupHeaderScrollEffect() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Inicializar efectos adicionales
document.addEventListener('DOMContentLoaded', function() {
    setupCardEffects();
    setupSmoothScroll();
    setupLazyLoading();
    // setupParticleEffect(); // Descomenta si quieres el efecto de partículas
});

// Efecto de typing en el código
function setupCodeTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    const texts = [
        'woodo',
        'transformamos ideas',
        'realidad digital',
        'soluciones web',
        '48 horas',
        'éxito garantizado'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeText() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pausa al final
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500; // Pausa antes de empezar
        }
        
        setTimeout(typeText, typeSpeed);
    }
    
    // Iniciar después de un delay
    setTimeout(typeText, 1000);
}

// Efecto de máquina de escribir para "potenciamos negocios"
function setupMissionTypewriter() {
    const highlightElement = document.querySelector('.mission-highlight');
    if (!highlightElement) return;
    
    const originalText = highlightElement.textContent;
    highlightElement.textContent = ''; // Empezar vacío
    highlightElement.style.opacity = '0.7'; // Hacer más sutil hasta que comience
    
    let charIndex = 0;
    let isTyping = true;
    let animationActive = true;
    let hasStarted = false;
    
    function typeMissionText() {
        if (!animationActive) return;
        
        // Marcar que ha comenzado y hacer visible
        if (!hasStarted) {
            hasStarted = true;
            highlightElement.style.opacity = '1';
        }
        
        if (charIndex < originalText.length) {
            highlightElement.textContent += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(typeMissionText, 200); // Velocidad más lenta
        } else {
            // Después de escribir todo, esperar más tiempo
            setTimeout(() => {
                if (animationActive) {
                    isTyping = false;
                    deleteMissionText();
                }
            }, 4000); // Pausa más larga
        }
    }
    
    function deleteMissionText() {
        if (!animationActive) return;
        
        if (charIndex > 0) {
            highlightElement.textContent = originalText.substring(0, charIndex - 1);
            charIndex--;
            setTimeout(deleteMissionText, 80); // Borrado más lento
        } else {
            // Después de borrar todo, esperar más tiempo antes de repetir
            setTimeout(() => {
                if (animationActive) {
                    isTyping = true;
                    typeMissionText();
                }
            }, 2000); // Pausa más larga antes de repetir
        }
    }
    
    // Iniciar cuando la sección sea completamente visible
    const missionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasStarted) {
                console.log('🎯 Animación de máquina de escribir iniciada!');
                setTimeout(typeMissionText, 300); // Delay inicial más corto
                missionObserver.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.6, // La sección debe estar 60% visible
        rootMargin: '0px 0px -50px 0px' // Trigger cuando esté más arriba
    });
    
    missionObserver.observe(highlightElement);
    
    // Detener la animación después de 30 segundos para que no sea molesta
    setTimeout(() => {
        animationActive = false;
        highlightElement.textContent = originalText; // Mostrar texto completo
    }, 30000);
}