# Kiro AWS Workshop

A collection of small projects built during the Kiro AWS Workshop.

## Activity Suggester

A client-side web app that suggests activities to beat boredom, powered by the
[Bored API](https://bored-api.appbrewery.com).

### Features

- Suggests a random activity with one click
- Filter by **type**, **number of participants**, and **max cost**
- Shows activity type, participant count, a human-friendly cost label, and a
  "Learn more" link when available
- Graceful handling of no-match and network errors
- Responsive dark UI, no build step required

### Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure and filter controls |
| `styles.css` | Styling and responsive layout |
| `app.js` | Fetches from the Bored API and renders results |

### Running it

The app is fully client-side. Serve the folder and open it in a browser:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

The Bored API supports cross-origin browser requests, so opening `index.html`
directly via `file://` also works.
