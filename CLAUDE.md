# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the App

No build step required. Open `index.html` directly in a browser:

```
# Windows
start index.html

# Or drag index.html into a browser
```

For live reload during development, use any static file server:

```
npx serve .
# or
python -m http.server 8080
```

## Architecture

This is a zero-dependency, vanilla JS todo app. No framework, no bundler, no package.json.

**Data flow** — all state lives in a single `todos` array in `app.js`. Every mutation follows the same three-step pattern: mutate `todos` → `save()` (writes to `localStorage`) → `render()` (rebuilds the DOM from scratch).

**Persistence** — `localStorage` key `"todos"` stores a JSON array of `{ text: string, done: boolean }` objects. State is loaded once on page load (`app.js:7`) and re-saved on every mutation.

**DOM binding** — `index.html` defines static structure with stable IDs (`todo-input`, `add-btn`, `todo-list`, `remaining`, `clear-btn`). `app.js` grabs these at the top level and never re-queries them. The `<ul id="todo-list">` is fully rebuilt on each `render()` call; event listeners are attached per item during render.

**Styling** — `style.css` uses no preprocessor. Completed items are styled via the `.done` class toggled on the `<li>` element.
