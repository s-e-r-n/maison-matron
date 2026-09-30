import type { ReactNode } from "react";

type face_props = { children: ReactNode };

const Face = ({ children }: face_props) => (
  <span className="flex min-h-[58px] min-w-[216px] items-center justify-center bg-principal px-12 py-[18px] text-center font-display text-[20px] leading-[22px] text-white italic">
    {children}
  </span>
);

type call_to_action_props = {
  children: ReactNode;
  href?: `#${string}`;
};

export const CallToAction = ({ children, href }: call_to_action_props) =>
  href ? (
    <a
      href={href}
      className="inline-block max-w-full border border-principal p-[2px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current max-md:mx-auto max-md:block max-md:w-fit"
    >
      <Face>{children}</Face>
    </a>
  ) : (
    <button
      type="submit"
      className="inline-block max-w-full border border-principal p-[2px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
    >
      <Face>{children}</Face>
    </button>
  );

type details_props = { children: ReactNode };

export const CallToActionDetails = ({ children }: details_props) => (
  <div className="mt-3 text-[13px] max-md:mx-auto max-md:w-fit">
    <ul className="inline-block list-inside list-['❊_'] text-left align-top md:inline-flex md:gap-x-1">
      {children}
    </ul>
  </div>
);

export const CallToActionDetail = ({ children }: details_props) => (
  <li className="marker:text-gray-500 md:first:list-none">
    <small className="text-[1em] text-gray-500">{children}</small>
  </li>
);
