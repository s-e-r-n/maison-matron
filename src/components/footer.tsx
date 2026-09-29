import Image from "next/image";
import logo from "../../public/brand/maison-matron-logo-complete.svg";

export const Footer = () => (
  <footer className="page-width py-12 lg:py-16">
    <div className="copy-inset flex flex-col items-start gap-4 md:items-center md:text-center">
      <Image
        src={logo}
        alt="Maison Matron, 1921"
        className="block h-auto w-[200px] max-w-full"
      />
      <address className="not-italic">
        Route de Gilly 15
        <br />
        1183 Bursins
      </address>
    </div>
  </footer>
);
