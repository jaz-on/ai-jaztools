# Guide de sécurité - Headers de sécurité standardisés

Ce document décrit l'implémentation et l'utilisation des headers de sécurité standardisés pour tous les outils du monorepo ai-jaztools.

## Vue d'ensemble

Les headers de sécurité protègent les applications contre diverses attaques :
- **XSS (Cross-Site Scripting)** : Via Content-Security-Policy
- **Clickjacking** : Via X-Frame-Options
- **MIME sniffing** : Via X-Content-Type-Options
- **Fuites de referrer** : Via Referrer-Policy
- **Fonctionnalités navigateur** : Via Permissions-Policy

## Headers implémentés

### 1. Content-Security-Policy (CSP)

Restreint les sources de contenu autorisées (scripts, styles, images, etc.).

**Valeur par défaut :**
```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data:;
font-src 'self';
connect-src 'self'
```

**Directives principales :**
- `default-src` : Source par défaut pour toutes les directives non spécifiées
- `script-src` : Sources autorisées pour les scripts JavaScript
- `style-src` : Sources autorisées pour les styles CSS
- `img-src` : Sources autorisées pour les images
- `font-src` : Sources autorisées pour les polices
- `connect-src` : Sources autorisées pour les requêtes (fetch, XHR, WebSocket)

### 2. X-Frame-Options

Protège contre le clickjacking en empêchant l'inclusion de la page dans un iframe.

**Valeurs possibles :**
- `DENY` : Empêche complètement l'inclusion (recommandé)
- `SAMEORIGIN` : Autorise uniquement depuis la même origine
- `ALLOW-FROM uri` : Autorise depuis une URI spécifique (déprécié)

**Valeur par défaut :** `DENY`

### 3. X-Content-Type-Options

Empêche le MIME sniffing, forçant le navigateur à respecter le type MIME déclaré.

**Valeur :** `nosniff`

### 4. Referrer-Policy

Contrôle les informations de referrer envoyées avec les requêtes.

**Valeur par défaut :** `strict-origin-when-cross-origin`

**Comportement :**
- Même origine : Envoie l'URL complète
- Cross-origin HTTPS → HTTPS : Envoie uniquement l'origine
- Cross-origin HTTPS → HTTP : N'envoie rien

### 5. Permissions-Policy

Contrôle les fonctionnalités du navigateur (géolocalisation, microphone, caméra, etc.).

**Valeur par défaut :** `geolocation=(), microphone=(), camera=()`

Désactive ces fonctionnalités par défaut pour protéger la vie privée.

## Utilisation côté serveur

### Module `shared/utils/security-headers.js`

Le module fournit une fonction `setSecurityHeaders()` pour configurer tous les headers.

#### Import

```javascript
const { setSecurityHeaders } = require('../../shared/utils/security-headers.js');
// Pour tools/feed-minitools/tool-name/, utilisez :
// const { setSecurityHeaders } = require('../../../shared/utils/security-headers.js');
```

#### Utilisation de base

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  // Configurer les headers de sécurité
  setSecurityHeaders(res);

  // Traiter la requête...
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<html>...</html>');
});
```

#### Personnalisation CSP

```javascript
setSecurityHeaders(res, {
  csp: {
    'img-src': ["'self'", 'data:', 'https://example.com'],
    'connect-src': ["'self'", 'https://api.example.com']
  },
  frameOptions: 'SAMEORIGIN', // Si vous avez besoin d'iframes
  referrerPolicy: 'no-referrer' // Politique plus stricte
});
```

#### Exemple complet

```javascript
const http = require('http');
const { setSecurityHeaders } = require('../../shared/utils/security-headers.js');

