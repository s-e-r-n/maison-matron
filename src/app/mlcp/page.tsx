import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales et confidentialité",
  robots: { index: false },
};

const LegalNotice = () => (
  <main className="flex max-w-prose flex-col gap-4 px-4 py-8 text-sm text-gray-600 sm:px-8">
    <h1 className="underline">Mentions légales</h1>
    <p>
      Le site maison-matron.ch est édité par Atelier Tapissier Matron,
      entreprise individuelle inscrite au registre du commerce du canton de
      Vaud, dont le siège est à Bursins.
    </p>
    <p>Adresse : Route de Gilly 15, 1183 Bursins, Suisse</p>
    <p>Numéro IDE : CHE-483.644.964</p>
    <p>Contact : info@maison-matron.ch</p>
    <h1 className="underline">Politique de confidentialité</h1>
    <p>
      Le responsable du traitement est Atelier Tapissier Matron (Maison Matron),
      Route de Gilly 15, 1183 Bursins, Suisse. Pour toute question relative à
      vos données : info@maison-matron.ch.
    </p>
    <h2 className="underline">Données traitées</h2>
    <p>
      Nous traitons les données que vous nous transmettez par le formulaire,
      soit vos coordonnées et le contenu de votre demande, ainsi que des données
      techniques liées à votre visite, comme votre adresse IP, des informations
      sur votre navigateur, les pages consultées et, le cas échéant, des
      identifiants enregistrés dans des cookies. Vous pouvez refuser les cookies
      en paramétrant votre navigateur.
    </p>
    <h2 className="underline">Finalités</h2>
    <p>
      Ces données servent à répondre à votre demande et à en assurer le suivi, à
      protéger le formulaire contre les abus, à établir des statistiques de
      fréquentation et à mesurer l'efficacité de nos publicités.
    </p>
    <h2 className="underline">Destinataires</h2>
    <p>
      Nous faisons appel à des prestataires pour l'hébergement du site, l'envoi
      de courriels et de messages, la gestion de la relation client et la
      protection du formulaire. Certaines données sont également transmises à
      des plateformes publicitaires.
    </p>
    <h2 className="underline">Communication à l'étranger</h2>
    <p>
      Ces destinataires peuvent traiter des données hors de Suisse, notamment
      dans l'Union européenne et aux États-Unis. Ces communications reposent sur
      une décision d'adéquation du Conseil fédéral ou, à défaut, sur des
      garanties contractuelles reconnues, telles que des clauses contractuelles
      types.
    </p>
  </main>
);

export default LegalNotice;
