import Image from "next/image";
import secondary_icon from "../../../../public/refection/brand/secondary-icon.svg";
import terciary_icon from "../../../../public/refection/brand/terciary-icon.svg";

export const SectionSeparator = () => (
  <div
    aria-hidden="true"
    className="copy-inset @container -my-13.5 py-3 lg:-my-17.5"
  >
    <div className="flex justify-center gap-[min(16px,calc(100cqw*16/324))] opacity-30 [&_img]:size-[min(52px,calc(100cqw*52/324))]">
      <Image src={secondary_icon} alt="" />
      <Image src={terciary_icon} alt="" className="rotate-45" />
      <Image src={secondary_icon} alt="" />
      <Image src={terciary_icon} alt="" className="rotate-45" />
      <Image src={secondary_icon} alt="" />
    </div>
  </div>
);
