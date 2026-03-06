---
name: task-git
description: Protocole Git obligatoire pour toute tache impliquant des modifications de fichiers. Gere le cycle complet : synchronisation, creation de branche, commits atomiques, push, PR et review.
---

# Skill: task-git

Description: Protocole Git obligatoire pour toute tache impliquant des modifications de fichiers. Gere le cycle complet : synchronisation, creation de branche, commits atomiques, push, PR et review.

User-invocable: true

TRIGGER: Quand l'utilisateur invoque `/task-git` ou demande de suivre le protocole Git pour une tache.

---

## Protocole (a suivre dans l'ordre)

### 1. Synchronisation
```bash
git sync
```
Synchronise `main` et `develop` depuis le remote.

### 2. Creation de branche
```bash
git checkout develop
git checkout -b <prefixe>/<nom-descriptif>
```

Prefixes autorises :

| Prefixe      | Usage                      |
|--------------|----------------------------|
| `feature/`   | Nouvelle fonctionnalite    |
| `fix/`       | Correction de bug          |
| `refactor/`  | Restructuration technique  |
| `chore/`     | Maintenance, config, deps  |
| `docs/`      | Documentation              |

Noms en **kebab-case**, descriptifs et concis.

### 3. Implementation avec commits atomiques

Format conventional commits : `<type>(<scope optionnel>): <description>`

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

Regles :
- Un commit = un changement logique
- Imperatif present en anglais : "add", "fix", "update"
- Premiere ligne < 72 caracteres

### 4. Push
```bash
git push origin <branche>
```

### 5. Pull Request
```bash
gh pr create --base develop
```
Ne jamais cibler `main` directement.

### 6. Review de la PR
```bash
gh pr diff
```
Analyser les changements et laisser un commentaire de review via `gh pr comment` :
- Resume du diff
- Points verifies
- Anomalies eventuelles

## Regles absolues
- Ne JAMAIS push directement sur `main` ou `develop`
- Ne JAMAIS merger sans pull request
