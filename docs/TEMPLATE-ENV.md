# Template .env.example

Ce document décrit le format standardisé pour les fichiers `.env.example` dans les outils avec backend (Option B).

## Structure standardisée

Chaque fichier `.env.example` doit suivre cette structure :

```env
# .env.example
# Copiez ce fichier en .env et remplissez les valeurs
# ============================================
# Configuration serveur
# ============================================
# Port d'écoute du serveur
# Type: number
# Valeur par défaut: [PORT_DEFAUT]
# [OBLIGATOIRE/OPTIONNEL]
PORT=8787

# Host d'écoute (0.0.0.0 pour toutes les interfaces)
# Type: string
# Valeur par défaut: 0.0.0.0
# [OBLIGATOIRE/OPTIONNEL]
HOST=0.0.0.0

# Environnement (development | production)
# Type: string
# Valeur par défaut: production
# [OBLIGATOIRE/OPTIONNEL]
NODE_ENV=production

# ============================================
# API externe (exemple : Anthropic)
# ============================================
# Clé API Anthropic
# Type: string
# Documentation: https://docs.anthropic.com/
# [OBLIGATOIRE/OPTIONNEL]
ANTHROPIC_API_KEY=your_api_key_here

# URL de l'API Anthropic (optionnel, valeur par défaut)
# Type: string
# Valeur par défaut: https://api.anthropic.com/v1/messages
# [OBLIGATOIRE/OPTIONNEL]
ANTHROPIC_API_URL=https://api.anthropic.com/v1/messages
```

## Règles de formatage

1. **En-tête** : Toujours commencer par un commentaire expliquant comment utiliser le fichier
2. **Sections** : Organiser les variables par catégories avec des séparateurs visuels
3. **Commentaires** : Chaque variable doit avoir un commentaire expliquant :
   - Son rôle
   - Son type
   - Sa valeur par défaut (si applicable)
   - Son statut (OBLIGATOIRE ou OPTIONNEL)
   - Un lien vers la documentation si c'est une API externe
4. **Valeurs** : Utiliser des valeurs d'exemple claires (jamais de vraies clés API)
5. **Ordre** : Configuration serveur en premier, puis APIs externes

## Variables communes

### Configuration serveur (toujours présentes)

- `PORT` : Port d'écoute du serveur
- `HOST` : Adresse d'écoute (généralement 0.0.0.0)
- `NODE_ENV` : Environnement (development | production)

### Variables spécifiques

Ajouter selon les besoins de l'outil :
- Clés API externes
- URLs d'API
- Configurations spécifiques à l'outil

## Exemple complet

Voir les fichiers `.env.example` dans :
- `tools/feed-minitools/favorites-migrator/.env.example`
- `tools/feed-minitools/urls-to-opml/.env.example`

