// arbscreener/resources/js/utils/landingPageUtils.ts
import AOS from "aos"; // We'll address AOS import/setup below
import "aos/dist/aos.css"; // Import AOS styles

export const initAOS = () => {
    if (typeof window === 'undefined') {
        console.log('AOS initialization skipped on server-side');
        return;
    }
    
    AOS.init({
        duration: 800,
        easing: "ease-in-out",
        once: true,
        offset: 100,
    });
};

export const initSmoothScroll = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        console.log('Smooth scroll initialization skipped on server-side');
        return;
    }
    
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener(
            "click",
            function (this: HTMLAnchorElement, e: Event) {
                e.preventDefault();
                const targetId = this.getAttribute("href");
                const targetElement = targetId
                    ? document.querySelector(targetId)
                    : null;
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }
            }
        );
    });
};

export const initNavbarScrollBehavior = (navElement: HTMLElement | null) => {
    if (typeof window === 'undefined') {
        console.log('Navbar scroll behavior initialization skipped on server-side');
        return;
    }
    
    if (!navElement) return;
    let lastScrollY = window.scrollY;
    window.addEventListener("scroll", () => {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            navElement.style.transform = "translateY(-100%)";
        } else {
            navElement.style.transform = "translateY(0)";
        }
        lastScrollY = window.scrollY;
    });
};

export const animateNumberTicker = (
    element: HTMLElement,
    start: number,
    end: number,
    duration: number
) => {
    // Placeholder - Full implementation can be done when the component using it is built
    // This is a simplified version of the original script's logic
    if (!element) return;
    const startTime = Date.now();
    const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (end - start) * progress);

        if (element.textContent?.includes("%")) {
            element.textContent = "+" + (current / 100).toFixed(2) + "%";
        } else if (element.textContent?.includes("$")) {
            element.textContent = "$" + current.toLocaleString();
        } else {
            element.textContent = current.toLocaleString(); // Default if no symbol
        }

        if (progress >= 1) {
            clearInterval(interval);
        }
    }, 20); // Adjust interval for smoother/faster animation
};

export const observeAndAnimateTickers = () => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
        console.log('Ticker animation initialization skipped on server-side');
        return;
    }
    
    const tickers = document.querySelectorAll(".number-ticker");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const element = entry.target as HTMLElement;
                // Basic example, assuming end values might be dynamic or from data attributes later
                if (element.textContent?.includes("%")) {
                    animateNumberTicker(
                        element,
                        0,
                        Math.floor(Math.random() * 500) + 100,
                        2000
                    );
                } else if (element.textContent?.includes("$")) {
                    const endValue = Math.floor(Math.random() * 50000) + 25000;
                    animateNumberTicker(element, 0, endValue, 3000);
                }
                observer.unobserve(element);
            }
        });
    });
    tickers.forEach((ticker) => observer.observe(ticker));
};