const server = http.createServer((req, res) => {
  // Headers de sécurité avec CSP personnalisée pour images externes
  setSecurityHeaders(res, {
    csp: {
      'img-src': ["'self'", 'data:', 'https://freshrss.org', 'https://assets.feedbin.com'],
      'connect-src': ["'self'", 'https://api.feedbin.com']
    }
  });

  // Votre logique de routage...
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<html>...</html>');
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(3000);
```

## Utilisation côté client (HTML)

Pour les applications statiques, les headers sont définis via des meta tags dans le `<head>`.

### Template de base

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Security Headers -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self';">
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="X-Frame-Options" content="DENY">
    <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">
    <meta http-equiv="Permissions-Policy" content="geolocation=(), microphone=(), camera=()">
    
    <!-- Autres balises... -->
</head>
<body>
    <!-- Contenu... -->
</body>
</html>
```

### Adaptations CSP par outil

#### Favorites Migrator

Autorise les images externes (FreshRSS, Feedbin) et les connexions à l'API Feedbin :

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://freshrss.org https://assets.feedbin.com; font-src 'self'; connect-src 'self' https://api.feedbin.com;">
```

#### URLs to OPML

Autorise les requêtes cross-origin pour la détection de feeds :

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https: http:;">
```

#### Subscription Organizer

CSP stricte (traitement local uniquement) :

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self';">
```

## Test des headers

### Outil en ligne : Security Headers

1. Visitez [https://securityheaders.com](https://securityheaders.com)
2. Entrez l'URL de votre application
3. Vérifiez le score et les recommandations

### Test manuel avec curl

```bash
curl -I https://votre-domaine.com
```

Vérifiez la présence des headers :
- `Content-Security-Policy`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Permissions-Policy`

### Test dans le navigateur

1. Ouvrez les outils de développement (F12)
2. Allez dans l'onglet "Network"
3. Rechargez la page
4. Sélectionnez la requête principale
5. Vérifiez l'onglet "Headers" → "Response Headers"

## Dépannage CSP

### Erreurs courantes

#### "Refused to load the script"

**Problème :** Un script externe est bloqué.

**Solution :** Ajouter la source à `script-src` :
```html
<!-- Avant -->
<meta http-equiv="Content-Security-Policy" content="script-src 'self';">

<!-- Après -->
<meta http-equiv="Content-Security-Policy" content="script-src 'self' https://cdn.example.com;">
```

#### "Refused to load the image"

**Problème :** Une image externe est bloquée.

**Solution :** Ajouter la source à `img-src` :
```html
<meta http-equiv="Content-Security-Policy" content="img-src 'self' data: https://example.com;">
```

#### "Refused to connect"

**Problème :** Une requête fetch/XHR est bloquée.

**Solution :** Ajouter la source à `connect-src` :
```html
<meta http-equiv="Content-Security-Policy" content="connect-src 'self' https://api.example.com;">
```

### Mode report-only

Pour tester une nouvelle CSP sans bloquer le contenu, utilisez `Content-Security-Policy-Report-Only` :

```html
<meta http-equiv="Content-Security-Policy-Report-Only" content="...">
```

Les violations seront rapportées mais ne bloqueront pas le chargement.

## Bonnes pratiques

1. **Principe du moindre privilège** : Autorisez uniquement ce qui est nécessaire
2. **Testez régulièrement** : Vérifiez avec securityheaders.com après chaque déploiement
3. **Documentez les exceptions** : Notez pourquoi certaines sources externes sont autorisées
4. **Évitez 'unsafe-inline'** : Utilisez des nonces ou des hashes quand c'est possible
5. **Mettez à jour régulièrement** : Adaptez la CSP selon les nouvelles fonctionnalités

## Références

- [MDN - Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [MDN - X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)
- [MDN - Referrer-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy)
- [Security Headers](https://securityheaders.com)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)

## Support

Pour toute question ou problème lié aux headers de sécurité, consultez :
- La documentation du module : `shared/utils/security-headers.js`
- L'exemple de serveur : `docs/EXAMPLE-SERVER.js`
- Les fichiers HTML des outils pour des exemples d'implémentation

