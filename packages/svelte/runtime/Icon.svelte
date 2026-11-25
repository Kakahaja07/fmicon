<script>
  import { iconBody } from "fmicon";

  /** Icon data from fmicon, e.g. `lock`. */
  export let icon;
  export let size = 24;
  export let variant = "linear";
  export let color = undefined;
  export let strokeWidth = undefined;
  export let title = undefined;

  $: labelled = Boolean(title || $$restProps["aria-label"] || $$restProps["aria-labelledby"]);
  $: body = iconBody(icon, { variant, color, strokeWidth, title });
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  aria-hidden={labelled ? undefined : "true"}
  role={labelled ? "img" : undefined}
  {...$$restProps}
>{@html body}</svg>
