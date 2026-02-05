document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const icon = themeToggle.querySelector('svg');

    // Icons
    const sunIcon = `
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    `;

    const moonIcon = `
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    `;

    // Check for saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        updateIcon(savedTheme);
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light'; // Default is dark (null/empty) or explicit 'dark'

        if (newTheme === 'dark') {
            htmlElement.removeAttribute('data-theme'); // Go back to root defaults (dark)
            localStorage.setItem('theme', 'dark');
            updateIcon('dark');
        } else {
            htmlElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            updateIcon('light');
        }
    });

    function updateIcon(theme) {
        if (theme === 'light') {
            icon.innerHTML = moonIcon; // In light mode, show moon to switch to dark
        } else {
            icon.innerHTML = sunIcon; // In dark mode, show sun to switch to light
        }
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => {
        el.classList.add('fade-in-up');
        observer.observe(el);
    });

    // Dynamic Content Loading
    const blogGrid = document.getElementById('blog-grid');
    const projectsGrid = document.getElementById('projects-grid');

    // Function to create a card element
    function createCard(item) {
        const card = document.createElement('div');
        card.className = 'card animate-on-scroll';

        // Tag
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = item.tag;
        card.appendChild(tag);

        // Title
        const title = document.createElement('h3');
        title.textContent = item.title;
        card.appendChild(title);

        // Description
        const desc = document.createElement('p');
        desc.textContent = item.description;
        card.appendChild(desc);

        // Button/Action
        if (item.isComingSoon) {
            const btn = document.createElement('div');
            btn.className = 'btn-outline';
            btn.style.textAlign = 'center';
            btn.style.borderStyle = 'dashed';
            btn.style.pointerEvents = 'none';
            btn.textContent = item.buttonText;
            card.appendChild(btn);
        } else {
            const btn = document.createElement('a');
            btn.className = 'btn-outline';
            btn.style.textAlign = 'center';
            btn.textContent = item.buttonText;

            if (item.content) {
                btn.href = "#";
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    showBlogModal(item);
                });
            } else {
                btn.href = item.link;
            }

            card.appendChild(btn);
        }

        return card;
    }

    // Function to show blog modal ("Big Page")
    function showBlogModal(post) {
        let modal = document.querySelector('.blog-modal');

        // Create modal if it doesn't exist
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'blog-modal';
            modal.innerHTML = `
                <div class="blog-modal-close" id="close-blog-modal">
                    <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </div>
                <div class="blog-modal-content">
                    <header class="blog-modal-header">
                        <span class="blog-modal-tag" id="modal-tag"></span>
                        <h1 class="blog-modal-title" id="modal-title"></h1>
                        <p class="blog-modal-desc" id="modal-desc"></p>
                    </header>
                    <div class="blog-modal-body" id="modal-body"></div>
                </div>
            `;
            document.body.appendChild(modal);

            // Close event listener
            modal.querySelector('#close-blog-modal').addEventListener('click', () => {
                modal.classList.remove('visible');
                document.body.style.overflow = ''; // Restore scrolling
            });
        }

        // Populate Content
        modal.querySelector('#modal-tag').textContent = post.tag;
        modal.querySelector('#modal-title').textContent = post.title;
        modal.querySelector('#modal-desc').textContent = post.description;
        modal.querySelector('#modal-body').innerHTML = post.content;

        // Show Modal
        // Small timeout to allow transition
        setTimeout(() => {
            modal.classList.add('visible');
        }, 10);

        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    // Render Blog Posts
    if (blogGrid && typeof blogPosts !== 'undefined') {
        blogPosts.forEach(post => {
            const card = createCard(post);
            blogGrid.appendChild(card);
        });
    }

    // Render Projects
    if (projectsGrid && typeof projects !== 'undefined') {
        projects.forEach(project => {
            const card = createCard(project);
            projectsGrid.appendChild(card);
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
