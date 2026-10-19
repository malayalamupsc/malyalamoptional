# malayalamoptional (GitHub Pages + Supabase)

Static site. Content lives in Supabase (Postgres for text, Storage for the original .docx). Public visitors can only read. Only your admin email can write, enforced by Row Level Security, not by hiding the page.

## Setup
1. **Supabase project**: create one, then open SQL Editor, paste `supabase.sql`, replace `YOUR_ADMIN_EMAIL` with your email (every occurrence), and run it.
2. **Admin user**: Authentication > Users > Add user (that same email + a strong password, tick auto-confirm). Then Authentication > Sign In / Providers > turn **off** "Allow new users to sign up".
3. **Keys**: Project Settings > API. Put the Project URL and `anon` public key in `config.js`. Never use the `service_role` key here.
4. **GitHub**: push these files to a repo. Settings > Pages > Deploy from branch `main` / root. Your site appears at `https://USERNAME.github.io/REPO/`.
5. **Admin**: open `/admin.html`, log in, upload .docx files. There is no link to it from the public pages.
6. **Custom domain** (optional): Pages > Custom domain.
