import { site_origin } from "@/lib/site_origin";

const at_origin = (path: string) => new URL(path, site_origin).href;

const home = at_origin("/");
const business_id = `${home}#business`;

const service_offer = (name: string) => ({
  "@type": "Offer",
  itemOffered: { "@type": "Service", name },
});

const review = (author: string, review_body: string) => ({
  "@type": "Review",
  author: { "@type": "Person", name: author },
  reviewBody: review_body,
});

const structured_data = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${home}#website`,
      url: home,
      name: "Maison Matron",
      inLanguage: "fr",
      publisher: { "@id": business_id },
    },
    {
      "@type": "LocalBusiness",
      "@id": business_id,
      name: "Maison Matron",
      description:
        "Maison Matron, artisans tapissiers et ébénistes depuis 4 générations",
      url: home,
      logo: at_origin("/apple-icon.png"),
      image: [
        at_origin("/home/visuals/5-chaises.jpg"),
        at_origin("/home/visuals/canape-lions.jpg"),
        at_origin("/home/visuals/chaises-blanches.jpg"),
        at_origin("/home/visuals/buffet.jpg"),
        at_origin("/home/visuals/chaise-bleue.jpg"),
        at_origin("/home/visuals/armoire.jpg"),
      ],
      telephone: "+41 21 539 46 75",
      foundingDate: "1921",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Route de Gilly 15",
        postalCode: "1183",
        addressLocality: "Bursins",
        addressCountry: "CH",
      },
      hasMap:
        "https://www.google.com/maps/search/?api=1&query=Maison%20Matron%2C%20Route%20de%20Gilly%2015%2C%201183%20Bursins",
      hasOfferCatalog: [
        {
          "@type": "OfferCatalog",
          name: "Votre expertise offerte",
          itemListElement: [
            service_offer("Visite chez vous"),
            service_offer("Examen de votre mobilier"),
            service_offer("Devis"),
          ],
        },
        {
          "@type": "OfferCatalog",
          name: "4 saisons, 4 privilèges",
          itemListElement: [
            service_offer("Offres spéciales sur des tissus uniques"),
            service_offer("Réductions sur les tissus de saison"),
            service_offer("Réductions voisinage"),
            service_offer("Entretien des bois"),
            service_offer("Révisions offertes"),
          ],
        },
      ],
      review: [
        review(
          "Anne-Claude",
          "Des conseils avisés, une superbe sélection de tissus et un savoir-faire minutieux. Nous sommes ravis de nos nouvelles chaises et nous ferons sans aucun doute à nouveau appel à M. Matron.",
        ),
        review(
          "Stephan",
          "Nous avons remis 6 chaises de salon pour mettre une nouvelle tapisserie et sommes très satisfaits du résultat. Tissu de qualité, finitions impeccables, livraison dans les (courts) délais et un contact très agréable et professionnel. Nous pouvons recommander Tapissier Matron.",
        ),
        review(
          "MP",
          "Grand professionnalisme sans oublier une bienveillance et sympathie exceptionnelles.",
        ),
        review(
          "Tony",
          "Je recommande Monsieur Matron qui a effectué une très jolie restauration sur mon fauteuil. Travail au top.",
        ),
        review(
          "Trévis",
          "Je recommande M. Matron, il a restauré mon fauteuil, le travail est parfait.",
        ),
        review(
          "Santiago",
          "Très bon service, bonne écoute du client, patience le temps que le choix soit établi, livraison conforme aux attentes et travail très propre.",
        ),
        review(
          "Annick",
          "Je ne puis que recommander la Maison Matron qui est une belle entreprise familiale. De bon conseil avec un travail soigné et de qualité. Absolument ravie du rendu concernant un vieux fauteuil de famille, alors n'hésitez pas et prenez rapidement contact avec eux.",
        ),
        review(
          "Sebastien",
          "De sincères remerciements à la famille Matron pour leur intervention. Ils ont littéralement sauvé notre enfilade en teck qui avait subi des dommages liés à une infiltration.",
        ),
        review(
          "Aline",
          "Bon contact et bonne expertise. Mon fauteuil a maintenant un tissu magnifique ! Il commence sa seconde vie ! Merci. Je recommande cet artisan.",
        ),
        review("Anne", "Superbe travail ! Merci."),
      ],
    },
  ],
};

export const structured_data_json = JSON.stringify(structured_data).replace(
  /</g,
  "\\u003c",
);
