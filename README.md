# shadcn/ui Web Application

Une application web Next.js avec shadcn/ui et Tailwind CSS.

## Démarrage rapide

### Installation

```bash
npm install
```

### Développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Build de production

```bash
npm run build
npm start
```

## Déploiement sur Vercel

1. Connectez votre dépôt GitHub à Vercel
2. Vercel détectera automatiquement Next.js
3. Cliquez sur "Deploy"

Ou utilisez la CLI Vercel:

```bash
npm install -g vercel
vercel
```

## Stack technique

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **UI Components**: shadcn/ui
- **Package Manager**: npm

## Structure du projet

```
.
├── app/              # App Router pages et layouts
│   ├── globals.css   # Styles globaux et variables Tailwind
│   ├── layout.tsx    # Layout racine
│   └── page.tsx      # Page d'accueil
├── components/       # Composants shadcn/ui (à ajouter)
├── lib/              # Utilitaires
│   └── utils.ts      # Fonction cn() pour Tailwind
└── components.json   # Configuration shadcn/ui
```

## Ajouter des composants shadcn/ui

Pour ajouter des composants shadcn/ui:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
# etc...
```

Les composants seront ajoutés dans le dossier `components/ui/`.
