import Image from "next/image";
import { AutoplayVideo } from "@/components/autoplay_video";
import { landing_metadata } from "@/lib/landing_metadata";
import { structured_data_json } from "@/lib/structured_data";
import casal_logo from "../../public/fabric-logos/casal.svg";
import christian_lacroix_logo from "../../public/fabric-logos/christian-lacroix.png";
import dedar_logo from "../../public/fabric-logos/dedar.svg";
import edmond_petit_logo from "../../public/fabric-logos/edmond-petit.png";
import hermes_logo from "../../public/fabric-logos/hermes.svg";
import lelievre_logo from "../../public/fabric-logos/lelievre-paris.svg";
import nobilis_logo from "../../public/fabric-logos/nobilis.svg";
import pierre_frey_logo from "../../public/fabric-logos/pierre-frey.svg";
import ralph_lauren_logo from "../../public/fabric-logos/ralph-lauren.svg";
import five_chairs from "../../public/visuals/5-chaises.jpg";
import archival_photo from "../../public/visuals/archival-photo-man-leading-horse.jpg";
import club_armchair from "../../public/visuals/club-armchair.jpg";
import louis_philippe_sofa from "../../public/visuals/louis-philippe.jpg";
import reel_poster from "../../public/visuals/maison-matron-reel-poster.jpg";
import genoa_velvet from "../../public/visuals/velours-gene.jpg";
import voltaire_poster from "../../public/visuals/voltaire-orbital-macro-poster.jpg";
import {
  CallToAction,
  CallToActionDetail,
  CallToActionDetails,
  CallToActions,
} from "./_components/call_to_action";
import { CenteredSection } from "./_components/centered_section";
import { Field } from "./_components/field";
import { Footer } from "./_components/footer";
import { Hero } from "./_components/hero";
import { LeadSheet } from "./_components/lead_sheet";
import { LogoGrid } from "./_components/logo_grid";
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

export const metadata = landing_metadata("/");

