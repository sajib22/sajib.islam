# Company logos

These appear in the career timeline on the home page and in the column chart
on the Experience page.

## What's here

| File | Used by | Source |
|---|---|---|
| `buet.webp` | Bangladesh University of Engineering and Technology | supplied by Sajib |
| `grameenphone.webp` | Grameenphone | supplied by Sajib |
| `ericsson.webp` | Ericsson | supplied by Sajib |
| `huawei.webp` | Huawei | supplied by Sajib |
| `flipnet.webp` | FlipNet (MTN Irancell) | supplied by Sajib |
| `nokia.webp` | Nokia | supplied by Sajib |
| `genwave.webp` | Genwave Technologies | supplied by Sajib |

Every entry in the timeline now has a logo. If you add a company without one,
it falls back to a lettered tile of the same size, so the two mix without the
layout moving.

Each file was trimmed to its mark, flattened onto white, and resized to fit
the badge. All seven together come to about 23KB.

**These are other organisations' trademarks.** They are used here to identify
where Sajib actually studied and worked, which is what a CV does. If any owner
objects, delete the file and the `logo:` line and the lettered tile comes back.

## Adding or replacing one

1. **Get the file from the company's own brand or press page** where you can.
   Check their brand guidelines while you are there.

2. **Save it here** with a simple lowercase name matching the company, e.g.
   `public/img/logos/telus.webp`. `.svg`, `.png` and `.webp` all work. Keep
   any single file under about 20KB.

3. **Switch it on** in `public/content/content.js` — find the company in the
   `timeline:` list and set:

   ```js
   logo: "/img/logos/telus.webp",
   ```

4. **Commit the image and the content change together**, or the site will
   briefly point at a file that isn't there.

## Notes on how they render

- Logos sit on a **white tile in both light and dark mode**. Brand marks are
  drawn for light backgrounds — Huawei's wordmark is black, Nokia's is blue —
  so letting the dark theme show through would make several of them disappear.
- The tile is about 76 × 36 px on a desktop and 56 × 32 px on a phone. Images
  are fitted with `object-fit: contain`, so nothing gets stretched, but a very
  wide wordmark ends up small. A square-ish mark reads best.
- **A path outside this folder is ignored** and you get the lettered tile
  instead. That is deliberate: it stops the site from ever loading an image
  off another server, which would break the no-third-party-requests rule.
- A missing file gives a broken image icon, which is the one failure that
  looks bad. Hence step 4.
