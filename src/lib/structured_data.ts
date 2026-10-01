import { opengraph_image_path } from "@/lib/landing_metadata";
import { at_origin } from "@/lib/site_origin";

const home = at_origin("/");
const business_id = `${home}#business`;

const service_offer = (name: string) => ({
  "@type": "Offer",
  itemOffered: { "@type": "Service", name },
});

const structured_data = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${home}#website`,
      url: home,
      name: "Maison Matron",
      inLanguage: "fr-CH",
      publisher: { "@id": business_id },
    },
    {
      "@type": "LocalBusiness",
      "@id": business_id,
      name: "Maison Matron",
      alternateName: "Atelier Tapissier Matron",
      slogan:
        "Maison Matron, artisan tapissier & ébéniste depuis 4 générations",
      description:
        "Maison Matron, artisans tapissiers et ébénistes depuis 4 générations",
      url: home,
      logo: at_origin("/apple-icon.png"),
      image: [
        at_origin(opengraph_image_path),
        at_origin("/home/visuals/5-chaises.jpg"),
        at_origin("/home/visuals/canape-lions.jpg"),
        at_origin("/home/visuals/chaises-blanches.jpg"),
        at_origin("/home/visuals/buffet.jpg"),
        at_origin("/home/visuals/chaise-bleue.jpg"),
        at_origin("/home/visuals/armoire.jpg"),
      ],
      telephone: "+41 21 539 46 75",
      email: "info@maison-matron.ch",
      foundingDate: "1921",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Route de Gilly 15",
        postalCode: "1183",
        addressLocality: "Bursins",
        addressRegion: "VD",
        addressCountry: "CH",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 46.453539,
        longitude: 6.29284,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          opens: "09:00",
          closes: "17:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Sunday",
          opens: "00:00",
          closes: "00:00",
        },
      ],
      areaServed: { "@type": "AdministrativeArea", name: "Suisse romande" },
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
        {
          "@type": "OfferCatalog",
          name: "Services",
          itemListElement: [
            {
              "@type": "OfferCatalog",
              name: "Tapissier décorateur",
              itemListElement: [
                service_offer("Meubles"),
                service_offer("Réparations générales"),
                service_offer("Restauration"),
                service_offer("Tapisserie d'ameublement"),
                service_offer("Réfection de fauteuils anciens"),
                service_offer("Réfection de canapés"),
                service_offer("Retapissage de chaises"),
                service_offer("Conseil et choix de tissus à domicile"),
              ],
            },
            {
              "@type": "OfferCatalog",
              name: "Artisanat",
              itemListElement: [
                service_offer("Mobilier sur mesure, pièce unique"),
                service_offer("Expertise de mobilier à domicile (offert)"),
                service_offer("Transport et livraison de vos pièces (offert)"),
                service_offer("Collaboration avec décorateurs d'intérieur"),
              ],
            },
            {
              "@type": "OfferCatalog",
              name: "Atelier de menuiserie",
              itemListElement: [
                service_offer("Chaises sur mesure en bois suisse"),
                service_offer("Restauration de meubles anciens"),
                service_offer("Finitions et entretien des bois"),
                service_offer("Ébénisterie d'art"),
              ],
            },
          ],
        },
      ],
      sameAs: ["https://www.instagram.com/maisonmatron/"],
    },
  ],
};

export const structured_data_json = JSON.stringify(structured_data).replace(
  /</g,
  "\\u003c",
);
