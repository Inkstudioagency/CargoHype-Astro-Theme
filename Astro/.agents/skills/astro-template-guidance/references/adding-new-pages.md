# Adding New Pages

## 1. A simple text page (policy, terms, changelog …)

Use `UtilityLayout`. It reuses the Style Guide hero and content rows, so the page matches the
design without any new CSS.

```astro
---
// src/pages/privacy.astro  →  /privacy
import UtilityLayout from '../layouts/UtilityLayout.astro';
import UtilityBlock from '../components/UtilityBlock.astro';
---

<UtilityLayout title="Privacy Policy" summary="How we collect and use your data.">
  <UtilityBlock
    title="What we collect"
    icon="type"            // 'type' | 'palette' | 'cursor'
    entries={[
      { text: 'Contact form submissions', caption: 'Name, email and message' },
      { text: 'Analytics', caption: 'Anonymous page views', href: 'https://example.com' },
    ]}
  />
  <UtilityBlock title="Retention" icon="cursor" last entries={[{ text: '12 months' }]} />
</UtilityLayout>
```

`last` removes the bottom border from the final row.

## 2. A full marketing page

Copy the existing page that is closest in layout (for example `about-us.astro`), then edit
its sections. Every page has this skeleton:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import Cta from '../components/Cta.astro';
import config from '../config/config.json';

const pageId = config.webflow.pages.about; // reuse the id of the page you copied
---

<BaseLayout pageId={pageId} title="Our Fleet" description="…">
  <div class="page-wrapper">
    <div id="fleet-hero" class="about-hero-area">
      <Header />
      <!-- hero section -->
    </div>
    <div class="main">
      <!-- sections copied from other pages -->
      <Cta />
    </div>
    <Footer backTo="fleet-hero" pageId={pageId} />
  </div>
</BaseLayout>
```

Rules:

- **`pageId`**: the Webflow interactions (scroll reveals, hero animations) are registered
  per Webflow page. Use the id of the page whose sections you copied. All ids are in
  `config.webflow.pages`. If you mix sections from different pages, the page whose id you
  pick keeps its animations. Elements with `to-top-*` attributes are pre-hidden until
  interactions run, so with a mismatched id they can stay invisible. Either pick a
  matching id or remove the `to-top-*` attribute from the copied element.
- **`backTo`**: the `id` of the page's first wrapper. The footer's "Back To Top" link
  scrolls to it.
- Add the page to `src/config/menu.json` if it belongs in the navigation.

## 3. A new section on an existing page

Copy a `<section class="section …">` block from any page. All classes live in
`src/styles/theme.css`, so copied markup renders identically. Keep the `section-gap` and
`container w-container` wrappers.

## 4. A CMS-driven page

See `content-management.md` for how to add a collection. A dynamic route follows the
pattern in `src/pages/services/[slug].astro`:

```astro
---
import { getServices } from '../../lib/content';
export async function getStaticPaths() {
  const services = await getServices();
  return services.map((service) => ({ params: { slug: service.slug }, props: { service } }));
}
const { service } = Astro.props;
---
```
