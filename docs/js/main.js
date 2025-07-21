// (Admin-Login-Code entfernt – Zugriff erfolgt nun ausschließlich via Netlify Identity /admin)

// Hero Slideshow functionality
document.addEventListener('DOMContentLoaded', function () {
    const heroSlides = document.querySelectorAll('.hero-slide');
    // Exit early if no slides are present to avoid errors
    if (!heroSlides.length) {
        return;
    }
    let currentSlide = 0;

    function showSlide(index) {
        // Hide all slides
        heroSlides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Show the current slide
        heroSlides[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % heroSlides.length;
        showSlide(currentSlide);
    }

    // Initialize slideshow
    showSlide(currentSlide);

    // Change slide every 4 seconds (adjusted for more images)
    setInterval(nextSlide, 4000);
});