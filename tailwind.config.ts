import { createTailwindConfig } from "@charcoal-ui/tailwind-config";
import { dark, light } from "@charcoal-ui/theme";

export default createTailwindConfig({
  version: "v3",
  theme: {
    ":root": light,
    "@media (prefers-color-scheme: dark)": dark,
  },
});
