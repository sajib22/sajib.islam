# Company logos

Drop logo files in this folder to replace the lettered tiles in the career
timeline (home page) and the column chart (Experience page).

## How

1. **Get the file from the company's own brand or press page.** Not an image
   search, not a random logo site — those files are usually the wrong version
   and sometimes not the company's to give away. Check their brand guidelines
   while you are there; some ask you to request permission first.

2. **Save it here** with a simple lowercase name:

   ```
   public/img/logos/nokia.svg
   public/img/logos/ericsson.svg
   public/img/logos/huawei.svg
   public/img/logos/grameenphone.svg
   public/img/logos/flipnet.svg
   public/img/logos/genwave.svg
   public/img/logos/buet.svg
   ```

   `.svg`, `.png` and `.webp` all work. SVG stays sharp at any size and is
   usually a few KB. Keep any single file under about 20KB.

3. **Switch it on** in `public/content/content.js`. Each entry in `timeline:`
   already has the line commented out — delete the `//` in front of it:

   ```js
   logo: "/img/logos/nokia.svg",
   ```

4. **Commit the image and the content change together**, or the site will
   briefly point at a file that isn't there yet.

## What happens if something is wrong

- **No `logo:` line** — you get the lettered tile. That is the current state
  and it looks fine, so add logos at whatever pace you like.
- **Path outside this folder** — ignored, and you get the tile. This is
  deliberate: it stops the site from ever loading an image off someone else's
  server, which would break the no-third-party-requests rule.
- **File missing** — you get a broken image icon. That is the one failure that
  looks bad, which is why step 4 matters.

## Sizing

The tile is about 76 × 36 px on a desktop and 56 × 32 px on a phone. Logos are
fitted inside it with `object-fit: contain`, so nothing gets stretched, but a
very wide wordmark will end up small. A square-ish mark reads best. If a
company only publishes a long horizontal wordmark, consider using its symbol
instead.
