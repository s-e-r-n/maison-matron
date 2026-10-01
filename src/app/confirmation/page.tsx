import Image from "next/image";
import { cn } from "@/lib/utils";
import red_sofa from "../../../public/visuals/canape-rouge-2.jpg";
import styles from "./page.module.css";

const Confirmation = () => (
  <main className="relative flex min-h-svh flex-col md:items-center md:justify-center md:px-8 md:py-12">
    <div className="relative h-[40svh] shrink-0 md:absolute md:inset-0 md:h-auto">
      <Image
        src={red_sofa.src}
        alt=""
        fill
        loading="eager"
        sizes="(min-width: 48rem) 100vw, (orientation: portrait) 60vh, 100vw"
        className="object-cover"
      />
    </div>
    <div
      className={cn(
        styles.paper,
        "relative w-full flex-1 bg-sheet px-[35px] py-10 md:max-w-[640px] md:flex-none md:p-12 lg:p-16",
      )}
    >
      <h1 className="mb-8 font-display text-[24px] leading-[1.15] italic lg:text-[28px]">
        Dernières étapes pour confirmer votre formulaire&nbsp;:
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
      <p className="mt-8 font-display text-[20px] leading-[1.3] italic">
        Chaleureuses salutations,
        <br />- MM
      </p>
    </div>
  </main>
);

export default Confirmation;
