# Meetvent – Design handoff (v1.2)

Pachet de design pentru implementarea aplicației mobile Meetvent. Conține:

| Fișier / folder | Ce este |
|---|---|
| `README.md` | Acest document: specificația de design (tokens, componente, ecrane, interacțiuni, date) |
| `CLAUDE_CODE_PROMPT.md` | Prompt de pornire pentru Claude Code |
| `tokens.json` | Design tokens (culori, tipografie, spațiere, raze, umbre) |
| `mock-data.json` | Date de test folosite în prototip (evenimente, persoane, conversații) |
| `design-source/*.dc.html` | Sursa fiecărui ecran din prototip (markup + stiluri inline + logica de stare) |

> **Despre `design-source/`:** fișierele sunt în formatul canvas-ului de design (`.dc.html`). Ele nu rulează singure (folosesc un runtime `support.js` care nu e inclus), dar sunt **referința exactă** pentru layout: fiecare element are stilurile inline (dimensiuni, culori, spațiere), iar blocul `<script type="text/x-dc">` de la final conține starea și logica (filtre, pași, toggle-uri). Sintaxă: `{{x}}` = valoare din `renderVals()`, `<sc-for>` = listă, `<sc-if>` = condiție, `<dc-import name="Portrait">` = componentă copil.

---

## 1. Concept

Meetvent face matching între oameni **pe baza evenimentelor la care merg amândoi**. Nu faci match „la rece": vezi întâi evenimentul, apoi cine mai merge și ce aveți în comun. Asta e diferențiatorul, iar fiecare ecran îl pune în față:

- „14 compatibili merg și ei" pe Acasă și pe Detalii eveniment
- „Mergeți amândoi la…" pe profilul altcuiva
- „V-ați conectat prin…" la începutul fiecărei conversații

Moduri de conectare: **Prieteni**, **Dating**, **Networking**. Utilizatorul apare doar în modurile bifate.

## 2. Direcție vizuală

Minimalist și fin, în spiritul aplicației originale: fundal alb, borduri subțiri de 1px, butoane tip pastilă, un singur accent portocaliu folosit cu măsură. Fără blocuri negre, fără fonturi groase de tip display.

### Culori (`tokens.json → color`)