const Home = () => (
  <main>
    <Hero>
      <CallToActions>
        <CallToAction href="#booking">Votre expertise offerte</CallToAction>
        <CallToAction href="tel:+41215394675" tone="secondary">
          +41 21 539 46 75
        </CallToAction>
      </CallToActions>
      <CallToActionDetails>
        <CallToActionDetail>Visite chez vous</CallToActionDetail>
        <CallToActionDetail>Évaluation de votre mobilier</CallToActionDetail>
        <CallToActionDetail>Devis</CallToActionDetail>
      </CallToActionDetails>
    </Hero>

    <Watermarked>
      <div className="page-width flex flex-col gap-24 py-12 lg:gap-32 lg:py-16 [&_:is(p,li):not(.font-display)]:text-gray-600">
        <CenteredSection>
          <SectionTitle>
            Nous transformons vos meubles en pièces uniques au monde.
          </SectionTitle>
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
              <CallToActions>
                <CallToAction href="#booking">
                  Votre expertise offerte
                </CallToAction>
                <CallToAction href="tel:+41215394675" tone="secondary">
                  +41 21 539 46 75
                </CallToAction>
              </CallToActions>
              <CallToActionDetails>
                <CallToActionDetail>Visite chez vous</CallToActionDetail>
                <CallToActionDetail>
                  Évaluation de votre mobilier
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
            </figure>
          }
          action={
            <>
              <CallToActions>
                <CallToAction href="#booking">
                  Votre expertise offerte
                </CallToAction>
                <CallToAction href="tel:+41215394675" tone="secondary">
                  +41 21 539 46 75
                </CallToAction>
              </CallToActions>
              <CallToActionDetails>
                <CallToActionDetail>Visite chez vous</CallToActionDetail>
                <CallToActionDetail>
                  Évaluation de votre mobilier
                </CallToActionDetail>
                <CallToActionDetail>Devis</CallToActionDetail>
              </CallToActionDetails>
            </>
          }
        >
          <SectionTitle>De meuble à pièce de collection</SectionTitle>
          <p>
            Nos vastes collections de tissus et notre savoir-faire d'ébéniste
            transforment vos meubles.
          </p>
          <SectionSubtitle>
            Deux savoir-faire centenaires valorisent vos pièces
          </SectionSubtitle>
          <p>Nous travaillons avec le dernier chaisier de Suisse (1908) :</p>
          <p>Il assemble chaque chaise à l'ancienne, dans des bois locaux.</p>
        </WideVisualSection>

        <SectionSeparator />

        <SideVisualSection
          visual={
            <figure>
              <AutoplayVideo
                src="/visuals/maison-matron-reel.mp4"
                poster={reel_poster}
                label="Des chaises en bois garnies d'un tissu bleu, puis un velours rouge à motifs floraux, sous le logo Maison Matron 1921 ; une femme en tailleur blanc assise dans un fauteuil club, avec la phrase « La Haute Couture, pour vos meubles. » ; le logo Maison Matron sur fond noir."
              />
            </figure>
          }
          action={
            <>
              <CallToActions>
                <CallToAction href="#booking">
                  Votre expertise offerte
                </CallToAction>
                <CallToAction href="tel:+41215394675" tone="secondary">
                  +41 21 539 46 75
                </CallToAction>
              </CallToActions>
              <CallToActionDetails>
                <CallToActionDetail>Visite chez vous</CallToActionDetail>
                <CallToActionDetail>
                  Évaluation de votre mobilier
                </CallToActionDetail>
                <CallToActionDetail>Devis</CallToActionDetail>
              </CallToActionDetails>
            </>
          }
        >
          <SectionTitle>Profitez de milliers de tissus</SectionTitle>
          <p>Nos collections voyagent avec nous jusqu'à chez vous.</p>
          <p>Ce que vous voulez, nous l'avons.</p>
          <LogoGrid>
            <Image
              src={hermes_logo}
              alt="Hermès"
              className="w-[54%] brightness-0 invert-[10.6%]"
            />
            <Image
              src={christian_lacroix_logo}
              alt="Christian Lacroix"
              className="w-[69%] brightness-0 invert-[10.6%]"
            />
            <Image
              src={ralph_lauren_logo}
              alt="Ralph Lauren"
              className="w-[85%] brightness-0 invert-[10.6%]"
            />
            <Image
              src={dedar_logo}
              alt="Dedar"
              className="w-[38%] brightness-0 invert-[10.6%]"
            />
            <Image
              src={lelievre_logo}
              alt="Lelièvre"
              className="w-[41%] brightness-0 invert-[10.6%]"
            />
            <Image
              src={nobilis_logo}
              alt="Nobilis"
              className="w-[47%] brightness-0 invert-[10.6%]"
            />
            <Image
              src={edmond_petit_logo}
              alt="Edmond Petit"
              className="w-[68%] brightness-0 invert-[10.6%]"
            />
            <Image
              src={pierre_frey_logo}
              alt="Pierre Frey"
              className="w-[23%]"
            />
            <Image
              src={casal_logo}
              alt="Casal"
              className="w-[29%] brightness-0 invert-[10.6%]"
            />
          </LogoGrid>
          <p className="italic">Et tant d'autres…</p>
        </SideVisualSection>

        <SectionSeparator />

        <WideVisualSection
          visual={
            <figure>
              <Image
                src={genoa_velvet}
                alt="Gros plan d'un velours de Gênes à motif floral : roses et boutons rose corail, feuillage vert sombre en relief, sur fond blanc."
                sizes="100vw"
              />
            </figure>
          }
          action={
            <>
              <CallToActions>
                <CallToAction href="#booking">
                  Votre expertise offerte
                </CallToAction>
                <CallToAction href="tel:+41215394675" tone="secondary">
                  +41 21 539 46 75
                </CallToAction>
              </CallToActions>
              <CallToActionDetails>
                <CallToActionDetail>Visite chez vous</CallToActionDetail>
                <CallToActionDetail>
                  Évaluation de votre mobilier
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
          <SectionSubtitle>Nous évaluons votre mobilier</SectionSubtitle>
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
                src={louis_philippe_sofa}
                alt="Canapé Louis-Philippe en bois sculpté, dossier couronné d'une palmette et accoudoirs en volute, garni d'un tissu ivoire à rayures bordeaux et petits bouquets de fleurs, sur fond blanc."
                sizes="100vw"
              />
            </figure>
          }
          action={
            <>
              <CallToActions>
                <CallToAction href="#booking">
                  Votre expertise offerte
                </CallToAction>
                <CallToAction href="tel:+41215394675" tone="secondary">
                  +41 21 539 46 75
                </CallToAction>
              </CallToActions>
              <CallToActionDetails>
                <CallToActionDetail>Visite chez vous</CallToActionDetail>
                <CallToActionDetail>
                  Évaluation de votre mobilier
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
          <p>
            Nous vous tenons informé durant tout le processus de transformation.
          </p>
          <p>
            Lorsque les artisans ont terminé, nous fixons avec vous le jour et
            l'heure de restitution.
          </p>
          <p>Enfin, nous vous dévoilons chaque ouvrage :</p>
          <SectionSubtitle>unique et à votre image.</SectionSubtitle>
        </WideVisualSection>

        <SectionSeparator />

        <SideVisualSection
          visual={
            <figure>
              <AutoplayVideo
                src="/visuals/voltaire-orbital-macro.mp4"
                poster={voltaire_poster}
                label="Un fauteuil Voltaire en bois clair, garni d'un tissu gris à feuillage de velours jaune d'or, puis un gros plan de ce tissu."
              />
            </figure>
          }
          action={
            <>
              <CallToActions>
                <CallToAction href="#booking">
                  Votre expertise offerte
                </CallToAction>
                <CallToAction href="tel:+41215394675" tone="secondary">
                  +41 21 539 46 75
                </CallToAction>
              </CallToActions>
              <CallToActionDetails>
                <CallToActionDetail>Visite chez vous</CallToActionDetail>
                <CallToActionDetail>
                  Évaluation de votre mobilier
                </CallToActionDetail>
                <CallToActionDetail>Devis</CallToActionDetail>
              </CallToActionDetails>
            </>
          }
        >
          <SectionTitle>4 saisons, 4 privilèges</SectionTitle>
          <SectionSubtitle>
            Chaque saison, profitez d'une offre exclusive.
          </SectionSubtitle>
          <ul className="list-inside list-['❊_'] space-y-4">
            <li>Offres spéciales sur des tissus uniques</li>
            <li>Réductions sur les tissus de saison</li>
            <li>Réductions voisinage</li>
            <li>Entretien des bois</li>
            <li>Révisions offertes</li>
          </ul>
        </SideVisualSection>

        <SectionSeparator />

        <WideVisualSection
          visual={
            <figure>
              <Image
                src={club_armchair}
                alt="Une femme en tailleur blanc et bottines noires, assise jambes croisées dans un fauteuil club blanc aux accotoirs de bois sombre bordés de clous, sur fond blanc."
                sizes="100vw"
              />
            </figure>
          }
          action={
            <>
              <CallToActions>
                <CallToAction href="#booking">
                  Votre expertise offerte
                </CallToAction>
                <CallToAction href="tel:+41215394675" tone="secondary">
                  +41 21 539 46 75
                </CallToAction>
              </CallToActions>
              <CallToActionDetails>
                <CallToActionDetail>Visite chez vous</CallToActionDetail>
                <CallToActionDetail>
                  Évaluation de votre mobilier
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
          form_id="luxe"
          title={
            <SectionTitle>L'atelier vient à vous, c'est offert.</SectionTitle>
          }
          send="Je réserve ma visite"
        >
          <Field name="given-name" label="Votre prénom" />
          <Field name="family-name" label="Votre nom de famille" />
          <Field name="tel" label="Votre numéro de téléphone" />
          <Field name="email" label="Votre email" />
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
    <script type="application/ld+json">{structured_data_json}</script>
  </main>
);

export default Home;
