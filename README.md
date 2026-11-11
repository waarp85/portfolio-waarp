# andreamarcias.com - come e' organizzata la cartella

Sito statico (HTML + CSS + JS), pubblicato con GitHub Pages dal repo waarp85/portfolio-waarp, branch main.
Per pubblicare: doppio clic su `Claude outputs/pubblica-sito.bat` (fa il push su GitHub).

## Cosa va online (non spostare: gli indirizzi delle pagine dipendono da qui)

| Cosa | Dove |
|---|---|
| Pagine del sito | i file `.html` nella cartella principale (index, swarovski, mahmood, christina, mayhem-ball, feid, romancero, muse, paper...) |
| Pagine servizi per Google | `3d-title-animation.html`, `3d-logo-treatments.html`, `album-artwork.html` |
| Pagine nascoste (non indicizzate) | `rd.html`, `myke_towers.html`, `salmo_ranch.html`, `privacy.html`, `404.html` |
| Vecchi indirizzi che rimandano alle pagine nuove | `about`, `contact`, `work`, `christina-aguilera`, `feid-x-sprite`, `swarovski-arianagrande`, `researchanddevelopment` e la cartella `it/` |
| Immagini e video del sito | `assets/images/` |
| Stile, font, script | `assets/css/`, `assets/fonts/`, `assets/js/` |
| Plugin da scaricare | `assets/files/` |
| File tecnici | `CNAME` (dominio), `robots.txt`, `sitemap.xml`, favicon, `tailwind.config.js` |

L'elenco completo di quali file usa ogni pagina e' in `Claude outputs/ASSET USATI DAL SITO.txt`.

## Cosa NON va online (escluso da GitHub)

| Cartella | Cosa c'e' |
|---|---|
| `Claude outputs/` | `pubblica-sito.bat`, anteprime delle pagine, controlli del reel, bozze dei testi |
| `_ORIGINALI/` | materiale sorgente: VIDEO TEASER REEL (clip numerate + indice), FOTO MAHMOOD, FOTO MAYHEM BALL |
| `_da_cancellare/` | cose non piu' usate, da eliminare quando vuoi |
