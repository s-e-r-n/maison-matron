import Image from "next/image";
import { LogoRow, LogoRows } from "@/components/logo_rows";
import casal_logo from "../../../public/refection/fabric-logos/casal.svg";
import christian_lacroix_logo from "../../../public/refection/fabric-logos/christian-lacroix.png";
import dedar_logo from "../../../public/refection/fabric-logos/dedar.svg";
import edmond_petit_logo from "../../../public/refection/fabric-logos/edmond-petit.png";
import hermes_logo from "../../../public/refection/fabric-logos/hermes.svg";
import lelievre_logo from "../../../public/refection/fabric-logos/lelievre-paris.svg";
import nobilis_logo from "../../../public/refection/fabric-logos/nobilis.svg";
import pierre_frey_logo from "../../../public/refection/fabric-logos/pierre-frey.svg";
import ralph_lauren_logo from "../../../public/refection/fabric-logos/ralph-lauren.svg";
import five_chairs from "../../../public/refection/visuals/5-chaises.jpg";
import archival_photo from "../../../public/refection/visuals/archival-photo-man-leading-horse.jpg";
import secretary from "../../../public/refection/visuals/armoire.jpg";
import sideboard from "../../../public/refection/visuals/buffet.jpg";
import lion_sofa from "../../../public/refection/visuals/canape-lions.jpg";
import blue_chair from "../../../public/refection/visuals/chaise-bleue.jpg";
import white_chairs from "../../../public/refection/visuals/chaises-blanches.jpg";
import upholstery_tool from "../../../public/refection/visuals/outil.jpg";
import red_silk_velvet from "../../../public/refection/visuals/red-silk-velvet.jpg";
import {
  CallToAction,
  CallToActionDetail,
  CallToActionDetails,
} from "./_components/call_to_action";
import { CenteredSection } from "./_components/centered_section";
import { Field } from "./_components/field";
import { Footer } from "./_components/footer";
import { Hero } from "./_components/hero";
import { LeadSheet } from "./_components/lead_sheet";
import { ReviewsSection } from "./_components/reviews_section";
import { SectionSeparator } from "./_components/section_separator";
import { SideVisualSection } from "./_components/side_visual_section";
import {
  Caption,
  Quote,
  Reviewer,
  SectionSubtitle,
  SectionTitle,
} from "./_components/typography";
import { Watermarked } from "./_components/watermarked";
import { WideVisualSection } from "./_components/wide_visual_section";

