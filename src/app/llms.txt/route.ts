import { site_origin } from "@/lib/site_origin";

const at_origin = (path: string) => new URL(path, site_origin).href;

const llms_txt = `# Maison Matron

> Maison Matron, artisans tapissiers et ébénistes depuis 4 générations

- Artisans tapissiers et ébénistes depuis 4 générations
  - +20'000 pièces
  - +5'000 clients
  - « Des conseils avisés, une superbe sélection de tissus et un savoir-faire minutieux. » - Anne-Claude
- Votre expertise offerte
  - Visite chez vous
  - Examen de votre mobilier
  - Devis
- Vous cherchez la pièce à votre image, or…
  - La marque décide jusqu'où va votre « sur-mesure ».
  - L'unique est éclipsé par les collections à la mode.
  - Le choix des tissus vous est limité.
- Maison Matron, artisan depuis 4 générations
  - Depuis plus d'un siècle, notre savoir-faire façonne des objets, travaillés à la main et habillés des plus beaux tissus.
  - Nos tapissiers, ébénistes et courtepointières sont unis par une unique valeur :
  - Ennoblir chaque pièce qui nous est confiée.
- Le vrai sur-mesure
  - Velours de Gênes, lin, coton : sélectionnez vos matières, couleurs et motifs préférés.
  - Choisissez des finitions bois magnifiques.
  - Profitez du dernier chaisier de Suisse
  - Depuis 1908, chaque chaise est assemblée à l'ancienne, dans des bois locaux, de Suisse.
  - Profitez de deux savoir-faire centenaires pour vos pièces.
- Profitez de milliers de tissus
  - Nos collections voyagent avec nous jusqu'à chez vous.
  - Ce que vous voulez, nous l'avons.
  - Hermès
  - Christian Lacroix
  - Ralph Lauren
  - Dedar
  - Lelièvre
  - Nobilis
  - Edmond Petit
  - Pierre Frey
  - Casal
  - Et tant d'autres…
- L'atelier vient à vous, et c'est offert
  - Quel que soit votre projet, nous venons d'abord en discuter avec vous.
  - Un tissu doit être vu, touché, jugé à la lumière de chez vous et accordé à votre intérieur.
  - Nous vous conseillons dans le détail
    - Les matériaux se choisissent selon la vie passée et future de votre objet.
  - Nous examinons votre mobilier
    - La santé des bois et des matières et ce qui vaut la peine d'être restauré.
- Le processus & la restitution
  - Nous prenons en charge le transport de vos pièces dans le plus grand soin.
  - Nous vous tenons informé durant tout le processus de réfection.
  - Lorsque les artisans ont terminé, nous fixons avec vous le jour et l'heure de restitution.
  - Enfin, nous vous dévoilons chaque ouvrage :
  - unique et à votre image.
- 4 saisons, 4 privilèges
  - Chaque saison, profitez d'une offre exclusive.
    - Offres spéciales sur des tissus uniques
    - Réductions sur les tissus de saison
    - Réductions voisinage
    - Entretien des bois
    - Révisions offertes
- Vous travaillez avec un décorateur d'intérieur ?
  - C'est parfait.
  - Nos métiers d'art fonctionnent en symbiose.
  - Il nous transmet sa vision, nous apportons nos 100 ans d'artisanat.
  - Nous échangeons directement, vous gardez un seul interlocuteur.
- Ils nous ont confié leurs pièces
  - « Des conseils avisés, une superbe sélection de tissus et un savoir-faire minutieux. Nous sommes ravis de nos nouvelles chaises et nous ferons sans aucun doute à nouveau appel à M. Matron. » - Anne-Claude
  - « Nous avons remis 6 chaises de salon pour mettre une nouvelle tapisserie et sommes très satisfaits du résultat. Tissu de qualité, finitions impeccables, livraison dans les (courts) délais et un contact très agréable et professionnel. Nous pouvons recommander Tapissier Matron. » - Stephan
  - « Grand professionnalisme sans oublier une bienveillance et sympathie exceptionnelles. » - MP
  - « Je recommande Monsieur Matron qui a effectué une très jolie restauration sur mon fauteuil. Travail au top. » - Tony
  - « Je recommande M. Matron, il a restauré mon fauteuil, le travail est parfait. » - Trévis
  - « Très bon service, bonne écoute du client, patience le temps que le choix soit établi, livraison conforme aux attentes et travail très propre. » - Santiago
  - « Je ne puis que recommander la Maison Matron qui est une belle entreprise familiale. De bon conseil avec un travail soigné et de qualité. Absolument ravie du rendu concernant un vieux fauteuil de famille, alors n'hésitez pas et prenez rapidement contact avec eux. » - Annick
  - « De sincères remerciements à la famille Matron pour leur intervention. Ils ont littéralement sauvé notre enfilade en teck qui avait subi des dommages liés à une infiltration. » - Sebastien
  - « Bon contact et bonne expertise. Mon fauteuil a maintenant un tissu magnifique ! Il commence sa seconde vie ! Merci. Je recommande cet artisan. » - Aline
  - « Superbe travail ! Merci. » - Anne
- L'atelier vient à vous, c'est offert.
  - Votre prénom
  - Votre nom de famille
  - Votre email
  - Votre numéro de téléphone
  - Votre code postal
  - Votre projet, en quelques mots
  - Je réserve ma visite
- Maison Matron, 1921
  - Route de Gilly 15
  - 1183 Bursins

## Votre expertise offerte

- [Maison Matron](${at_origin("/")}): Maison Matron, artisans tapissiers et ébénistes depuis 4 générations
- [Maison Matron](${at_origin("/refection")}): Maison Matron, artisans tapissiers et ébénistes depuis 4 générations
- [Je réserve ma visite](${at_origin("/#booking")}): L'atelier vient à vous, c'est offert.
- [+41 21 539 46 75](tel:+41215394675)
- [Route de Gilly 15, 1183 Bursins](https://www.google.com/maps/search/?api=1&query=Maison%20Matron%2C%20Route%20de%20Gilly%2015%2C%201183%20Bursins)
`;

export const GET = () =>
  new Response(llms_txt, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
