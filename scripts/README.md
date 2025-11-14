# Scripts d'automatisation

## generate-favicons.js

Génère automatiquement des favicons SVG pour tous les outils avec un style cohérent.

### Usage

```bash
node scripts/generate-favicons.js
```

### Fonctionnalités

- Génère des favicons SVG avec un fond coloré commun (couleur primaire du design system)
- Affiche le nom complet de chaque outil (formaté automatiquement)
- Ajustement automatique de la taille de police selon la longueur du texte
- Division en plusieurs lignes pour les noms longs
- Style cohérent : coins arrondis, police système, centrage automatique
- Génère automatiquement les favicons dans les bons emplacements

### Outils supportés

- `feed-minitools` → "Feed Minitools"
- `favorites-migrator` → "Favorites Migrator"
- `subscription-organizer` → "Subscription Organizer"
- `urls-to-opml` → "URLs to OPML"
- `instafed` → "InstaFed"

### Personnalisation

Pour ajouter un nouvel outil, modifiez le tableau `TOOLS` dans `scripts/generate-favicons.js` :

```javascript
{ name: 'nouvel-outil', displayName: 'Nouvel Outil', color: COLORS.primary }
```

Si `displayName` n'est pas spécifié, le nom sera automatiquement formaté à partir du nom du dossier (remplace les tirets par des espaces et capitalise).

### Alternatives en ligne

Si vous préférez des outils en ligne pour générer manuellement :

- **Favicon.io** : https://favicon.io/favicon-generator/
- **FaviconGenerator.io** : https://favicongenerator.io/
- **Letter Icon** : https://lettericon.com/

Ces outils permettent de créer des favicons à partir de texte avec personnalisation des couleurs et formes.

