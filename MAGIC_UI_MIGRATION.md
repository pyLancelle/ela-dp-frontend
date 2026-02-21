# Migration shadcn/ui → Magic UI

> Document de référence décrivant la migration progressive de l'interface de base shadcn/ui vers un design system enrichi avec Magic UI, liquid glass et animations fluides via `motion/react`.

---

## Contexte

### Point de départ

L'application utilisait exclusivement **shadcn/ui** : `Card`, `Table`, `Button`, `Badge`, etc. Le design était fonctionnel mais statique — aucune animation, aucun effet visuel, apparence générique.

### Objectif

Un langage visuel cohérent et moderne : effets *liquid glass* (verre translucide via `backdrop-filter`), animations d'entrée décalées, indicateurs glissants, compteurs numériques springifiés. Le tout sans sacrifier la lisibilité ni les performances.

### Règle fondamentale — copy-paste, pas de package

Magic UI n'est **pas installé comme dépendance npm**. Les composants sont copiés directement dans `components/magicui/` (philosophie officielle du projet). Seul `motion` est ajouté comme dépendance externe.

```bash
npm install motion   # framer-motion v11+ alias
```

---

## Dépendances ajoutées

| Package | Rôle |
|---|---|
| `motion` | Animations spring, `AnimatePresence`, `layoutId` |

Aucune autre dépendance externe.

---

## Composants Magic UI créés

Tous dans [`components/magicui/`](components/magicui/).

### [`blur-fade.tsx`](components/magicui/blur-fade.tsx)

Wrapper d'animation d'entrée. Fait apparaître son enfant avec un effet blur + fade + slide vertical, déclenché avec un délai paramétrable.

```tsx
<BlurFade delay={0.1} duration={0.5}>
  <MonComposant />
</BlurFade>
```

Utilisé pour : apparition échelonnée des cards de classement, sections de la sidebar, header de page.

---

### [`number-ticker.tsx`](components/magicui/number-ticker.tsx)

Compteur animé en spring qui "compte" jusqu'à sa valeur cible. Utilise `useInView` pour ne se déclencher qu'au moment où l'élément entre dans le viewport.

```tsx
<NumberTicker value={track.play_count} className="text-xs font-semibold" />
```

Utilisé pour : play counts dans les tables Top Titres, Top Artistes, Top Albums.

---

### [`aurora-text.tsx`](components/magicui/aurora-text.tsx)

Texte avec dégradé multicolore animé via `background-position`. Crée un effet d'aurore en mouvement sur les titres.

```tsx
<AuroraText colors={["#1DB954", "#9c40ff", "#ff6b35"]} speed={1}>
  Classements Musicaux
</AuroraText>
```

Utilisé pour : titre principal de la page `/musique/classements`.

---

### [`border-beam.tsx`](components/magicui/border-beam.tsx)

Faisceau lumineux animé qui parcourt le contour d'une card. Créé et intégré, puis **retiré** suite à un retour utilisateur (trop chargé visuellement).

---

### [`animated-shiny-text.tsx`](components/magicui/animated-shiny-text.tsx)

Effet shimmer CSS pur sur du texte (sans dépendance JS). Créé puis **remplacé** par `AuroraText` pour le titre principal.

---

## Système CSS — Liquid Glass

Défini dans [`app/globals.css`](app/globals.css), en dehors de Tailwind (classes CSS pures avec variantes `.dark`).

### Principe des trois couches

```
1. backdrop-filter: blur() saturate()   → floute et sature l'arrière-plan
2. background gradient semi-transparent → teinte et profondeur de surface
3. box-shadow inset                     → reflets simulant une surface brillante
```

---

### `.liquid-glass-filter`

Conteneur pill du filtre de dates. Enveloppe les boutons de preset de période.

| Propriété | Valeur |
|---|---|
| `backdrop-filter` | `blur(20px) saturate(180%)` |
| `border` | `1px solid rgba(255,255,255,0.28)` |
| `box-shadow` | Reflet supérieur + ombre portée douce |

---

### `.liquid-glass-pill-active`

Bulle de verre dense qui se déplace sous le bouton actif du filtre. Animée avec `layoutId` framer-motion — elle *glisse* d'un bouton à l'autre.

```tsx
<motion.span
  layoutId="liquid-glass-indicator"
  className="liquid-glass-pill-active absolute inset-0 rounded-full"
  transition={{ type: "spring", stiffness: 400, damping: 35 }}
/>
```

---

### `.liquid-glass-card`

Remplace les `<Card>` shadcn/ui pour les blocs de classement et futures sections de contenu.

| Propriété | Valeur |
|---|---|
| `backdrop-filter` | `blur(24px) saturate(160%)` |
| `border` | `1px solid rgba(255,255,255,0.22)` |
| `box-shadow` | Reflet top + ombre portée douce |

---

### `.liquid-glass-fade-bottom`

Overlay dégradé transparent → teinté en bas de chaque card. Adoucit la coupure abrupte après la dernière ligne de tableau.

```html
<div class="pointer-events-none absolute bottom-0 left-0 right-0 h-8 liquid-glass-fade-bottom rounded-b-xl" />
```

---

### `.liquid-glass-sidebar`

Appliqué à la sidebar. Blur plus prononcé (28px) car la surface est grande et permanente.

