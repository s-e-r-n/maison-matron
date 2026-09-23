import Image from "next/image";
import { CallToAction } from "@/components/call_to_action";
import { CenteredSection } from "@/components/centered_section";
import { Field } from "@/components/field";
import { Hero } from "@/components/hero";
import { LeadForm } from "@/components/lead_form";
import { LeadSheet } from "@/components/lead_sheet";
import { SideVisualSection } from "@/components/side_visual_section";
import { SectionSubtitle, SectionTitle } from "@/components/typography";
import { Watermarked } from "@/components/watermarked";
import { WideVisualSection } from "@/components/wide_visual_section";
import archival_photo from "../../public/visuals/archival-photo-man-leading-horse.jpg";
import pine_chairs from "../../public/visuals/chaises-pin-japonais.png";
import yellow_chair from "../../public/visuals/yellow-chair-white-bg.png";

const Home = () => (
  <main>
    <Hero>
      <CallToAction href="#booking">L'atelier vient à vous</CallToAction>
    </Hero>

    <Watermarked>
      <div className="page-width flex flex-col gap-24 py-12 lg:gap-32 lg:py-16">
        <CenteredSection>
          <SectionTitle>Vous cherchez la pièce à votre image, or…</SectionTitle>
          <p>Le luxe perd du caractère et le bon goût devient consensus.</p>
          <p>La marque décide jusqu'où va votre « sur-mesure ».</p>
          <p>L'unique est éclipsé par les collections à la mode.</p>
        </CenteredSection>

        <SideVisualSection
          visual={
            <Image
              src={archival_photo}
              alt="Photographie d'archive en noir et blanc : un homme en gilet et chemise aux manches retroussées tient un cheval par la longe, devant une bâtisse."
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          }
        >
          <SectionTitle>
            Maison Matron, artisan depuis 4 générations
          </SectionTitle>
          <SectionSubtitle>20'000 pièces, pour 5'000 clients.</SectionSubtitle>
          <p>
            Depuis un siècle, notre savoir-faire façonne des objets, travaillés
            à la main et habillés des plus beaux tissus.
          </p>
          <p>
            Nos tapissiers, ébénistes et courtepointières sont unis par une
            unique valeur :
          </p>
          <p>Ennoblir chaque pièce qui nous est confiée.</p>
        </SideVisualSection>

        <WideVisualSection
          visual={
            <Image
              src={pine_chairs}
              alt="Deux fauteuils médaillon en bois naturel, garnis d'un tissu écru brodé de branches de pin rouges, sur fond clair."
              sizes="100vw"
            />
          }
        >
          <SectionTitle>Le vrai sur-mesure</SectionTitle>
          <p>
            Velours de Gênes, lin, coton : sélectionnez vos matières, couleurs
            et motifs préférés.
          </p>
          <p>Choisissez les finitions bois que vous trouvez les plus belles.</p>
          <p>
            Vous aimeriez plus encore ? Vous pouvez passer commande en atelier.
          </p>
          <p>
            Nous nous assurerons que vos pièces résonnent avec qui vous êtes.
          </p>
        </WideVisualSection>

        <SideVisualSection
          visual={
            <Image
              src={yellow_chair}
              alt="Fauteuil Voltaire en bois blond, garni d'un velours à feuillage jaune sur fond gris, sur fond blanc."
              sizes="(min-width: 1024px) 50vw, 100vw"
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
          <p>Nous vous conseillons dans le détail :</p>
          <p>
            les matériaux se choisissent selon la vie passée et future de votre
            objet.
          </p>
          <p>
            Si vous le souhaitez, nous examinons le reste de votre mobilier :
          </p>
          <p>
            la santé des bois et des matières et ce qui vaut la peine d'être
            restauré.
          </p>
        </SideVisualSection>

        <WideVisualSection
          action={
            <CallToAction href="#booking">Je réserve ma visite</CallToAction>
          }
        >
          <SectionTitle>Le processus &amp; la restitution</SectionTitle>
          <p>Le jour même, nous emportons vos pièces.</p>
          <p>Soyez serein, tout transport est à la charge de La Maison.</p>
          <p>Nous vous tenons informé durant tout le processus de réfection.</p>
          <p>
            Lorsque les artisans ont terminé, nous fixons avec vous le jour et
            l'heure de restitution.
          </p>
          <p>
            Enfin, nous vous dévoilons chaque ouvrage : unique et à votre image.
          </p>
        </WideVisualSection>

        <SideVisualSection
          action={
            <LeadForm className="flex flex-col items-start gap-10">
              <Field
                name="email"
                label="Votre adresse courriel"
                className="w-full"
              />
              <CallToAction>S'abonner aux 4 privilèges</CallToAction>
            </LeadForm>
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
          <p>30 jours avant chacune, nous vous dévoilons une exclusivité.</p>
        </SideVisualSection>

        <CenteredSection>
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
        </CenteredSection>

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
    </Watermarked>
  </main>
);

export default Home;
