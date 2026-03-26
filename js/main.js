document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Simple interaction: Logo color change on hover
    const logo = document.querySelector('.logo');
    logo.addEventListener('mouseenter', () => {
        logo.style.color = 'var(--secondary-color)';
        logo.style.transition = 'color 0.4s ease';
    });
    logo.addEventListener('mouseleave', () => {
        logo.style.color = 'var(--text-light)';
    });

    // Reusable Fade-In effect for sections
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in-section');
        observer.observe(section);
    });

    console.log('Portfolio script loaded! Ready to create something cool.');
});
