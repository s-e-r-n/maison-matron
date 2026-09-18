import { Field } from "@/components/field";
import { LeadForm } from "@/components/lead_form";

const Home = () => (
  <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
    <h1 className="text-2xl font-semibold">scaffold-nextjs-meta</h1>
    <LeadForm
      className="flex flex-col gap-3"
      failure={<p role="alert">L'envoi a échoué, réessayez dans un instant.</p>}
    >
      <Field
        name="given-name"
        label="Prénom"
        required
        className="flex flex-col gap-1"
      />
      <Field
        name="family-name"
        label="Nom"
        required
        className="flex flex-col gap-1"
      />
      <Field
        name="email"
        label="E-mail"
        required
        className="flex flex-col gap-1"
      />
      <Field name="tel" label="Téléphone" className="flex flex-col gap-1" />
      <Field
        name="organization"
        label="Entreprise"
        className="flex flex-col gap-1"
      />
      <Field
        name="postal-code"
        label="Code postal"
        className="flex flex-col gap-1"
      />
      <Field
        name="address-level2"
        label="Localité"
        className="flex flex-col gap-1"
      />
      <Field name="freetext" label="Message" className="flex flex-col gap-1" />
      <button type="submit" className="self-start">
        Envoyer
      </button>
    </LeadForm>
  </main>
);

export default Home;
