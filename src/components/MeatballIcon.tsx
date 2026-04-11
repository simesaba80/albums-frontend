import { Icon } from "@charcoal-ui/react";

type MeatballIconProps = {
  className?: string;
};

export function MeatballIcon({ className }: MeatballIconProps) {
  return <Icon name="16/Dot" className={className} aria-hidden="true" />;
}
