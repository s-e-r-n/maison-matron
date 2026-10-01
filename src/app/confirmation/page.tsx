import Image from "next/image";
import red_sofa from "../../../public/visuals/canape-rouge.jpg";

const Confirmation = () => (
  <main className="relative flex min-h-svh items-center justify-center px-[35px] py-12 md:px-8">
    <Image
      src={red_sofa}
      alt=""
      fill
      sizes="100vw"
      className="hidden object-cover md:block"
    />
    <div className="relative w-full max-w-[640px] bg-paper md:p-12 lg:p-16">
      <h1 className="mb-8 font-display text-[30px] leading-[1.1] italic lg:text-[36px]">
        Dernières étapes pour confirmer votre formulaire :
      </h1>
      <div className="flex flex-col gap-4 text-[17px] leading-[1.45]">
        <p>
          1. Suivez-nous sur{" "}
          <a
            href="https://www.instagram.com/maisonmatron/"
            className="text-blue-700 underline underline-offset-2 hover:text-blue-900"
          >
            Instagram
          </a>{" "}
          pour découvrir nos réalisations.
        </p>
        <p>
          2. Consultez votre mail de confirmation (vérifiez votre dossier spam)
          et enregistrez le numéro{" "}
          <span className="whitespace-nowrap">+41 76 220 35 48</span> sous
          "Maison Matron" dans vos contacts.
        </p>
      </div>
      <p className="mt-8 text-[17px] leading-[1.45]">
        Chaleureuses salutations,
        <br />- MM
      </p>
    </div>
  </main>
);

export default Confirmation;
