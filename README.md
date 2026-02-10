# My-portfolio <sub><sup>An interactive , creative and modern portfolio</sup></sub>

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![GitHub last commit](https://img.shields.io/github/last-commit/a8kj7sea/my-portfolio)](https://github.com/a8kj7sea/my-portfolio/commits/main)

A dual-experience portfolio that combines a polished, modern interface for professionals and recruiters with a classic, interactive terminal for developers.

**[View Live Demo](https://a8kj7sea.github.io/my-portfolio/)**

---

## Key Features

This portfolio is designed to offer a unique experience tailored to the visitor:

* **Dual-Path Interface**: Visitors are greeted with a professional landing page offering a choice between two distinct experiences.
* **Modern View**: A sleek, visually-driven portfolio designed for recruiters and non-technical visitors.
    * Professional two-pane layout with a sticky sidebar.
    * Smooth on-scroll animations for content sections.
    * Custom interactive cursor.
    * Fully responsive design for all screen sizes.
* **Legacy View**: An interactive terminal-style portfolio for developers and tech enthusiasts.
    * Navigate the entire portfolio using terminal commands.
    * Resizable terminal window for a customized layout.
    * Command history navigation.
* **Multi-Theme System**: Both views support dynamic themes (Matrix, Ice, Fire) that change the entire color scheme and favicon.

---

## Technology Stack

* **Frontend**:
    * HTML5
    * CSS3 (Flexbox, Grid, Custom Properties)
    * JavaScript (ES6+)
    * **Vue.js 3**: Powers the interactivity of the Legacy terminal view.

* **Deployment**:
    * GitHub Pages

---

## Project Structure

```
├── index.html              # Main landing page
├── 404.html                # Custom 404 page
│
├── pages/
│   ├── modern.html         # The modern, visual portfolio
│   └── legacy.html         # The terminal-based portfolio
│
├── css/
│   ├── landing.css         # Styles for the landing page
│   ├── modern.css    # Styles for the modern portfolio
│   └── legacy.css          # Styles for the legacy portfolio
│
├── script/
│   ├── modern.js    # Logic for the modern portfolio (animations, themes)
│   └── legacy.js           # Vue.js application for the legacy terminal
│
└── images/
    └── favicon/            # Directory for theme-based favicons
```

---

## Getting Started

To run this project locally:

1. **Clone the repository:**
    ```sh
    git clone https://github.com/a8kj7sea/my-portfolio.git
    ```

2. **Navigate to the project directory:**
    ```sh
    cd my-portfolio
    ```

3. **Open `index.html` in your browser.**
    * For the best experience, use a local server extension like **Live Server** in VS Code to avoid potential CORS issues with local file paths.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details. 
