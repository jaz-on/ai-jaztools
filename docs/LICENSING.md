# Politique de Licence - ai-jaztools

## Licence Principale

L'ensemble du dépôt **ai-jaztools** est distribué sous la licence **GNU Affero General Public License version 3 (AGPL-3.0)**.

## Pourquoi l'AGPL ?

L'AGPL-3.0 est une licence copyleft stricte qui garantit que :
- Le code source reste libre et accessible
- Toute modification ou dérivation doit être également sous AGPL
- Les utilisateurs d'un service en ligne utilisant ce code ont droit au code source

Cette licence est particulièrement adaptée pour des outils web qui peuvent être déployés en tant que services.

## Compatibilité des Dépendances

Pour éviter les conflits de licences en cascade, nous limitons strictement les dépendances externes. Toutes les dépendances utilisées doivent être compatibles avec l'AGPL-3.0.

### Licences Compatibles avec AGPL-3.0

Les licences suivantes sont **compatibles** et peuvent être utilisées :
- **MIT** : Compatible (peut être utilisé dans un projet AGPL)
- **Apache 2.0** : Compatible
- **BSD** (2-clause, 3-clause) : Compatible
- **GPL v3** : Compatible
- **LGPL v3** : Compatible
- **ISC** : Compatible

### Licences Incompatibles

Les licences suivantes sont **incompatibles** et ne doivent **pas** être utilisées :
- **GPL v2** : Incompatible avec AGPL v3
- **Propriétaires** : Incompatibles
- **Autres licences copyleft strictes** : À vérifier individuellement

## Stratégie de Limitation des Dépendances

Pour minimiser les risques de conflits de licences et maintenir la simplicité du projet :

1. **Principe de base** : Préférer le code vanilla (HTML/CSS/JS) sans dépendances
2. **Dépendances minimales** : N'ajouter des dépendances que si absolument nécessaire
3. **Vérification préalable** : Avant d'ajouter une dépendance, vérifier sa licence
4. **Alternatives** : Chercher des alternatives sans dépendances ou avec des licences compatibles

## Dépendances Actuelles

### Node.js

- **marked** (MIT) : Parser Markdown - Compatible ✅
- **bcryptjs** (MIT) : Hachage de mots de passe - Compatible ✅
- **express** (MIT) : Framework web - Compatible ✅
- **cors** (MIT) : Middleware CORS - Compatible ✅
- **dotenv** (BSD-2-Clause) : Variables d'environnement - Compatible ✅
- **jsonwebtoken** (MIT) : Tokens JWT - Compatible ✅
- **node-cron** (ISC) : Planification de tâches - Compatible ✅
- **next** (MIT) : Framework React - Compatible ✅
- **react** (MIT) : Bibliothèque UI - Compatible ✅
- **tailwindcss** (MIT) : Framework CSS - Compatible ✅

### Python

- **fastapi** (MIT) : Framework web - Compatible ✅
- **uvicorn** (BSD) : Serveur ASGI - Compatible ✅
- **httpx** (BSD) : Client HTTP - Compatible ✅
- **beautifulsoup4** (MIT) : Parsing HTML - Compatible ✅
- **feedparser** (BSD) : Parsing RSS/Atom - Compatible ✅

## Vérification des Licences

Avant d'ajouter une nouvelle dépendance :

1. Vérifier la licence sur npm/pypi
2. Consulter le fichier LICENSE du package
3. Vérifier la compatibilité avec AGPL-3.0
4. Documenter la décision dans ce fichier

## Outils de Vérification

- [License Compatibility Matrix](https://licensecheck.io/compatibility-matrix)
- [SPDX License List](https://spdx.org/licenses/)
- `npm license-checker` pour auditer les dépendances npm
- `pip-licenses` pour auditer les dépendances Python

## Contribution

Lors de la contribution au projet, vous acceptez que votre code soit distribué sous la licence AGPL-3.0.

## Questions

Pour toute question concernant la politique de licence, ouvrez une issue sur le dépôt.

