# design/

Source material that is **not** part of the site.

Everything under `public/` is served — `wrangler.jsonc` points the Worker's
static assets at that directory, so any file left there becomes a public URL.
This folder is outside it, so nothing here is downloadable, indexed, or
counted against the page weight budget. Put working files here rather than in
`public/` when they are something a change was made *from* rather than
something a visitor should get.

## das-animation-standalone.html

The prototype the DAS explainer animation was designed in, exported as a
self-contained React bundle: 1.46 MB, carrying React, ReactDOM and Babel
compiling JSX in the browser at runtime.

**It is not what the site runs.** The site runs `public/das/das-anim.js`,
which is that prototype's scene rewritten in plain JavaScript — same seven
scenes, same cue table, same camera keyframes, same traced paths, 7 KB
gzipped instead of 1.46 MB. The React was only the authoring harness; the
scene underneath is a pure function of one number, `T`, and needed none of
it.

This file is kept because it is where the choreography was authored and it is
easier to re-time a scene in than the port is. If you change it, the change
does **not** reach the site until it is carried across to
`public/das/das-anim.js` by hand. The two files have no build step between
them, on purpose — see the header of `das-anim.js`.

To open it, load it directly in a browser from disk. It needs no server.
