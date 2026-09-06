# Universo FELYN

A little pixel-art universe I built for Josselyn.

You fly a small plane around a cluster of stars. Every star holds a note I wrote her,
and every planet is a birthday. The sunflower planet sits in the middle and everything
else drifts slowly around it.

There's also a big one still under construction, so it's obvious the place keeps
growing.

Password to get in: `KIWWA`

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
assets/images/              petals and comic panels
assets/audio/               songs
planeta-girasol-original/   the first sunflower project, kept as it was
```

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

Images go in `assets/images/`, named `vineta_01.png` through `vineta_06.png`. The
seventh panel is text only, no drawing.

If an image is missing, that panel just says which file it's waiting for instead of
breaking, so I can add them one at a time. The captions are in `cuento.js`.

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

## Putting changes online

Edit whatever I want, check it with Live Server, and then, from the project folder:

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
- Which stars have been visited is stored in the browser's `localStorage`, per device.
  Her phone and her laptop each keep their own count.

---

Plain HTML, CSS and JavaScript, no build step. The only thing it pulls from outside is
[GSAP](https://gsap.com/) for the animation.
