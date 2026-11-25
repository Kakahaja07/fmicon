import { defineComponent, h } from "vue";
import { iconBody } from "./render.js";

export function createIcon(name, icon) {
  return defineComponent({
    name,
    inheritAttrs: false,
    props: {
      size: { type: [Number, String], default: 24 },
      variant: { type: String, default: "linear" },
      color: { type: String, default: undefined },
      strokeWidth: { type: [Number, String], default: undefined },
      title: { type: String, default: undefined },
    },
    setup(props, { attrs }) {
      return () => {
        const labelled = Boolean(props.title || attrs["aria-label"] || attrs["aria-labelledby"]);
        return h("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          width: props.size,
          height: props.size,
          viewBox: "0 0 24 24",
          fill: "none",
          "aria-hidden": labelled ? undefined : "true",
          role: labelled ? "img" : undefined,
          ...attrs,
          innerHTML: iconBody(icon, {
            variant: props.variant,
            color: props.color,
            strokeWidth: props.strokeWidth,
            title: props.title,
          }),
        });
      };
    },
  });
}