| Token | Valoare | Folosire |
|---|---|---|
| `accent` | `#F57C3F` | culoarea de brand: puncte, bare de progres, toggle-uri active, underline la tab-uri |
| `accentFill` | `#E07139` | fundal pentru butoane/chip-uri umplute cu text alb (contrast 3.2:1) |
| `accentText` | `#B1592D` | text portocaliu pe alb, linkuri, tab activ (contrast 4.8:1, AA) |
| `accentSoft` | `#FEEFE8` | fundaluri tentate (chip selectat, badge „compatibili") |
| `accentLine` | `#FAB795` | contur pentru chip selectat / sloturi goale (dashed) |
| `ink` | `#2A2420` | text principal |
| `muted` | `#6F6660` | text secundar (5.6:1 pe alb) |
| `tabInactive` | `#776E68` | iconițe/label-uri tab inactive |
| `bg` | `#FFFFFF` | fundal ecrane |
| `bgWarm` | `#FCFAF8` | fundal Acasă / Evenimente |
| `surfaceMuted` | `#F4F0EC` | input-uri de search, bule de chat primite |
| `tintCard` | `#FCF7F3` + border `#F3E8DF` | carduri „Cine merge", prompturi, contextul conversației |
| `border` | `#EFE9E4` | borduri carduri, tab bar, header |
| `borderControl` | `#E8E1DB` | borduri input-uri, chip-uri, butoane outline |
| `divider` | `#F2ECE7` | separatoare între rânduri de listă |
| `danger` | `#B23A2A` / border `#E6A79B` | Deconectare |

**Regula pentru accent (important):** culoarea de brand se poate schimba (încă se decide nuanța finală). Nu hardcoda `accentFill` / `accentText`. Derivă-le din `accent`: întunecă RGB-ul în pași mici (×0.97 pentru fill, ×0.96 pentru text) până când contrastul cu albul ajunge la ≥3.1 (fill), respectiv ≥4.6 (text). Funcția există în orice `.dc.html`, în `renderVals()`, și merită pusă într-un util `deriveAccent(accent)`.

> Notă de accesibilitate: textul alb pe `accentFill` are 3.2:1. Asta e OK pentru text mare / bold (≥18.66px bold) și pentru iconițe, dar sub pragul AA 4.5:1 pentru text normal. Rămâne de decis odată cu tema finală: fie butoane cu text de 16px+ bold, fie un fill puțin mai închis.

### Tipografie

- Un singur font: **DM Sans** (Google Fonts), greutăți 400 / 500 / 600 / 700
- Titlu de pagină: 24px / 700 / letter-spacing −0.01em
- Titlu hero (Acasă): 26px / 700
- Titlu de secțiune: 18px / 700, sau label 13px / 600 muted
- Corp: 14–15px / 400, line-height 1.5–1.6
- Meta: 12px / 400–600
- Tab label: 11px / 500 (activ 600)

### Spațiere, raze, umbre

- Padding lateral ecran: 20px (16px în conversație, 24px în auth)
- Gap-uri: 4 / 6 / 8 / 10 / 12 / 14 / 20 / 24
- Raze: chip/buton = pastilă (height/2); input 14; card 16–18; thumbnail 12; poză profil 18–20
- Umbre: aproape niciuna. Cardurile folosesc border de 1px. Umbră doar pe cardul Connect (`0 6px 20px rgba(42,36,32,.10)`) și pe toast.
- Touch targets ≥ 44px

### Iconițe

Stil outline, stroke 1.6 (activ 1.8–2), linecap/linejoin round, 18–22px. În prototip sunt SVG-uri inline; în aplicație poți folosi **Lucide**, care are același stil (home, calendar, message-circle, user, search, sliders-horizontal, map, bookmark, map-pin, ticket, share, heart, x, star, chevron-*, send, eye, lock, mail, camera, plus, settings, log-out). Iconița Connect = **două cercuri suprapuse** (custom, e și logo-ul).

### Logo

Două cercuri suprapuse: cel din stânga umplut cu `accent`, cel din dreapta doar contur `ink` 2.5px. Wordmark „Meetvent" în DM Sans 700.

## 3. Componente

| Componentă | Specificație |
|---|---|
| **Button / primary** | h 48–50, pastilă, bg `accentFill`, text alb 15–16/600 |
| **Button / outline** | h 34–48, pastilă, border 1px `borderControl`, bg alb, text `ink` 13–14/500 |
| **Button / icon round** | 40–44 cerc, border 1px `border`, iconiță 18 |
| **Chip / filter** | h 34, pastilă, outline. Selectat: bg `accentFill`, text alb (categorii) sau bg `accentSoft` + border `accentLine` + text `accentText` (interese / moduri) |
| **Tabs text** | label 14, activ = `ink` 600 + underline 2px `accent` (inset box-shadow) |
| **Input** | h 48, rază 14, border 1px `borderControl`, label deasupra 13/500, hint dedesubt 12 muted |
| **Search** | h 46, rază 14, bg `surfaceMuted`, fără border |
| **Toggle** | 46×28, track `accent` / `#DDD4CD`, knob alb 22 |
| **Badge compatibili** | 12/600 `accentText` pe `accentSoft`, rază 8, padding 4×8 |
| **Event row** | thumbnail 68 r12 · dată (12/600 accentText) · titlu 15/600 · meta 12 muted cu „N compatibili" bold · bookmark 44 |
| **Event card (carusel)** | w 200, border 1px, r16, imagine 116h, badge dată alb |
| **Avatar stack** | 28px, border 2px alb, overlap −8px |
| **Tab bar** | h 82, alb, border-top 1px, 5 itemi: Acasă · Evenimente · Connect · Mesaje · Profil |
| **Portret (placeholder)** | `Portrait.dc.html`: ilustrație cu persoane inventate, props `who`, `variant` a/b, `crop` full/face. În aplicație se înlocuiește cu poza reală a utilizatorului. |
| **Scenă eveniment (placeholder)** | `Scene.dc.html`: ilustrație pe tip de eveniment (concert, football, gallery, comedy, film, tech, jazz, photo). În aplicație se înlocuiește cu poza evenimentului; poate rămâne fallback când lipsește poza. |

## 4. Ecrane

Toate au 390×844 (iPhone 14/15). Profilurile sunt mai înalte pentru că se derulează.

1. **Login** (`Login.dc.html`): logo + tagline + 4 avatare, email, parolă cu buton arată/ascunde, „Ai uitat parola?", buton Autentificare, separator „sau", Continuă cu Apple / Google, „Nu ai cont? Creează unul".
2. **Register** (`Register.dc.html`): 3 pași cu bară de progres și back.
   - Pas 1: Cont (email, parolă cu hint, acceptare termeni; Continuă e dezactivat fără bifă)
   - Pas 2: Despre tine (poză, prenume, data nașterii, cu regula 18+ și afișarea doar a vârstei; oraș)
   - Pas 3: Interese (minim 3 din 14) + Ce cauți (Prieteni / Dating / Networking, minim 1). Butonul final se activează doar când condițiile sunt îndeplinite, iar textul de ajutor spune câte mai lipsesc.
3. **Acasă** (`Main.dc.html`): avatar + locație (selector), notificări cu punct, titlu, search + filtre, chip-uri categorii, card „Următorul tău eveniment" (cu avatare compatibili + CTA „Cunoaște-i" spre Connect), carusel „În tendințe", listă „Weekendul viitor".
4. **Evenimente** (`Events.dc.html`): titlu + număr dinamic, search, hartă, chip-uri categorie, taburi dată (Oricând / Azi / Săptămâna asta), listă compactă, bookmark toggle, empty state. Filtrele se combină.
5. **Detalii eveniment** (`EventDetail.dc.html`): imagine 300h cu back / share / salvat, categorie, titlu, rânduri cu iconiță în pătrat tentat (dată+oră, locație+Hartă, preț, organizator+Urmărește), card „Cine merge" (avatare + „Cunoaște-i în Connect"), Despre (3 rânduri + Citește mai mult). Bara de jos: Bilete (outline) + **Merg și eu** (toggle → „Merg ✓", iar contorul crește).
6. **Connect** (`Connect.dc.html`): taburi mod (Prieteni / Dating / Networking), selector eveniment, card mare cu poza, bare de poze, contor „X din 14 compatibili", nume+vârstă+verificat, job · distanță, „N evenimente comune" + interese, buton spre profil complet. Acțiuni: X / Salut (stea) / Like. Toast de confirmare.
7. **Mesaje** (`Messages.dc.html`): Conexiuni noi (cerc cu numărul de like-uri + avatare cu inel accent), conversații cu ultimul mesaj, ora, evenimentul comun, punct de necitit.
8. **Conversație** (`Conversation.dc.html`): header cu avatar + Activ acum, card „V-ați conectat prin <eveniment>", bule (trimise: `accentText` cu text alb; primite: `surfaceMuted`), **icebreakers** contextuali deasupra input-ului (dispar după folosire), trimitere cu Enter.
9. **Profil utilizator** (`ProfileView.dc.html`): poza 1 + nume/vârstă/verificat/job/oraș/distanță, Mergeți amândoi la, Despre mine, Detalii (job, studii, înălțime, zodie, băutură, fumat, sport, limbi), Prompt 1, poza 2, Interese (cele comune evidențiate + „3 în comun"), Muzica ei (artiști comuni marcați „Și tu"), Prompt 2, A mai fost la, Raportează / Blochează. Acțiuni plutitoare X / Like.
10. **Profilul meu** (`MyProfile.dc.html`): previzualizare + setări, avatar + nume + progres de completare, grilă de 6 poze (principală, sloturi goale), Ce cauți (toggle), Despre mine (editare), Prompturi (2/3 + adaugă), Detalii (listă editabilă; câmpurile goale apar „Adaugă" în accent), Interese, Conectează Spotify, Confidențialitate (arată evenimentele, arată distanța), Deconectare.

### Navigare (flow)
Login → (Register) → Acasă. Tab bar între Acasă / Evenimente / Connect / Mesaje / Profil. Acasă/Evenimente → Detalii eveniment → Connect → Profil utilizator → Conversație. Mesaje → Conversație → Profil utilizator. Profilul meu → Previzualizare (Profil utilizator).

## 5. Modele de date (propunere)

```ts
type User = {
  id: string; firstName: string; birthDate: string; city: string;
  photos: string[];             // max 6, [0] = principală
  bio: string;                  // max 300
  prompts: { question: string; answer: string }[]; // max 3
  details: { job?: string; education?: string; heightCm?: number; zodiac?: string;
             drinking?: string; smoking?: string; sport?: string; languages?: string[] };
  interests: string[];          // min 3
  goals: ('friends' | 'dating' | 'networking')[];   // min 1
  topArtists?: { name: string; genre: string }[];
  verified: boolean;
  privacy: { showEvents: boolean; showDistance: boolean };
};

type Event = {
  id: string; title: string; category: 'music'|'sport'|'art'|'tech'|'comedy'|'film';
  tags: string[]; startsAt: string; endsAt?: string;
  venue: { name: string; address: string; lat: number; lng: number };
  priceFrom?: number; ticketUrl?: string; imageUrl?: string;
  organizer: { id: string; name: string; verified: boolean };
  description: string; ageLimit?: number;
};

type Attendance = { userId: string; eventId: string; createdAt: string }; // „Merg"
type Swipe = { fromUserId: string; toUserId: string; eventId: string; mode: Goal;
               action: 'pass' | 'like' | 'hello' };
type Match = { id: string; userIds: [string, string]; eventId: string; mode: Goal; createdAt: string };
type Message = { id: string; matchId: string; senderId: string; text: string; sentAt: string; readAt?: string };
```

**„Compatibil"** = alt utilizator care merge la același eveniment, are cel puțin un mod comun în `goals` și are interese comune. Scorul poate fi mai târziu ponderat (interese comune, artiști comuni, evenimente comune, distanță).

## 6. Stări de acoperit (nu apar toate în prototip)
- Loading (skeleton pentru liste și carduri), empty (există pentru filtre în Evenimente), eroare
- Connect: nu mai sunt profile pentru evenimentul ales; match reciproc (ecran/modal „Ați făcut match!")
- Register: validări de câmp (email invalid, parolă slabă, sub 18 ani)
- Permisiuni: locație, notificări, poze

## 7. Conținut
- Toată interfața e în **română**. Datele (evenimente, persoane) sunt de test.
- `[Adresa locației]` și `[Descrierea evenimentului…]` sunt placeholdere.
- Persoanele din portrete sunt inventate. **Nu se folosesc poze cu persoane reale/vedete** ca date de test.
