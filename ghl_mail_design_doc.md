---
title: GHL and mail modules
author: Gray Dafflon
date_de_creation: 14.09.2026
derniere_mise_a_jour: 15.09.2026
disclaimer: "Le design doc n'est pas une source de vérité absolue. Il peut être remis en question durant le développement. C'est un document théorique. Quand le code, une documentation officielle ou un test le contredit, la preuve l'emporte : l'agent le signale à l'humain, et la décision devient une ligne de project-level-past-decisions-log.md."
---

**HITL**, human in the loop. Une ligne portant cette mention est exécutée par
l'humain, jamais par l'agent, qui doit la lui demander.

## 1. Context, scope and UML

### Vision du produit

Une soumission de formulaire déclenche trois envois indépendants, côté
serveur : le payload hashé vers Meta, le payload en clair vers GHL, qui crée un
contact et une opportunité, et le payload en clair par mail. La server action
appelle une fonction publique par module. Chaque module construit la forme
qu'attend son service et décide ce qu'il attend et ce qu'il confie à `after()`.
Seul le mail transactionnel est attendu avant la redirection du visiteur.

### Unified Modeling Language

### Inventaire

- Framework : Next.js, App Router, sur le scaffold Meta [https://github.com/s-e-r-n/scaffold-nextjs-app_x_meta]
- Runtime : Node
- Hébergement : Vercel, comme le module Meta [`Desktop/meta-capi/meta_capi_design_doc.md`, section 1]
- Périmètre : agnostique du projet. Chaque module se branche seul sur le scaffold
- Configuration : variables d'environnement propres à chaque site
- Langue : le code en anglais, le design doc en français
- GHL API, version `v3`, publiée le 11 juin 2026. La version `2021-07-28`, utilisée par `page-demonstration-waveprom`, est documentée « no longer actively maintained » [https://marketplace.gohighlevel.com/docs/2021-07-28/Versioning]
  - Documentation `v3` [https://marketplace.gohighlevel.com/docs/ghl/users/users-api-v-3/]. Elle compte des centaines de pages : chercher une information par une requête ciblée sur la page concernée, pas en parcourant toute la documentation
  - Pages utiles : upsert du contact [https://marketplace.gohighlevel.com/docs/ghl/contacts/upsert-contact/], création d'opportunité [https://marketplace.gohighlevel.com/docs/ghl/opportunities/create-opportunity/], pipelines [https://marketplace.gohighlevel.com/docs/ghl/opportunities/get-pipelines/]
  - Observé le 15.09.2026 : `GET https://services.leadconnectorhq.com/opportunities/pipelines?locationId=<GHL_LOCATION_ID>` avec `Authorization: Bearer <GHL_API_TOKEN>` et `Version: v3` répond HTTP 200 avec le token existant
- Mail : SMTP Infomaniak, depuis le domaine
- Libs : Nodemailer [https://nodemailer.com/], `server-only`, déjà dépendance du scaffold [https://nextjs.org/docs/app/getting-started/server-and-client-components]

## 2. Goals and non-goals

### Goals

- La codebase est pensée comme si on on construisait pour un inconnu. Le code est self-explanatory sans commentaires et un inconnu au projet peut le reprendre. Comme pour un lib pensée de manière optimale, il est très facile d'utiliser les modules via leur interface simplifiée, donc l'interface de chaque module est minimale : le module est profond, l'interface simple et "bête". Chaque module se monte et se démonte extrêmement facilement, type plug and play.
- Les modules ne se connaissent pas
- GHL crée un contact et une opportunité GHL, avec leur API `v3`
- Deux mails partent du domaine : le mail transactionnel au client (lead), et le payload en clair que la boîte du domaine s'envoie à elle-même
- Le mail est déclenché par la soumission du formulaire et ne dépend d'aucune réponse de GHL ni de Meta
- La copie en clair dans la boîte du domaine sert de filet et de sink si GHL échoue
- Un écart entre la boîte du domaine et le CRM est saisi à la main dans GHL, **HITL**

- Chaque module associe les valeurs des clés du formulaire à ses propres clés
- Chaque module a un kill switch, exposé au même endroit que `META_CAPI_ENABLED`. Le kill switch est uniquement un outil de développement, destiné à actionner des composants sans déclencher de logique, par exemple pour tester l'UX

- Aucun module n'impose `use client`

### Non-goals

- Essayer de rendre les envois 100% certains. Nous dépendons d'APIs externes, un taux de réussite de 100% est hors de notre contrôle
- Envoi du mail par un workflow GHL, parce que le mail doit partir même quand GHL échoue
- Livraison garantie au-delà du mail, file ou exécution durable, parce que le mail en clair sert de filet et que le cas où lui aussi échoue est jugé trop rare pour porter le design
- Deuxième filet en base de données, parce que le mail suffit aujourd'hui
- Constater sur le moment l'échec de la copie vers la boîte du domaine, parce qu'elle part après la réponse
- Un composant de formulaire à interrupteurs, du type `<Form meta ghl={false} mail />`, parce qu'il connaîtrait tous les modules et que l'absence de l'appel dans la server action dit déjà qu'un module n'est pas utilisé

## 3. The actual design

### Modules

- Un module par service : Meta, GHL, mail
- Un module est un dossier qui expose une seule fonction publique
- Aucun module n'utilise une partie d'un autre : ni normalizer, ni type, ni fonction
- Chaque fichier d'un module importe `server-only`. D'après la doc Next, « if you try to import the module into a Client Component, there will be a build-time error » [https://nextjs.org/docs/app/getting-started/server-and-client-components]

### Interface

Les noms des fonctions publiques GHL et mail sont provisoires.

| Module | Fonction publique              | Avant de rendre la main                 | Confié à `after()`                | Rend                               |
| ------ | ------------------------------ | --------------------------------------- | --------------------------------- | ---------------------------------- |
| Meta   | `capture(event, form_data?)`   | écrit le cookie `meta_identity`         | l'envoi de l'événement            | un résultat typé                   |
| GHL    | `deliver_to_ghl(form_data)`    | rien                                    | le contact, puis l'opportunité    | un résultat typé                   |
| Mail   | `send_confirmation(form_data)` | envoie le mail transactionnel et attend | la copie vers la boîte du domaine | le résultat du mail transactionnel |

- La server action n'appelle pas `after()`, chaque module l'appelle lui-même. La doc Next le permet : « you can create utility functions that wrap `after` calls to add additional functionality » [https://nextjs.org/docs/app/api-reference/functions/after]
- Le travail qu'un module confie à `after()` est prévu pour ne pas rejeter
- Une fonction publique retourne un résultat typé sans lever d'erreur. Codes d'échec : `refused`, `unreachable`, `disabled`
- Pas de code `misconfigured` : chaque module est configuré et testé avant la production, **HITL**
- Observation sur le module Meta existant : « `capture` never throws in production and returns a discriminated result [...]. Outside production, a conversion that carries no matching identifier beyond the IP and the user agent throws » [https://github.com/s-e-r-n/scaffold-nextjs-app_x_meta/blob/main/README.md]

```ts
// warn:PSEUDO-CODE

"use server";

export const submit_lead = async (form_data: FormData) => {
  await capture("Lead", form_data);
  deliver_to_ghl(form_data);
  const confirmation = await send_confirmation(form_data);
  if (!confirmation.ok) return { status: "failed" };
  redirect("/confirmation");
};
```

| Résultat du mail transactionnel        | Server action                                 |
| -------------------------------------- | --------------------------------------------- |
| envoyé                                 | redirige vers `/confirmation`                 |
| `refused`, `unreachable` ou `disabled` | rend `{ status: "failed" }`, sans redirection |

- La server action ne connaît pas le kill switch : un mail coupé est un échec comme les autres
- `redirect()` reste hors de tout `try`. D'après la doc Next, « `redirect` throws an error so it should be called **outside** the `try` block when using `try/catch` statements » [https://nextjs.org/docs/app/api-reference/functions/redirect]

### Kill switch, montage, démontage

- Un flag par module dans `.env.example` : `META_CAPI_ENABLED`, `GHL_ENABLED`, `MAIL_ENABLED`, les deux derniers noms provisoires
- Même règle que le module Meta : « optional, `false` makes the whole module inert. Absent means enabled » [https://github.com/s-e-r-n/scaffold-nextjs-app_x_meta/blob/main/README.md]
- Chaque module lit son propre flag avec son propre code
- Un module coupé ne fait pas d'appel réseau, ne confie rien à `after()` et retourne `{ ok: false, code: "disabled" }`
- Un formulaire utilise un module quand sa server action appelle la fonction publique de ce module
- Monter un module : son dossier, ses variables d'environnement, l'appel dans la server action. Démonter : retirer les trois

### Exécution, par service

| Service | Opération                                               | Quand                     |
| ------- | ------------------------------------------------------- | ------------------------- |
| Mail    | mail transactionnel, de la boîte Infomaniak au prospect | avant la réponse, attendu |
| Meta    | écriture du cookie `meta_identity`                      | avant la réponse          |
| Mail    | payload en clair, de la boîte du domaine vers elle-même | après la réponse          |
| Meta    | envoi de l'événement                                    | après la réponse          |
| GHL     | contact, puis opportunité                               | après la réponse          |

- D'après la doc Next, `after()` planifie un travail « to be executed after a response (or prerender) is finished », et il « will be executed even if the response didn't complete successfully. Including when an error is thrown or when `notFound` or `redirect` is called » [https://nextjs.org/docs/app/api-reference/functions/after]
- Le cookie `meta_identity` est écrit avant la réponse. D'après la doc Next, « HTTP does not allow setting cookies after streaming starts » [https://nextjs.org/docs/app/api-reference/functions/cookies]

### Durées

| Appel                                | Quand            | Réglage                                                                                            |
| ------------------------------------ | ---------------- | -------------------------------------------------------------------------------------------------- |
| SMTP, mail transactionnel            | avant la réponse | `connectionTimeout`, `greetingTimeout`, `socketTimeout`, `dnsTimeout`, 10 s chacun                 |
| SMTP, copie vers la boîte du domaine | après la réponse | `connectionTimeout`, `greetingTimeout`, `socketTimeout`, `dnsTimeout`, 10 s chacun                 |
| POST de l'événement Meta             | après la réponse | existant : « 5000 ms per attempt, three attempts, 1 s then 2 s between them » [README du scaffold] |
| GHL, contact                         | après la réponse | 10 s                                                                                               |
| GHL, opportunité                     | après la réponse | 10 s                                                                                               |

- Sans valeur explicite, Nodemailer attend 120000 ms pour `connectionTimeout` et 600000 ms pour `socketTimeout` [https://nodemailer.com/smtp]. D'après leurs descriptions, chaque réglage borne une étape, donc un envoi complet peut dépasser 10 s
- D'après la doc Next, « `after` will run for the platform's default or configured max duration of your route » [https://nextjs.org/docs/app/api-reference/functions/after]. D'après la doc Vercel, l'échéance « includes request processing and asynchronous `waitUntil` tasks » [https://vercel.com/docs/functions/functions-api-reference/vercel-functions-package]
- Pour une server action, la durée maximale se règle au niveau de la page : « set the `maxDuration` at the page level to change the default timeout of all Server Actions used on the page » [https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/maxDuration]

### Correspondance des clés

- Le formulaire porte les clés d'un dictionnaire stable. Le dictionnaire et la boucle de conversion vivent dans le contrat du formulaire, qui n'est aucun des modules
- Une clé du dictionnaire est le nom de champ défini par le standard HTML pour l'attribut `autocomplete`, quand il existe. Sinon, c'est une clé maison
- Clé maison `freetext` : tous les champs de texte libre la partagent, pour que GHL les reçoive dans un seul custom field
- Chaque module a sa table, de la clé de son service vers la clé du dictionnaire : `em = email`. Un même champ peut alimenter plusieurs clés, une clé absente de la table est ignorée par le module
- Une valeur dérivée de plusieurs champs est une fonction nommée à côté de la table
- La même boucle convertit dans chaque module, sans `switch` ni chaîne de `if` par service
- La table du module mail couvre toutes les clés du dictionnaire, pour que la copie vers la boîte du domaine porte tout le formulaire
- Les clés gardent les tirets du standard, parce que le navigateur les lit

Clés standard retenues, sens selon le standard [https://html.spec.whatwg.org/multipage/form-control-infrastructure.html]

| Clé              | Sens                                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `given-name`     | « Given name (in some Western cultures, also known as the first name) »                                                        |
| `family-name`    | « Family name (in some Western cultures, also known as the last name or surname) »                                             |
| `email`          | « Email address »                                                                                                              |
| `tel`            | « Full telephone number, including country code »                                                                              |
| `organization`   | « Company name corresponding to the person, address, or contact information in the other fields associated with this field »   |
| `postal-code`    | « Postal code, post code, ZIP code, CEDEX code [...] »                                                                         |
| `address-level2` | « [...] this would typically be the city, town, village, or other locality within which the relevant street address is found » |

### Règles du module Meta qui changent

À l'implémentation, chaque changement est une ligne du `project-level-past-decisions-log.md` du template.

| Règle actuelle                                                                                    | Source                                                 | Nouvelle règle                                                                |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------- |
| « Le `name` d'un input **est** la clé Meta. Pas de table de correspondance, pas de synonyme »     | `Desktop/meta-capi/meta_capi_design_doc.md`, section 3 | le `name` d'un input est une clé du dictionnaire, convertie par la table Meta |
| « `Field`, in `src/components/field.tsx`, renders one labelled input whose `name` is a Meta key » | README du scaffold                                     | `Field` est typé sur les clés du dictionnaire                                 |
| « L'envoi est attendu là où `capture` est appelée, quel que soit le déclencheur »                 | `Desktop/meta-capi/meta_capi_design_doc.md`, section 2 | `capture` écrit `meta_identity`, confie l'envoi à `after()` et rend la main   |

## 4. Data shape

### In, depuis le formulaire

La donnée d'entrée est la saisie de l'utilisateur. Elle arrive dans la server
action telle qu'il l'a tapée, sans validation ni normalisation.

| Origine                 | Forme à l'arrivée                                                    | Qui la lit                  |
| ----------------------- | -------------------------------------------------------------------- | --------------------------- |
| saisie de l'utilisateur | `FormData`, une entrée par champ, la clé est une clé du dictionnaire | chaque module, par sa table |

- Aucune valeur n'est garantie : un champ peut être absent, vide, ou contenir n'importe quelle chaîne. Chaque module normalise lui-même
- D'après MDN, `get()` « returns the first value associated with a given key », et renvoie `null` sans correspondance. `getAll()` lit toutes les valeurs d'une clé [https://developer.mozilla.org/en-US/docs/Web/API/FormData/get]. `freetext` peut porter plusieurs valeurs

### Out, par destination

| Destination                         | Forme du payload    | Module              |
| ----------------------------------- | ------------------- | ------------------- |
| Meta                                | hashé               | Meta CAPI, existant |
| GHL                                 | en clair            | GHL                 |
| Boîte du domaine à boîte du domaine | en clair            | mail                |
| Boîte mail du client                | mail transactionnel | mail                |

## 5. APIs

### GHL `v3`

- Base : `https://services.leadconnectorhq.com`, observée le 15.09.2026, section 1
- Headers : `Authorization: Bearer <GHL_API_TOKEN>`, `Version: v3`, `Content-Type: application/json`, `Accept: application/json`, les deux derniers repris du code existant [`page-demonstration-waveprom/submission-delivery/adapters/gohighlevel-destination.ts:78-83`]
- Variables d'environnement : `GHL_API_TOKEN`, `GHL_LOCATION_ID`, `GHL_PIPELINE_ID`, `GHL_PIPELINE_STAGE_ID`, repris de `page-demonstration-waveprom/.env.example`, et l'id du custom field `freetext`, nom de variable à décider
- L'upsert du contact précède la création d'opportunité, qui exige `contactId`

`POST /contacts/upsert` [https://marketplace.gohighlevel.com/docs/ghl/contacts/upsert-contact/]

« Requis par GHL : non » veut seulement dire que l'appel n'échoue pas sans ce champ, pas que l'agence n'en a pas besoin.

| Champ GHL      | Requis par GHL | Valeur envoyée                                 |
| -------------- | -------------- | ---------------------------------------------- |
| `locationId`   | oui            | `GHL_LOCATION_ID`                              |
| `firstName`    | non            | clé `given-name`                               |
| `lastName`     | non            | clé `family-name`                              |
| `email`        | non            | clé `email`                                    |
| `phone`        | non            | clé `tel`                                      |
| `companyName`  | non            | clé `organization`                             |
| `postalCode`   | non            | clé `postal-code`                              |
| `city`         | non            | clé `address-level2`                           |
| `customFields` | non            | `[{ id, fieldValue }]`, pour la clé `freetext` |

- Réponse 200 documentée : `{ new, contact: { id, ... }, traceId }`
- Le schéma liste `id`, `key` et `fieldValue` pour un item de `customFields`, sans décrire `key`. Le module envoie `id` et `fieldValue`, la forme de l'exemple de la page création d'opportunité

`POST /opportunities/` [https://marketplace.gohighlevel.com/docs/ghl/opportunities/create-opportunity/]

| Champ GHL         | Requis par GHL | Valeur envoyée                                   |
| ----------------- | -------------- | ------------------------------------------------ |
| `pipelineId`      | oui            | `GHL_PIPELINE_ID`                                |
| `locationId`      | oui            | `GHL_LOCATION_ID`                                |
| `name`            | oui            | valeur dérivée : `given-name` puis `family-name` |
| `pipelineStageId` | non            | `GHL_PIPELINE_STAGE_ID`                          |
| `status`          | oui            | `"open"`                                         |
| `contactId`       | oui            | `contact.id` rendu par l'upsert                  |

- Réponse 201 documentée : `{ opportunity: { id, ... } }`
- La réponse de GHL à une opportunité en double n'a été trouvée dans aucune page consultée

### Mail, SMTP Infomaniak

- Serveur, d'après Infomaniak : « mail.infomaniak.com », port « 465 » en « SSL / TLS (implicit) » ou « 587 » en « STARTTLS (explicit) », « username = full email address » [https://www.infomaniak.com/en/support/faq/468/understanding-mail-server-ports-and-protocols]
- D'après Vercel : « Vercel blocks port 25 for outgoing connections, while ports 465 and 587 stay open » [https://vercel.com/kb/guide/sending-emails-from-an-application-on-vercel]
- Variables d'environnement : `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, et l'adresse de la boîte du domaine, repris de `page-demonstration-waveprom/.env.example`
- Champs du message [https://nodemailer.com/message] :

| Mail                  | `from`           | `to`             | `replyTo`        | `subject` | `text`                          |
| --------------------- | ---------------- | ---------------- | ---------------- | --------- | ------------------------------- |
| transactionnel        | boîte du domaine | clé `email`      | boîte du domaine | à rédiger | à rédiger                       |
| copie vers le domaine | boîte du domaine | boîte du domaine | clé `email`      | à rédiger | toutes les clés du dictionnaire |

- `replyTo` repris du code existant [`page-demonstration-waveprom/submission-delivery/config/emails.ts:12,38`]

### Meta

- Existant, inchangé : `POST https://graph.facebook.com/<version>/<dataset_id>/events` [`Desktop/meta-capi/meta_capi_design_doc.md`, section 3]

## 6. Tests

| Ce que le test vérifie                                                                                                            | Rouge d'abord |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| La table du module mail couvre toutes les clés du dictionnaire                                                                    | oui           |
| Un travail confié à `after()` qui rejette n'empêche pas le travail confié à `after()` par un autre module, non documenté par Next | oui           |

### Test e2e, en fin d'implémentation, **HITL**

- Le test e2e est configuré avec l'humain. Il envoie de vrais événements, avec les modules testés non coupés
- Avant le test, le custom field `freetext` est créé dans GHL, **HITL**
- Un seul test : une seule soumission qui remplit chaque champ du dictionnaire, donc un seul upsert de contact et une seule création d'opportunité
- À vérifier dans GHL : le contact porte chaque champ envoyé, et l'opportunité est rattachée à ce contact, dans le pipeline et l'étape configurés
- Pas de relance : si le test échoue, la suite est décidée par l'humain, **HITL**
- Le module Meta n'est pas testé tant que l'humain ne le demande pas, **HITL**
