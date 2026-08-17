# BlueTrain — Website

Marketing site for BlueTrain AI, Inc. — workflow automation, accounting transformation,
data intelligence, and AI implementation. The company is referred to as **BlueTrain**
throughout the site; the full legal name appears only in the footer.

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

## Design language

Flat colour, hairline rules, editorial serif headlines, monospaced labels. No gradients
and no drop shadows — structure comes from 1px "lattice" grids and generous whitespace.

### Palette

<https://coolors.co/054a91-3e7cb1-81a4cd-dbe4ee-f17300>

| Token | Hex | Used for |
| --- | --- | --- |
| `--blue` | `#054A91` | Primary buttons, dark bands, logo mark |
| `--blue-mid` | `#3E7CB1` | Meters, secondary marks |
| `--blue-soft` | `#81A4CD` | Labels on dark, footer headings |
| `--blue-pale` | `#DBE4EE` | Tag borders, meter tracks |
| `--accent` | `#F17300` | The single accent: header rule, list markers, nav underline, focus ring, step numbers |

Plus neutrals: `--paper` `#FBFAF7` (warm page ground), `--paper-alt` `#F3F0E9`,
`--ink` `#10202F`, and `--rule` `#E2DED5` for every hairline. `--blue-deep` `#033663` is a
darkened shade of the brand blue, used only for the footer.

All tokens are defined once at the top of `assets/css/styles.css`.

### Typography

| Family | Role |
| --- | --- |
| **Newsreader** | Page and section headlines, footer tagline, step numerals |
| **IBM Plex Sans** | Body copy, component titles, buttons, navigation |
| **IBM Plex Mono** | Eyebrows, labels, breadcrumbs, form labels, footer meta |

Loaded from Google Fonts with system fallbacks in the `--serif` / `--sans` / `--mono` tokens.

## Deploying to GitHub Pages

Pages is configured through **Settings → Pages → Source → Deploy from a branch**, set to
`main` and the `/ (root)` folder. GitHub's built-in `pages build and deployment` job
publishes the site on every push to `main` — there is no workflow in this repository and
nothing to maintain. `.nojekyll` is committed so Jekyll processing is skipped and files
or folders beginning with `_` are served as-is.

The site is live at `https://<owner>.github.io/<repo>/`.

Note that this is a project site served from a subpath, not a domain root. Every link and
asset reference is relative, so it works there unchanged — including `404.html`.

> An Actions workflow (`actions/upload-pages-artifact` + `actions/deploy-pages`) is the
> other way to publish, and it becomes worthwhile if this site ever grows a build step.
> It buys nothing while the repository root *is* the deployable site, and running it
> alongside branch-based deployment means two jobs publishing the same files. If you do
> switch, set **Source** to **GitHub Actions** — a workflow cannot enable Pages for you,
> since `GITHUB_TOKEN` lacks the admin rights the create-site API requires.

> **Private repositories need a paid plan.** GitHub Pages is only available for private
> repos on GitHub Pro, Team, or Enterprise. This repository is public, so the free plan
> covers it.

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
- Sections tagged `class="reveal"` fade in on scroll via `IntersectionObserver`. Hero
  content uses a CSS-only staggered load cascade instead (`.stagger`). Both are disabled
  automatically under `prefers-reduced-motion`.
- `.lattice` grids draw their hairlines with a 1px grid gap over a rule-coloured
  background, so **cell counts must fill each row exactly** at every breakpoint — an
  orphaned grid area renders as a solid block of the rule colour.
- Navigation highlights the current page with `aria-current="page"`.
