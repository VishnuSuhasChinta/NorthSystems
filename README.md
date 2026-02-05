# North Systems Portfolio

This is the vanilla HTML/CSS/JS portfolio website for North Systems.

## Project Structure

- **`index.html`**: The main entry point containing the structure and content.
- **`style.css`**: Global styles, variables, and responsive design rules.
- **`script.js`**: Handles interactions like smooth scrolling and scroll-on animations.

## How to Edit

### Changing Content
Edit `index.html` to update text, project names, or team members.
- **Projects**: Look for the `<section id="projects">`.
- **Team**: Look for the `<section id="team">`.

### Changing Styles
Edit `style.css`.
- **Colors**: Update the variables at the top of the file (e.g., `--accent-color`).
- **Fonts**: Change the `--font-main` variable.

## Future Additions
- To add a new project: Copy a `.card` div in the `#projects` section and update the details.
- To add a real blog: Create a `blog.html` file and link to it from the nav, or expand the `#blog` section.

## Verification
- Open `index.html` in any modern web browser.
- No build step required!
