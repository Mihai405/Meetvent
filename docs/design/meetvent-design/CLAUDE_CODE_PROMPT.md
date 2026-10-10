# Prompt de pornire pentru Claude Code

Pune folderul `meetvent-design/` în repo (de ex. `docs/design/`) și dă-i lui Claude Code promptul de mai jos. Înlocuiește ce e între paranteze drepte.

---

Implementăm UI-ul aplicației Meetvent după design-ul din `docs/design/meetvent-design/`.

Context:
- Citește întâi `README.md` (specificația completă), apoi `tokens.json` și `mock-data.json`.
- `design-source/*.dc.html` sunt sursele ecranelor din prototipul de design. Nu le rula. Folosește-le ca referință exactă pentru layout, dimensiuni, culori și stări: stilurile sunt inline, iar logica fiecărui ecran e în `<script type="text/x-dc">`, în `renderVals()`.
- Stack: [ex. React Native + Expo + TypeScript / Flutter / ce folosești], navigare cu [ex. expo-router], iconițe Lucide.

Ce vreau, pe pași (oprește-te după fiecare pas să verific):
1. **Fundația**: tema din `tokens.json` (inclusiv `deriveAccent(accent)`, care calculează `accentFill` și `accentText` după contrast), fontul DM Sans, componentele de bază din README §3 (Button, Chip, Input, Toggle, Avatar, AvatarStack, Badge, TabBar). Fiecare cu stories/preview sau un ecran demo.
2. **Navigarea**: stack-ul de auth (Login, Register în 3 pași) și tab-urile (Acasă, Evenimente, Connect, Mesaje, Profil), cu ecranele împinse Detalii eveniment, Profil utilizator și Conversație.
3. **Ecranele**, unul câte unul, pe datele din `mock-data.json`: Login → Register → Acasă → Evenimente → Detalii eveniment → Connect → Mesaje → Conversație → Profil utilizator → Profilul meu.
4. Stările din README §6 (loading, empty, eroare, match).

Reguli:
- Fără valori hardcodate de culoare/spațiere în ecrane. Totul vine din temă.
- Accesibilitate: touch targets ≥ 44, label-uri pentru butoanele care au doar iconiță, contrast conform tokens.
- Tot textul din UI e în română, ca în design.
- Portretele și scenele ilustrate sunt doar placeholdere pentru poze. Folosește `imageUrl` cu fallback pe o culoare/ilustrație.
- Scrie teste pentru logica non-UI (`deriveAccent`, filtrarea evenimentelor, validările din Register).
