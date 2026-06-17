# Portfolio Deploy

## Local alias

```bash
deploy-portfolio     # local ~/.zshrc alias
```

The alias resolves to:
```bash
bash /Users/rickphillips/FreddyRhetorickProjects/website/rickwphillips.com/deploy-portfolio.sh
```

## What gets deployed

- **Static export** of the Next.js build. Static export **excludes**: `projects/commander`, `projects/grandkid-games`, `php-api` (those are owned by other projects).
- **PHP API** → `rsync php-api/ rickwphillips:~/public_html/app/php-api/`.

## basePath

- Prod: `/app`
- Dev: `''` (empty)

`API_BASE` must include basePath — browser fetch does NOT auto-prepend Next.js basePath. Code paths that build URLs must thread the basePath through.

## .htaccess restoration (recurring footgun)

Portfolio's deploy uses `--delete` on rsync, which removes `.htaccess` from the remote. The current pattern is to manually restore `.htaccess` after each deploy. This has been forgotten multiple times — flag it after every portfolio deploy.

## Symlink hazard (read before touching the deploy script)

In production, `~/public_html/app/php-api` is a **symlink** pointing to `~/public_html/php-api`:
- Commander writes to `~/public_html/php-api/` directly (canonical location)
- Portfolio writes to `~/public_html/app/php-api/` which **resolves to the same directory**
- Both deploys land files at the same on-disk location

This is the existing topology — **the user has explicitly said NOT to consolidate.** Files shared by both projects (e.g. `posts.php`, `config.php`) get overwritten by whichever deployed last. If you find shared filenames between commander's and portfolio's php-api, **flag it to the user** — don't silently let one stomp the other.

## Migrations

Portfolio has versioned migrations in its own directory. Skipped when `--static-only` flag passed. Filename must match the version in `package.json` exactly — wrong name = silently skipped.
