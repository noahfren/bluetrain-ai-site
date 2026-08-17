# BlueTrain AI, Inc. — Website

Marketing site for BlueTrain AI, Inc. — workflow automation, accounting transformation,
data intelligence, and AI implementation.

Static HTML, CSS, and vanilla JavaScript. No build step, no dependencies — the repository
root *is* the site, which is what makes it a clean fit for GitHub Pages.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home — hero, what we do, who we serve, why BlueTrain, approach, CTA |
| `about.html` | Mission, vision, what makes us different |
| `services.html` | The four practices, with examples for each |
| `approach.html` | Assess → Design → Build → Deploy → Optimize |
| `leadership.html` | Leadership team bios |
| `insights.html` | Insights & resources topics |
| `contact.html` | Contact form and assessment request |
| `404.html` | Not-found page (served automatically by GitHub Pages) |

Shared assets live in `assets/css/styles.css`, `assets/js/main.js`, and
`assets/img/favicon.svg`.

## Brand palette

<https://coolors.co/03045e-0077b6-00b4d8-90e0ef-caf0f8>

| Token | Hex | Used for |
| --- | --- | --- |
| `--navy` | `#03045E` | Headings, dark sections, footer |
| `--blue` | `#0077B6` | Links, eyebrows, primary gradient |
| `--cyan` | `#00B4D8` | Accents, focus rings, CTA gradient |
| `--sky` | `#90E0EF` | Body copy on dark, icon fills |
| `--ice` | `#CAF0F8` | Tinted section backgrounds |

All tokens are defined once at the top of `assets/css/styles.css`.

## Deploying to GitHub Pages

Two options — pick one.

### Option A: GitHub Actions (recommended, already configured)

`.github/workflows/deploy.yml` publishes the repository root on every push to `main`.

1. Merge this branch into `main`.
2. In the repository, go to **Settings → Pages → Build and deployment**.
3. Set **Source** to **GitHub Actions**.
4. Push to `main` (or run the workflow manually from the **Actions** tab).

The site will be live at `https://<owner>.github.io/<repo>/`.

### Option B: Deploy from a branch (no Actions)

**Settings → Pages → Source → Deploy from a branch**, then choose `main` and the `/ (root)`
folder. `.nojekyll` is committed so Jekyll processing is skipped and files or folders
beginning with `_` are served as-is.

### Custom domain

1. Add a file named `CNAME` at the repository root containing only the domain, e.g.
   `www.bluetrain.ai`.
2. At your DNS provider, point the domain at GitHub Pages (a `CNAME` record to
   `<owner>.github.io` for a subdomain, or the four Pages `A` records for an apex domain).
3. Enable **Enforce HTTPS** in **Settings → Pages** once the certificate is issued.

## Before going live — things to update

- **Contact email.** `contact.html` uses a placeholder: `data-email="info@bluetrain.ai"`.
  Change it to the real inbox. It is also referenced in the fallback message in
  `assets/js/main.js`.
- **Form delivery.** With no `data-endpoint` set, submitting the contact form opens the
  visitor's email client with all the fields prefilled. To collect submissions properly,
  add an endpoint to the `<form>` tag in `contact.html`:

  ```html
  <form data-contact-form data-email="hello@example.com"
        data-endpoint="https://formspree.io/f/XXXXXXX">
  ```

  Any backend that accepts a multipart `POST` and returns a JSON response works
  (Formspree, Basin, Getform, a Cloudflare Worker, etc.). The form posts in the background
  and shows an inline confirmation; a hidden honeypot field discards obvious bot traffic.
- **Insights.** `insights.html` lists topics and notes that articles are on the way. Replace
  the placeholder block once posts exist.
- **Social preview.** Add an `og:image` (1200×630) to each page's `<head>` if you want link
  previews to show artwork.
- **Analytics.** None is installed. Add a snippet before `</head>` if you want it.

## Local preview

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Editing notes

- The header and footer are duplicated in each HTML file (the cost of having no build step).
  If you change one, change it everywhere — `index.html` is the reference copy.
- Sections tagged `class="reveal"` fade in on scroll via `IntersectionObserver`, and the
  effect is disabled automatically under `prefers-reduced-motion`.
- Navigation highlights the current page with `aria-current="page"`.
