import { Check, IconContext, X } from "@phosphor-icons/react";
import { classNames } from "./utils.ts";

const iconMap = {
  x: <X />,
  check: <Check />,
};

export type IconName = keyof typeof iconMap;

export type IconProps = {
  name: IconName;
  /** Defaults to "context" */
  size?:
    | "context"
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "xxl"
    | "mega"
    | "jumbo";
  weight?: "regular" | "bold" | "light" | "thin" | "fill";
  rotate?: boolean;
  className?: string;
};

function sizeToCssValue(size: IconProps["size"]) {
  switch (size ?? "md") {
    case "context":
      return "1em";
    case "xs":
      return 12;
    case "sm":
      return 16;
    case "md":
      return 20;
    case "lg":
      return 24;
    case "xl":
      return 32;
    case "xxl":
      return 50;
    case "mega":
      return 104;
    case "jumbo":
      return 160;
  }
}

export function Icon({ name, size, weight, className, rotate }: IconProps) {
  return (
    <IconContext.Provider
      value={{
        color: "currentColor",
        size: sizeToCssValue(size),
        weight,
        mirrored: false,
        className: classNames(
          className,
          "tw-flex-none",
          rotate && "tw-transition tw-rotate-180",
        ),
      }}
    >
      {iconMap[name]}
    </IconContext.Provider>
  );
}
