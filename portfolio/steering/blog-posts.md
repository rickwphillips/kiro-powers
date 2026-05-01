# Portfolio Blog Posts

## The pattern (read this before doing anything blog-related)

"Create/add/make a post about X" means **write markdown and insert into the production portfolio DB** — NOT write a static React component.

There are two coexisting blog systems on this site:

1. **Static React components** (`app/blog/posts/[name]/[Name]Post.tsx`, exported via `app/blog/posts/index.ts`) — embedded in homepage as full Card components. These are legacy / hardcoded posts.
2. **DB-driven posts** — markdown rows in the prod portfolio DB. New posts go here.

When the user says "make a blog post about X," they mean #2 unless they explicitly say "as a React component."

## Insertion pattern

Script: `website/rickwphillips.com/scripts/create-post.php`. Fill in title/content/etc.

Deploy:
```bash
scp scripts/create-post.php rickwphillips:/tmp/create-post.php
ssh rickwphillips "php /tmp/create-post.php && rm /tmp/create-post.php"
```

## Post fields

- **Category** — choose from: `Engineering`, `General`. Don't invent new categories.
- **Accent color** — hex chip color (e.g. `#2196F3`). Becomes the post's accent in the listing.
- **Content** — markdown body. Use the existing posts as a length / tone reference.
- **Slug** — URL-safe kebab-case derived from the title.

## Anti-patterns

- Don't write a new post as a React component unless the user explicitly asks.
- Don't bypass the `create-post.php` script with raw SQL — the script handles slug generation, category validation, accent color storage.
- Don't deploy a script and forget to clean it up — the pattern always includes `&& rm /tmp/create-post.php`.
- Don't pick a Category outside `Engineering` / `General` without confirming with the user.
