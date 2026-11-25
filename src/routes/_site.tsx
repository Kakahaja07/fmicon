import { Outlet, createFileRoute } from "@tanstack/react-router";
import { SiteFooter } from "~/components/sections/SiteFooter";
import { SiteHeader } from "~/components/sections/SiteHeader";

/** Layout for marketing pages: header and footer. Full-screen tools (e.g. /icons) live outside it. */
export const Route = createFileRoute("/_site")({
  component: SiteLayout,
});

function SiteLayout() {
  return (
    <>
      <SiteHeader />
      <Outlet />
      <SiteFooter />
    </>
  );
}
