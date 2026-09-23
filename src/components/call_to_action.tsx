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
      className="inline-block max-w-full border border-principal p-[2px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
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