| Propriété | Valeur |
|---|---|
| `backdrop-filter` | `blur(28px) saturate(180%)` |
| `border-right` | `1px solid rgba(255,255,255,0.26)` |
| `box-shadow` | Reflet latéral gauche + ombre portée droite |

---

### `.liquid-glass-nav-active`

Bulle de verre sur le lien de navigation actif dans la sidebar. Animée avec `layoutId="sidebar-active-pill"` — elle *glisse* d'un lien à l'autre lors de la navigation entre pages.

---

## Animations Tailwind ajoutées

Dans [`tailwind.config.ts`](tailwind.config.ts), section `extend.animation` et `extend.keyframes` :

| Nom | Usage |
|---|---|
| `aurora` | `AuroraText` — déplace le `background-position` |
| `shimmer-slide` | `BorderBeam` — déplace le shimmer horizontalement |
| `spin-around` | `BorderBeam` — rotation du faisceau |
| `shiny-text` | `AnimatedShinyText` — shimmer sur texte |

---

## Pages et composants transformés

### [`app/musique/classements/page.tsx`](app/musique/classements/page.tsx)

| Élément | Avant (shadcn/ui) | Après (Magic UI) |
|---|---|---|
| Cards Top Titres/Artistes/Albums | `<Card>` | `<div className="liquid-glass-card">` |
| Titre de page | Texte statique | `<AuroraText>` avec dégradé animé |
| Play counts | Chiffre brut | `<NumberTicker>` spring animation |
| Apparition des cards | Instantanée | `<BlurFade>` échelonné (delay 0.1 / 0.2 / 0.3) |
| Images artistes | `rounded-full` | `rounded-md` (carré, harmonie visuelle) |
| Fin de chaque card | Coupure abrupte | Fade-out via `.liquid-glass-fade-bottom` |
| Icônes de rang (🥇🥈🥉) | Emojis | Chiffres `RankBadge` sobres |

---

### [`components/date-range-filter.tsx`](components/date-range-filter.tsx)

| Élément | Avant (shadcn/ui) | Après (Magic UI) |
|---|---|---|
| Boutons preset | `<Button variant="ghost">` | Boutons custom dans `.liquid-glass-filter` |
| Indicateur actif | `bg-primary` (couleur pleine) | Bulle glissante `layoutId="liquid-glass-indicator"` |
| Bouton date perso | `<Button>` avec `<CalendarIcon>` | Même style pill liquid glass |

---

### [`components/sidebar.tsx`](components/sidebar.tsx)

| Élément | Avant (shadcn/ui) | Après (Magic UI) |
|---|---|---|
| Fond sidebar | `bg-background border-r` | `.liquid-glass-sidebar` (backdrop-filter) |
| Animation collapse | CSS `w-16` / `w-64` | `motion.div` avec `animate={{ width }}` spring |
| Lien actif | `bg-primary text-primary-foreground` | Bulle `.liquid-glass-nav-active` avec `layoutId` |
| Apparition des labels | Toggle immédiat | `AnimatePresence` + fade+slide horizontal |
| Sections nav | Affichage direct | `<BlurFade>` échelonné |
| Bouton collapse | `<Button variant="ghost">` avec chevron | Bouton `PanelLeftClose/Open` en pied de sidebar |

---

### [`app/layout.tsx`](app/layout.tsx)

| Élément | Avant | Après |
|---|---|---|
| Breadcrumb | `<BreadcrumbNav />` présent dans chaque page | Retiré — la sidebar suffit à l'orientation |

---

## Règles pour les prochaines pages

Pour maintenir la cohérence lors des futures migrations :

1. **Surfaces visuelles** → `liquid-glass-card` à la place de `<Card>` shadcn/ui
2. **Filtres / pill groups** → `.liquid-glass-filter` + `layoutId` framer-motion pour l'indicateur
3. **Entrées de page** → `<BlurFade>` avec délais échelonnés (incrément de 0.1s)
4. **Compteurs numériques** → `<NumberTicker>` plutôt que chiffre brut
5. **Titres de section** → `<AuroraText>` pour les titres principaux de page
6. **Indicateurs actifs** → toujours via `layoutId` pour les transitions glissantes

---

## Ce qui reste en shadcn/ui (intentionnel)

Ces composants ne sont pas migrés — ils sont soit strictement utilitaires, soit trop complexes pour un gain visuel limité :

| Composant | Raison |
|---|---|
| `Table`, `TableRow`, `TableCell`… | Structure de données, pas de surface visible |
| `Dialog`, `DialogContent` | Modal système, accessibilité complexe |
| `Popover`, `Calendar` | Sélecteur de date, logique de positionnement complexe |
| `Skeleton` | État de chargement transitoire |
| `Button` dans les dialogs | Actions utilitaires secondaires |

---

## Résumé de l'approche

```
shadcn/ui   →  structure, accessibilité, composants complexes
Magic UI    →  animation, entrées, compteurs, titres
Liquid Glass CSS  →  surfaces visuelles (cards, sidebar, filtres)
motion/react      →  transitions fluides (layoutId, collapse, AnimatePresence)
```

L'objectif n'est pas de remplacer shadcn/ui mais de le **complémenter** : shadcn/ui reste pour ce qu'il fait de mieux (accessibilité, composants interactifs complexes), Magic UI + liquid glass prend en charge la couche visuelle et les animations.
