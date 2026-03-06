# CLAUDE.md

## Git Workflow

### Branches protegees
- `main` : branche de production, sacree. Merge uniquement par pull request.
- `develop` : branche de developpement. Merge uniquement par pull request.

### Protocole pour chaque nouvelle tache

Ce protocole est **obligatoire** et doit etre suivi a la lettre :

1. `git checkout develop && git pull origin develop`
2. Creer la branche depuis develop : `git checkout -b <prefixe>/<nom-descriptif>`
3. Implementer les changements avec des commits atomiques (conventional commits)
4. `git push origin <branche>`
5. Ouvrir la PR vers `develop` via `gh pr create --base develop`
6. Review la PR avec `gh pr diff` pour verifier le diff avant de demander la validation

Ne jamais push directement sur `main` ou `develop`.

### Convention de nommage des branches

| Prefixe      | Usage                      | Exemple                          |
|--------------|----------------------------|----------------------------------|
| `feature/`   | Nouvelle fonctionnalite    | `feature/artist-focus-page`      |
| `fix/`       | Correction de bug          | `fix/heart-rate-zone-calc`       |
| `refactor/`  | Restructuration technique  | `refactor/spotify-data-model`    |
| `chore/`     | Maintenance, config, deps  | `chore/upgrade-next-15`          |
| `docs/`      | Documentation              | `docs/api-endpoints`             |

Les noms de branches sont en **kebab-case**, descriptifs et concis.

### Conventional Commits

Format : `<type>(<scope optionnel>): <description>`

| Type         | Quand l'utiliser                                    |
|--------------|-----------------------------------------------------|
| `feat`       | Nouvelle fonctionnalite visible                     |
| `fix`        | Correction de bug                                   |
| `refactor`   | Restructuration sans changement fonctionnel         |
| `chore`      | Maintenance (deps, config, CI)                      |
| `docs`       | Documentation uniquement                            |
| `style`      | Formatage, linting (pas de changement de logique)   |
| `test`       | Ajout ou modification de tests                      |
| `perf`       | Amelioration de performance                         |
| `ci`         | Configuration CI/CD                                 |

Regles d'or :
- Un commit = un changement logique. Pas de commits fourre-tout.
- Imperatif present en anglais : "add", "fix", "update" (pas "added", "fixes").
- Premiere ligne < 72 caracteres.
