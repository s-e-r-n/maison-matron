import Image from "next/image";
import { CallToAction } from "@/components/call_to_action";
import { CenteredSection } from "@/components/centered_section";
import { Field } from "@/components/field";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { LeadSheet } from "@/components/lead_sheet";
import { SideVisualSection } from "@/components/side_visual_section";
import { SectionSubtitle, SectionTitle } from "@/components/typography";
import { Watermarked } from "@/components/watermarked";
import { WideVisualSection } from "@/components/wide_visual_section";
import five_chairs from "../../public/visuals/5-chaises.jpg";
import archival_photo from "../../public/visuals/archival-photo-man-leading-horse.jpg";
import sideboard from "../../public/visuals/buffet.jpg";
import lion_sofa from "../../public/visuals/canape-lions.jpg";
import blue_chair from "../../public/visuals/chaise-bleue.jpg";
import pine_chairs from "../../public/visuals/chaises-pin-japonais.jpg";
import upholstery_tool from "../../public/visuals/outil.jpg";

const Home = () => (
  <main>
    <Hero>
      <CallToAction href="#booking">L'atelier vient à vous</CallToAction>
    </Hero>

    <Watermarked>
      <div className="page-width flex flex-col gap-24 py-12 lg:gap-32 lg:py-16">
        <CenteredSection>
          <SectionTitle>Vous cherchez la pièce à votre image, or…</SectionTitle>
          <p>La marque décide jusqu'où va votre « sur-mesure ».</p>
          <p>L'unique est éclipsé par les collections à la mode.</p>
          <p>Nous ne sommes pas d'accord avec ça.</p>
        </CenteredSection>

        <SideVisualSection
          visual={
            <Image
              src={archival_photo}
              alt="Photographie d'archive en noir et blanc : un homme en gilet et chemise aux manches retroussées tient un cheval par la longe, devant une bâtisse."
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          }
          action={
            <CallToAction href="#booking">Je réserve ma visite</CallToAction>
          }
        >
          <SectionTitle>
            Maison Matron, artisan depuis 4 générations
          </SectionTitle>
          <p>
            Depuis un siècle, notre savoir-faire façonne des objets, travaillés
            à la main et habillés des plus beaux tissus.
          </p>
          <p>
            Nos tapissiers, ébénistes et courtepointières sont unis par une
            unique valeur :
          </p>
          <SectionSubtitle>
            Ennoblir chaque pièce qui nous est confiée.
          </SectionSubtitle>
        </SideVisualSection>

        <WideVisualSection
          visual={
            <Image
              src={five_chairs}
              alt="Une petite chaise laquée blanc au dossier enroulé et quatre chaises traîneau en bois, garnies d'un même tissu bleu à motif de cercles, sur fond blanc."
              sizes="100vw"
            />
          }
          action={
            <CallToAction href="#booking">Je réserve ma visite</CallToAction>
          }
        >
          <SectionTitle>Le vrai sur-mesure</SectionTitle>
          <p>
            Velours de Gênes, lin, coton : sélectionnez vos matières, couleurs
            et motifs préférés.
          </p>
          <p>Choisissez les finitions bois que vous trouvez les plus belles.</p>
          <p>
            Nous nous assurerons que vos pièces résonnent avec qui vous êtes.
          </p>
        </WideVisualSection>

        <CenteredSection
          action={
            <CallToAction href="#booking">Je réserve ma visite</CallToAction>
          }
        >
          <SectionTitle>Le dernier chaisier de Suisse</SectionTitle>
          <SectionSubtitle>
            Depuis 1908, son atelier assemble à l'ancienne un bois de la région,
            qui a rarement voyagé plus de 100 km.
          </SectionSubtitle>
          <p>Profitez de deux savoir-faire centenaires pour votre chaise.</p>
        </CenteredSection>

        <WideVisualSection
          visual={
            <Image
              src={upholstery_tool}
              alt="Un tire-sangle en bois posé sur un rouleau de sangle de jute, sur fond de toile."
              sizes="100vw"
            />
          }
          action={
            <CallToAction href="#booking">Je réserve ma visite</CallToAction>
          }
        >
          <SectionTitle>L'atelier vient à vous, et c'est offert</SectionTitle>
          <p>
            Quel que soit votre projet, nous venons d'abord en discuter avec
            vous.
          </p>
          <p>
            Un tissu doit être vu, touché, et jugé à la lumière de chez vous.
          </p>
          <SectionSubtitle>
            Nous vous conseillons dans le détail :
          </SectionSubtitle>
          <p>
            les matériaux se choisissent selon la vie passée et future de votre
            objet.
          </p>
          <SectionSubtitle>
            Si vous le souhaitez, nous examinons le reste de votre mobilier :
          </SectionSubtitle>
          <p>
            la santé des bois et des matières et ce qui vaut la peine d'être
            restauré.
          </p>
        </WideVisualSection>

        <WideVisualSection
          visual={
            <Image
              src={lion_sofa}
              alt="Canapé en bois aux accoudoirs sculptés de têtes de lion, garni d'un tissu orangé à rayures ivoire, sur fond blanc."
              sizes="100vw"
            />
          }
          action={
            <CallToAction href="#booking">Je réserve ma visite</CallToAction>
          }
        >
          <SectionTitle>Le processus &amp; la restitution</SectionTitle>
          <p>Le jour même, nous emportons vos pièces.</p>
          <p>
            Soyez serein, tout transport est à la charge de <em>La Maison</em>.
          </p>
          <p>Nous vous tenons informé durant tout le processus de réfection.</p>
          <p>
            Lorsque les artisans ont terminé, nous fixons avec vous le jour et
            l'heure de restitution.
          </p>
          <p>
            Enfin, nous vous dévoilons chaque ouvrage :
            <br />
            unique et à votre image.
          </p>
        </WideVisualSection>

        <WideVisualSection
          visual={
            <div className="grid gap-4 *:h-auto *:w-full md:grid-cols-2">
              <Image
                src={pine_chairs}
                alt="Deux fauteuils médaillon en bois naturel, garnis d'un tissu écru brodé de branches de pin rouges, sur fond clair."
                sizes="(min-width: 768px) 50vw, 100vw"
              />
              <Image
                src={sideboard}
                alt="Buffet bas en bois veiné, trois tiroirs et deux portes, sur fond blanc."
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
          }
          action={
            <CallToAction href="#booking">Je réserve ma visite</CallToAction>
          }
        >
          <SectionTitle>4 saisons, 4 privilèges</SectionTitle>
          <p>Chaque saison a son toucher : le velours l'hiver, le lin l'été.</p>
          <p>
            Chaque saison a sa lumière : dorée à l'automne, renaissante au
            printemps.
          </p>
          <p>
            Chaque saison a son lieu : un chalet sous la neige, une pergola face
            à l'océan.
          </p>
          <p>Avant chacune, profitez d'une exclusivité.</p>
        </WideVisualSection>

        <SideVisualSection
          visual={
            <Image
              src={blue_chair}
              alt="Fauteuil à haut dossier en bois sombre, garni d'un tissu bleu chiné, avec son coussin de tête, sur fond blanc."
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          }
          action={
            <CallToAction href="#booking">Je réserve ma visite</CallToAction>
          }
        >
          <SectionTitle>
            Vous travaillez avec un décorateur d'intérieur ?
          </SectionTitle>
          <p>C'est parfait, car nos métiers d'art fonctionnent en symbiose.</p>
          <p>
            Il nous transmet sa vision, nous apportons nos 100 ans d'artisanat.
          </p>
          <p>
            Nous échangeons directement avec lui, vous n'avez rien à organiser.
          </p>
        </SideVisualSection>

        <LeadSheet
          id="booking"
          title={
            <SectionTitle>L'atelier vient à vous, c'est offert.</SectionTitle>
          }
          send="Je réserve ma visite"
        >
          <Field name="given-name" label="Votre prénom" />
          <Field name="family-name" label="Votre nom de famille" />
          <Field name="email" label="Votre email" />
          <Field name="tel" label="Votre numéro de téléphone" />
          <Field name="postal-code" label="Votre code postal" />
          <Field
            name="freetext"
            label="Votre projet, en quelques mots"
            className="col-span-full mt-3"
          />
        </LeadSheet>
      </div>
      <Footer />
    </Watermarked>
  </main>
);

export default Home;
