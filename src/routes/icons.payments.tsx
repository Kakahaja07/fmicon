import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "~/components/sections/SiteHeader";
import { SiteFooter } from "~/components/sections/SiteFooter";
import { PaymentLogos, type PaymentSize } from "~/components/sections/icons/PaymentLogos";
import { paymentsHead } from "~/lib/iconSeo";

type PaymentsSearch = { card?: PaymentSize; q?: string };

/** /icons/payments: payment method logos, in the icon library's workspace. A fixed path, so it wins over /icons/$style. */
export const Route = createFileRoute("/icons/payments")({
  validateSearch: (raw: Record<string, unknown>): PaymentsSearch => ({
    card: raw.card === "sm" || raw.card === "lg" ? raw.card : undefined,
    q: typeof raw.q === "string" && raw.q ? raw.q : undefined,
  }),
  head: paymentsHead,
  component: PaymentsPage,
});

function PaymentsPage() {
  const { card = "md", q = "" } = Route.useSearch();
  const navigate = useNavigate();
  return (
    <>
      <SiteHeader />
      <main id="top">
        <PaymentLogos
          size={card}
          query={q}
          onChange={(patch) =>
            navigate({
              to: "/icons/payments",
              // Only non-default choices go into the URL, like the icon pages
              search: (prev: PaymentsSearch) => ({
                card: "size" in patch ? (patch.size === "md" ? undefined : patch.size) : prev.card,
                q: "q" in patch ? patch.q || undefined : prev.q,
              }),
              replace: true,
              resetScroll: false,
            })
          }
        />
      </main>
      <SiteFooter />
    </>
  );
}
