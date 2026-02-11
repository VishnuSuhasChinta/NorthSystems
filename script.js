document.addEventListener('DOMContentLoaded', () => {

    // ---- MOBILE MENU TOGGLE ----
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('open');
            menuToggle.textContent = mobileNav.classList.contains('open') ? 'Close' : 'Menu';
        });

        // Close mobile nav when a link is clicked
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('open');
                menuToggle.textContent = 'Menu';
            });
        });
    }

    // ---- INTERSECTION OBSERVER (opacity-only reveal) ----
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // ---- DYNAMIC CONTENT LOADING ----
    const blogGrid = document.getElementById('blog-grid');
    const projectsGrid = document.getElementById('projects-grid');
    const homeBlogGrid = document.getElementById('home-blog-grid');

    // Create a blog preview block (for home page — inverted colors style)
    function createBlogPreview(post) {
        const block = document.createElement('div');
        block.className = 'blog-preview animate-on-scroll fade-in';

        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = post.tag;
        block.appendChild(tag);

        const title = document.createElement('h3');
        title.textContent = post.title;
        block.appendChild(title);

        const desc = document.createElement('p');
        desc.textContent = post.description;
        block.appendChild(desc);

        if (post.content) {
            const btn = document.createElement('a');
            btn.href = '#';
            btn.className = 'btn-outline';
            btn.textContent = 'READ ARTICLE →';
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                showBlogModal(post);
            });
            block.appendChild(btn);

            // Also open modal on card click
            block.addEventListener('click', (e) => {
                if (e.target.tagName !== 'A') {
                    showBlogModal(post);
                }
            });
        }

        observer.observe(block);
        return block;
    }

    // Create a blog list item (for blog page)
    function createBlogItem(post) {
        const item = document.createElement('div');
        item.className = 'blog-item animate-on-scroll fade-in';

        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = post.tag;
        item.appendChild(tag);

        const title = document.createElement('h2');
        title.textContent = post.title;
        item.appendChild(title);

        const desc = document.createElement('p');
        desc.textContent = post.description;
        item.appendChild(desc);

        if (post.content) {
            const link = document.createElement('span');
            link.className = 'read-link';
            link.textContent = 'READ ARTICLE →';
            item.appendChild(link);

            item.addEventListener('click', () => {
                showBlogModal(post);
            });
        }

        observer.observe(item);
        return item;
    }

    // Create a project list item (for projects page)
    function createProjectItem(project) {
        const item = document.createElement('div');
        item.className = 'projects-page-item animate-on-scroll fade-in';

        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = project.tag;
        item.appendChild(tag);

        const title = document.createElement('h2');
        title.textContent = project.title;
        item.appendChild(title);

        const desc = document.createElement('p');
        desc.textContent = project.description;
        item.appendChild(desc);

        if (!project.isComingSoon && project.link) {
            const btn = document.createElement('a');
            btn.href = project.link;
            btn.target = '_blank';
            btn.className = 'btn-outline';
            btn.textContent = project.buttonText.toUpperCase() + ' →';
            item.appendChild(btn);
        } else {
            const btn = document.createElement('span');
            btn.className = 'btn-outline';
            btn.style.opacity = '0.4';
            btn.style.cursor = 'default';
            btn.textContent = project.buttonText.toUpperCase();
            item.appendChild(btn);
        }

        observer.observe(item);
        return item;
    }

    // ---- BLOG MODAL ----
    function showBlogModal(post) {
        let modal = document.querySelector('.blog-modal');

        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'blog-modal';
            modal.innerHTML = `
                <div class="blog-modal-close" id="close-blog-modal">
                    <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="square">
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

            modal.querySelector('#close-blog-modal').addEventListener('click', () => {
                modal.classList.remove('visible');
                document.body.style.overflow = '';
            });

            // Close on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('visible')) {
                    modal.classList.remove('visible');
                    document.body.style.overflow = '';
                }
            });
        }

        modal.querySelector('#modal-tag').textContent = post.tag;
        modal.querySelector('#modal-title').textContent = post.title;
        modal.querySelector('#modal-desc').textContent = post.description;
        modal.querySelector('#modal-body').innerHTML = post.content;

        setTimeout(() => {
            modal.classList.add('visible');
        }, 10);

        document.body.style.overflow = 'hidden';
    }

    // ---- FETCH CONTENT ----
    fetch('content.json')
        .then(response => response.json())
        .then(data => {
            // Home blog preview (all posts)
            if (homeBlogGrid && data.blogPosts && data.blogPosts.length > 0) {
                homeBlogGrid.innerHTML = '';
                data.blogPosts.forEach(post => {
                    const preview = createBlogPreview(post);
                    homeBlogGrid.appendChild(preview);
                });
            }

            // Blog page (all posts)
            if (blogGrid && data.blogPosts) {
                blogGrid.innerHTML = '';
                data.blogPosts.forEach(post => {
                    const item = createBlogItem(post);
                    blogGrid.appendChild(item);
                });
            }

            // Projects page (all projects)
            if (projectsGrid && data.projects) {
                projectsGrid.innerHTML = '';
                data.projects.forEach(project => {
                    const item = createProjectItem(project);
                    projectsGrid.appendChild(item);
                });
            }
        })
        .catch(error => {
            console.error('Error loading content.json:', error);

            // Fallback to global variables
            if (typeof blogPosts !== 'undefined' && blogGrid && blogGrid.children.length === 0) {
                blogPosts.forEach(post => {
                    const item = createBlogItem(post);
                    blogGrid.appendChild(item);
                });
            }
            if (typeof projects !== 'undefined' && projectsGrid && projectsGrid.children.length === 0) {
                projects.forEach(project => {
                    const item = createProjectItem(project);
                    projectsGrid.appendChild(item);
                });
            }
        });

    // ---- SMOOTH SCROLL FOR ANCHOR LINKS ----
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
