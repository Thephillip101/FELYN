# Universo FELYN

A little pixel-art universe I built for Josselyn.

You fly a small plane around a cluster of stars. Every star holds a note I wrote her,
and every planet is a birthday. The sunflower planet sits in the middle and everything
else drifts slowly around it.

There's also a big one still under construction, so it's obvious the place keeps
growing.

The notes are encrypted. What sits in this repository is a block of ciphertext,
and the only thing that opens it is the code she types on the way in. That code is
deliberately not written down anywhere here, including this file.

## Running it

Don't open `index.html` by double-clicking it. Some browsers block the music and the
images when you load a file directly from disk. Use Live Server:

1. Open this folder in VS Code
2. Install the **Live Server** extension (Ritwick Dey)
3. Right-click `index.html` → *Open with Live Server*

For the online version it's GitHub Pages: **Settings → Pages → Source: `main`, folder
`/ (root)`**. Takes a couple of minutes to go live. Nothing gets compiled — it's just
HTML, CSS and JavaScript.

## Where things are

Everything I actually edit lives in `assets/js/data/`:

- `mensajes.js` — the notes, one star each
- `cumpleanos.js` — the planets
- `cuento.js` — the panels inside the "Por descubrir" planet
- `playlist.js` — the songs

The rest:

```
index.html                  the whole thing is one page
assets/css/                 base, mapa, planetas, comic, musica
assets/js/mapa.js           the engine: camera, orbits, the plane, the messages
assets/js/musica.js         the player
assets/js/vistaGirasol.js   the sunflower planet
assets/js/vistaFrio.js      the "Por descubrir" planet
assets/js/vistaConstruccion.js  the one still being built
assets/images/              petals, comic panels, icons (all WebP except the icons)
assets/audio/               songs
manifest.webmanifest        lets her add it to her home screen
planeta-girasol-original/   the first sunflower project, kept as it was
```

## The one thing I must not forget

The notes are encrypted. `mensajes.js`, `cuento.js` and `final.js` live on my
computer and are **not** in this repository — what gets published is
`assets/js/data/cifrado.js`, a block of ciphertext. So every time I change any of
them:

```bash
node cifrar.js
```

It asks for the code before it does anything, and checks it against the file it
already has. Type it wrong and it stops without touching a thing — otherwise a
slip of the finger would lock the universe with a code nobody knows.

Then commit and push as usual. **If I skip that command, nothing I wrote shows up
online** — the site keeps serving the last encrypted version.

And if I ever lose those files (new laptop, wiped disk), they are not gone: the
encrypted file in the repository is also the backup.

```bash
node cifrar.js --descifrar
```

That writes them back out, complete. The code is the only thing that opens it, and
the code isn't written down anywhere in here.

**What is not encrypted**: the fourteen petal messages on the sunflower planet
(`assets/js/vistaGirasol.js`) and the birthday text in `index.html`. Those have been
public since the very first upload and they live in the original project too. Worth
knowing rather than assuming everything is covered.

## Adding a note

Copy a block in `mensajes.js`:

```js
{
  id: "nota-064",
  fecha: "",
  texto: "whatever I want to tell her",
},
```

The `id` has to be unique, and I shouldn't change it once it's online. Where the star
lands, what colour it is, and whether it counts as read are all derived from it — change
the id and the star moves somewhere else and goes back to looking unvisited.

Line breaks work: `\n` for a new line, `\n\n` for a new stanza. Long notes scroll inside
their panel.

Adding `especial: true` gives the note the gold frame.

## Notes that show up on their own

Give a note a `desde` and it doesn't exist until that day:

```js
{
  id: "nota-070",
  fecha: "",
  desde: "2026-12-25",
  texto: "something for Christmas",
},
```

I can write things now and they appear on their own later. Nothing to upload that day.

## The last star

`assets/js/data/final.js` holds what happens when she opens the last star she had
left. She reads it, closes it, and then the whole sky lights up from the middle
outwards before the message shows up.

While `texto` is empty **nothing happens at all** — it's safe to leave it like that.
It switches itself on the moment I write something there. It only ever happens once.

## Adding a song

Drop the file in `assets/audio/` and add a block in `playlist.js` with a new id.

The order is completely random now — the whole list gets shuffled every round, so any
song can be the one that opens the universe. Within a round nothing repeats until
everything has played, and a song never plays twice in a row across rounds.

She can also pick one herself: the **♫** button next to the player opens the list.
`titulo` and `artista` are both on screen there, so they need to be the real names —
`artista` is optional and the option just shows the title without it. The menu builds
itself from `playlist.js`, so a new song shows up there on its own.

## The panels on "Por descubrir"

Images go in `assets/images/`, named `vineta_01.webp` through `vineta_06.webp`. The
seventh panel is text only, no drawing.

If an image is missing, that panel just says which file it's waiting for instead of
breaking, so I can add them one at a time. The captions are in `cuento.js`.

All of them are fetched the moment the planet opens, so moving between panels never
waits on a download.

**Every image in the project is WebP**, not PNG. Same pixels — it was converted with
near-lossless settings and measured: not one pixel of actual drawing comes out
different. It just weighs 96% less, because PNG is a bad fit for this kind of art and
terrible at big transparent areas like the petals. If I ever add a new drawing, saving
it as WebP keeps things consistent. The original PNGs are still in the git history if
I ever need them:

