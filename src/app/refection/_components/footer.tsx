import Image from "next/image";
import logo from "../../../../public/brand/maison-matron-logo-complete.svg";

export const Footer = () => (
  <footer className="page-width flex flex-col gap-4 py-12 md:items-center lg:py-16">
    <Image
      src={logo}
      alt="Maison Matron, 1921"
      className="block h-auto w-full max-w-full md:w-[200px]"
    />
    <address className="copy-inset text-gray-600 not-italic md:text-center">
      Route de Gilly 15
      <br />
      1183 Bursins
    </address>
  </footer>
);