const Refection = () => (
  <main>
    <Hero>
      <CallToAction href="#booking">Votre expertise offerte</CallToAction>
      <CallToActionDetails>
        <CallToActionDetail>Visite chez vous</CallToActionDetail>
        <CallToActionDetail>Examen de votre mobilier</CallToActionDetail>
        <CallToActionDetail>Devis</CallToActionDetail>
      </CallToActionDetails>
    </Hero>

    <Watermarked>
      <div className="page-width flex flex-col gap-24 py-12 lg:gap-32 lg:py-16 [&_:is(p,li):not(.font-display)]:text-gray-600">
        <CenteredSection>
          <SectionTitle>Vous cherchez la pièce à votre image, or…</SectionTitle>
          <p>La marque décide jusqu'où va votre « sur-mesure ».</p>
          <p>L'unique est éclipsé par les collections à la mode.</p>
          <p>Le choix des tissus vous est limité.</p>
        </CenteredSection>

        <SectionSeparator />

        <SideVisualSection
          visual={
            <figure>
              <Image
                src={archival_photo}
                alt="Photographie d'archive en noir et blanc : un homme en gilet et chemise aux manches retroussées tient un cheval par la longe, devant une bâtisse."
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
              <Caption>Photo d'archive</Caption>
            </figure>
          }
          action={
            <>
              <CallToAction href="#booking">
                Votre expertise offerte
              </CallToAction>
              <CallToActionDetails>
                <CallToActionDetail>Visite chez vous</CallToActionDetail>
                <CallToActionDetail>
                  Examen de votre mobilier
                </CallToActionDetail>
                <CallToActionDetail>Devis</CallToActionDetail>
              </CallToActionDetails>
            </>
          }
        >
          <SectionTitle>
            Maison Matron, artisan depuis 4 générations
          </SectionTitle>
          <p>
            Depuis plus d'un siècle, notre savoir-faire façonne des objets,
            travaillés à la main et habillés des plus beaux tissus.
          </p>
          <p>
            Nos tapissiers, ébénistes et courtepointières sont unis par une
            unique valeur :
          </p>
          <SectionSubtitle>
            Ennoblir chaque pièce qui nous est confiée.
          </SectionSubtitle>
        </SideVisualSection>

        <SectionSeparator />

        <WideVisualSection
          visual={
            <figure>
              <Image
                src={five_chairs}
                alt="Une petite chaise laquée blanc au dossier enroulé et quatre chaises traîneau en bois, garnies d'un même tissu bleu à motif de cercles, sur fond blanc."
                sizes="100vw"
              />
              <Caption>Réalisation Maison Matron</Caption>
            </figure>
          }
          action={
            <>
              <CallToAction href="#booking">
                Votre expertise offerte
              </CallToAction>
              <CallToActionDetails>
                <CallToActionDetail>Visite chez vous</CallToActionDetail>
                <CallToActionDetail>
                  Examen de votre mobilier
                </CallToActionDetail>
                <CallToActionDetail>Devis</CallToActionDetail>
              </CallToActionDetails>
            </>
          }
        >
          <SectionTitle>Le vrai sur-mesure</SectionTitle>
          <p>
            Velours de Gênes, lin, coton : sélectionnez vos matières, couleurs
            et motifs préférés.
          </p>
          <p>Choisissez des finitions bois magnifiques.</p>
          <SectionSubtitle>
            Profitez du dernier chaisier de Suisse
          </SectionSubtitle>
          <p>
            Depuis 1908, chaque chaise est assemblée à l'ancienne, dans des bois
            locaux, de Suisse.
          </p>
          <p>Profitez de deux savoir-faire centenaires pour vos pièces.</p>
        </WideVisualSection>

        <SectionSeparator />

        <SideVisualSection
          visual={
            <figure>
              <Image
                src={red_silk_velvet}
                alt="Velours de soie rouge, coupé et bouclé, tissé de plumes de paon et de fleurs."
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
              <Caption>Velours de soie ciselé</Caption>
            </figure>
          }
          action={
            <>
              <CallToAction href="#booking">
                Votre expertise offerte
              </CallToAction>
              <CallToActionDetails>
                <CallToActionDetail>Visite chez vous</CallToActionDetail>
                <CallToActionDetail>
                  Examen de votre mobilier
                </CallToActionDetail>
                <CallToActionDetail>Devis</CallToActionDetail>
              </CallToActionDetails>
            </>
          }
        >
          <SectionTitle>Profitez de milliers de tissus</SectionTitle>
          <p>Nos collections voyagent avec nous jusqu'à chez vous.</p>
          <p>Ce que vous voulez, nous l'avons.</p>
          <LogoRows>
            <LogoRow>
              <Image
                src={hermes_logo}
                alt="Hermès"
                className="brightness-0 invert-[10.6%]"
              />
              <Image
                src={christian_lacroix_logo}
                alt="Christian Lacroix"
                className="brightness-0 invert-[10.6%]"
              />
              <Image
                src={ralph_lauren_logo}
                alt="Ralph Lauren"
                className="brightness-0 invert-[10.6%]"
              />
              <Image
                src={dedar_logo}
                alt="Dedar"
                className="brightness-0 invert-[10.6%]"
              />
              <Image
                src={lelievre_logo}
                alt="Lelièvre"
                className="brightness-0 invert-[10.6%]"
              />
            </LogoRow>
            <LogoRow>
              <Image
                src={nobilis_logo}
                alt="Nobilis"
                className="brightness-0 invert-[10.6%]"
              />
              <Image
                src={edmond_petit_logo}
                alt="Edmond Petit"
                className="brightness-0 invert-[10.6%]"
              />
              <Image src={pierre_frey_logo} alt="Pierre Frey" />
              <Image
                src={casal_logo}
                alt="Casal"
                className="brightness-0 invert-[10.6%]"
              />
            </LogoRow>
          </LogoRows>
          <p className="italic">Et tant d'autres…</p>
        </SideVisualSection>

        <SectionSeparator />

        <WideVisualSection
          visual={
            <figure>
              <Image
                src={upholstery_tool}
                alt="Un tire-sangle en bois posé sur un rouleau de sangle de jute, sur fond de toile."
                sizes="100vw"
              />
              <Caption>Le tire-sangle du tapissier</Caption>
            </figure>
          }
          action={
            <>
              <CallToAction href="#booking">
                Votre expertise offerte
              </CallToAction>
              <CallToActionDetails>
                <CallToActionDetail>Visite chez vous</CallToActionDetail>
                <CallToActionDetail>
                  Examen de votre mobilier
                </CallToActionDetail>
                <CallToActionDetail>Devis</CallToActionDetail>
              </CallToActionDetails>
            </>
          }
        >
          <SectionTitle>L'atelier vient à vous, et c'est offert</SectionTitle>
          <p>
            Quel que soit votre projet, nous venons d'abord en discuter avec
            vous.
          </p>
          <p>
            Un tissu doit être vu, touché, jugé à la lumière de chez vous et
            accordé à votre intérieur.
          </p>
          <SectionSubtitle>
            Nous vous conseillons dans le détail
          </SectionSubtitle>
          <p>
            Les matériaux se choisissent selon la vie passée et future de votre
            objet.
          </p>
          <SectionSubtitle>Nous examinons votre mobilier</SectionSubtitle>
          <p>
            La santé des bois et des matières et ce qui vaut la peine d'être
            restauré.
          </p>
        </WideVisualSection>

        <SectionSeparator />

        <WideVisualSection
          visual={
            <figure>
              <Image
                src={lion_sofa}
                alt="Canapé en bois aux accoudoirs sculptés de têtes de lion, garni d'un tissu orangé à rayures ivoire, sur fond blanc."
                sizes="100vw"
              />
              <Caption>Réalisation Maison Matron</Caption>
            </figure>
          }
          action={
            <>
              <CallToAction href="#booking">
                Votre expertise offerte
              </CallToAction>
              <CallToActionDetails>
                <CallToActionDetail>Visite chez vous</CallToActionDetail>
                <CallToActionDetail>
                  Examen de votre mobilier
                </CallToActionDetail>
                <CallToActionDetail>Devis</CallToActionDetail>
              </CallToActionDetails>
            </>
          }
        >
          <SectionTitle>Le processus &amp; la restitution</SectionTitle>
          <p>
            Nous prenons en charge le transport de vos pièces dans le plus grand
            soin.
          </p>
          <p>Nous vous tenons informé durant tout le processus de réfection.</p>
          <p>
            Lorsque les artisans ont terminé, nous fixons avec vous le jour et
            l'heure de restitution.
          </p>
          <p>Enfin, nous vous dévoilons chaque ouvrage :</p>
          <SectionSubtitle>unique et à votre image.</SectionSubtitle>
        </WideVisualSection>

        <SectionSeparator />

        <WideVisualSection
          visual={
            <div className="grid gap-4 md:grid-cols-2">
              <figure>
                <Image
                  src={white_chairs}
                  alt="Deux fauteuils médaillon en bois teinté, garnis d'un tissu gris clair à motif géométrique blanc, sur fond blanc."
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
                <Caption>Réalisation Maison Matron</Caption>
              </figure>
              <figure>
                <Image
                  src={sideboard}
                  alt="Buffet bas en bois veiné, trois tiroirs et deux portes, sur fond blanc."
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
                <Caption>Réalisation Maison Matron</Caption>
              </figure>
            </div>
          }
          action={
            <>
              <CallToAction href="#booking">
                Votre expertise offerte
              </CallToAction>
              <CallToActionDetails>
                <CallToActionDetail>Visite chez vous</CallToActionDetail>
                <CallToActionDetail>
                  Examen de votre mobilier
                </CallToActionDetail>
                <CallToActionDetail>Devis</CallToActionDetail>
              </CallToActionDetails>
            </>
          }
        >
          <SectionTitle>4 saisons, 4 privilèges</SectionTitle>
          <div className="space-y-4 md:mx-auto md:w-fit">
            <SectionSubtitle>
              Chaque saison, profitez d'une offre exclusive.
            </SectionSubtitle>
            <ul className="list-inside list-['❊_'] space-y-4 text-left">
              <li>Offres spéciales sur des tissus uniques</li>
              <li>Réductions sur les tissus de saison</li>
              <li>Réductions voisinage</li>
              <li>Entretien des bois</li>
              <li>Révisions offertes</li>
            </ul>
          </div>
        </WideVisualSection>

        <SectionSeparator />

        <WideVisualSection
          visual={
            <div className="grid gap-4 md:grid-cols-2">
              <figure>
                <Image
                  src={blue_chair}
                  alt="Fauteuil à haut dossier en bois sombre, garni d'un tissu bleu chiné, avec son coussin de tête, sur fond blanc."
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
                <Caption>Réalisation Maison Matron</Caption>
              </figure>
              <figure>
                <Image
                  src={secretary}
                  alt="Secrétaire à abattant en bois veiné, un tiroir au-dessus de l'abattant et trois tiroirs en dessous, sur fond blanc."
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
                <Caption>Réalisation Maison Matron</Caption>
              </figure>
            </div>
          }
          action={
            <>
              <CallToAction href="#booking">
                Votre expertise offerte
              </CallToAction>
              <CallToActionDetails>
                <CallToActionDetail>Visite chez vous</CallToActionDetail>
                <CallToActionDetail>
                  Examen de votre mobilier
                </CallToActionDetail>
                <CallToActionDetail>Devis</CallToActionDetail>
              </CallToActionDetails>
            </>
          }
        >
          <SectionTitle>
            Vous travaillez avec un décorateur d'intérieur ?
          </SectionTitle>
          <SectionSubtitle>C'est parfait.</SectionSubtitle>
          <p>Nos métiers d'art fonctionnent en symbiose.</p>
          <p>
            Il nous transmet sa vision, nous apportons nos 100 ans d'artisanat.
          </p>
          <p>Nous échangeons directement, vous gardez un seul interlocuteur.</p>
        </WideVisualSection>

        <SectionSeparator />

        <ReviewsSection
          title={<SectionTitle>Ils nous ont confié leurs pièces</SectionTitle>}
        >
          <figure>
            <blockquote>
              <Quote>
                « Des conseils avisés, une superbe sélection de tissus et un
                savoir-faire minutieux. Nous sommes ravis de nos nouvelles
                chaises et nous ferons sans aucun doute à nouveau appel à M.
                Matron. »
              </Quote>
            </blockquote>
            <Reviewer>- Anne-Claude</Reviewer>
          </figure>
          <figure>
            <blockquote>
              <Quote>
                « Nous avons remis 6 chaises de salon pour mettre une nouvelle
                tapisserie et sommes très satisfaits du résultat. Tissu de
                qualité, finitions impeccables, livraison dans les (courts)
                délais et un contact très agréable et professionnel. Nous
                pouvons recommander Tapissier Matron. »
              </Quote>
            </blockquote>
            <Reviewer>- Stephan</Reviewer>
          </figure>
          <figure>
            <blockquote>
              <Quote>
                « Grand professionnalisme sans oublier une bienveillance et
                sympathie exceptionnelles. »
              </Quote>
            </blockquote>
            <Reviewer>- MP</Reviewer>
          </figure>
          <figure>
            <blockquote>
              <Quote>
                « Je recommande Monsieur Matron qui a effectué une très jolie
                restauration sur mon fauteuil. Travail au top. »
              </Quote>
            </blockquote>
            <Reviewer>- Tony</Reviewer>
          </figure>
          <figure>
            <blockquote>
              <Quote>
                « Je recommande M. Matron, il a restauré mon fauteuil, le
                travail est parfait. »
              </Quote>
            </blockquote>
            <Reviewer>- Trévis</Reviewer>
          </figure>
          <figure>
            <blockquote>
              <Quote>
                « Très bon service, bonne écoute du client, patience le temps
                que le choix soit établi, livraison conforme aux attentes et
                travail très propre. »
              </Quote>
            </blockquote>
            <Reviewer>- Santiago</Reviewer>
          </figure>
          <figure>
            <blockquote>
              <Quote>
                « Je ne puis que recommander la Maison Matron qui est une belle
                entreprise familiale. De bon conseil avec un travail soigné et
                de qualité. Absolument ravie du rendu concernant un vieux
                fauteuil de famille, alors n'hésitez pas et prenez rapidement
                contact avec eux. »
              </Quote>
            </blockquote>
            <Reviewer>- Annick</Reviewer>
          </figure>
          <figure>
            <blockquote>
              <Quote>
                « De sincères remerciements à la famille Matron pour leur
                intervention. Ils ont littéralement sauvé notre enfilade en teck
                qui avait subi des dommages liés à une infiltration. »
              </Quote>
            </blockquote>
            <Reviewer>- Sebastien</Reviewer>
          </figure>
          <figure>
            <blockquote>
              <Quote>
                « Bon contact et bonne expertise. Mon fauteuil a maintenant un
                tissu magnifique ! Il commence sa seconde vie ! Merci. Je
                recommande cet artisan. »
              </Quote>
            </blockquote>
            <Reviewer>- Aline</Reviewer>
          </figure>
          <figure>
            <blockquote>
              <Quote>« Superbe travail ! Merci. »</Quote>
            </blockquote>
            <Reviewer>- Anne</Reviewer>
          </figure>
        </ReviewsSection>

        <SectionSeparator />

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

export default Refection;