```bash
git show c52bc33:assets/images/vineta_01.png > vineta_01.png
```

## Adding a planet

Add a block to `cumpleanos.js`. With `vista: null` the planet shows up and can be
visited, it just says that world doesn't exist yet.

To build the inside: make an `assets/js/vistaWhatever.js` that calls
`registrarVistaPlaneta("whatever", { abrir, cerrar })`, add its
`<div id="vista-whatever">` to `index.html`, and set `vista: "whatever"`.

Two optional fields:

- `tamano` — 1 is a normal planet. Higher makes it bigger, keeps it sharp, and
  reserves proportionally more empty space around it so it never sits on top of a star.
- `enObra: true` — draws dashed scaffolding rings spinning around it. That's the
  "still being built" look.

Only one planet gets `centro: true`. That one stays pinned in the middle and doesn't
orbit — right now it's the sunflower.

## When the building one is finished

The `En construcción` planet is a placeholder on purpose. To turn it into a real
world: write its view, point `vista` at it, and drop `enObra` and `tamano` from
its block in `cumpleanos.js`. Then add a new placeholder, so there's always something
left to find.

## Tuning how it feels

Every number that controls the feel is at the top of `assets/js/mapa.js`, each with a
comment. Change one, reload, see how it sits.

| | |
| --- | --- |
| `DURACION_VUELO` | how long the plane takes to arrive |
| `VELOCIDAD_ORBITA` | how fast everything drifts around the centre. It's world pixels per second, and the screen shows it multiplied by the zoom — at the opening zoom it looks about 60% as fast |
| `FRICCION_POR_SEGUNDO` | how much the sky keeps gliding after you let go |
| `VELOCIDAD_MAXIMA` | cap on the fling. Lower it if dragging feels twitchy |
| `SUAVIDAD_ZOOM` | how gently the zoom settles |
| `MARGEN_LIBRE` | how far past the outermost star you can wander |
| `FUERZA_REGRESO` | how hard it pulls you back |
| `ESCALA_MAX` | how far in you can zoom |
| `ZOOM_AL_VISITAR` | how much it leans in when you pick a destination |
| `ESPERA_PARA_PASEO` | seconds of no input before the plane wanders off on its own |
| `VELOCIDAD_PASEO` | how fast it wanders |
| `LENTE_ENCOGE` / `LENTE_APAGA` | how much things shrink and dim toward the edges |
| `OSCURECER_BORDE` | how much dimmer the outer stars are than the middle |
| `DURACION_ENTRADA` | how long the opening takes |

The size of the space is set in `medirUniverso()`. The `0.5` in `RADIO_EXTERNO` is how
much the disc grows per note — raise it if the sky ever feels crowded.

## Adding it to her phone's home screen

The site ships a `manifest.webmanifest` and the sunflower as an icon, so from the
browser menu she can pick **Add to home screen**. It then opens like an app: no
address bar, full screen, its own icon. Worth telling her, it makes it feel less like
a web page.

The page also carries `noindex`, so it won't show up in Google, and an Open Graph
card so sharing the link looks like something instead of a bare URL.

## Putting changes online

Edit whatever I want, check it with Live Server, and then, from the project folder.
If I touched any of the notes, the comic or the ending, this one comes first:

```bash
node cifrar.js
```

```bash
git add -A
```

```bash
git commit -m "a short line saying what I changed"
```

```bash
git push
```

That's it. GitHub Pages rebuilds on its own and the site is updated in a minute or two,
same link as always. If the page still looks old after that, it's the browser cache —
`Ctrl + F5`.

To see what I'm about to send before sending it:

```bash
git status --short
```

`M` means modified, `A` new, `D` deleted, `??` not being tracked yet.

If I break something and want to go back to the last version that was online:

```bash
git checkout -- .
```

That throws away every change I haven't committed yet, so only when I'm sure.

## Things not to break

- **`nota-061` is encrypted.** Not one letter, not one space.
- **`planeta-girasol-original/`** is the first version, the one that was just the
  sunflower. It still runs on its own — open `planeta-girasol-original/index.html` and
  it works, same password. It borrows the images and the music from the root `assets/`
  so nothing is duplicated. The sunflower that runs inside the universe is a separate
  file, `assets/js/vistaGirasol.js`.
- **Don't rename note ids** once they're online (see above).
- **Nothing that moves gets a `transition` on `transform`.** The loop rewrites the
  position every frame, so the transition restarts forever and the body never arrives.
- **Anything measured per frame has to be converted to real time.** Friction, zoom
  easing and the elastic pull all do this. Skip it and the whole thing feels different
  on a 120Hz screen than on a 60Hz one.
- What she has already opened — stars **and** planets — is stored in the browser's
  `localStorage`, per device. Her phone and her laptop each remember separately. A
  ring around a star or a planet means she hasn't opened it yet; once she does, the
  ring goes and the star keeps its own colour from then on.

---

Plain HTML, CSS and JavaScript, no build step. The only thing it pulls from outside is
[GSAP](https://gsap.com/) for the animation.
