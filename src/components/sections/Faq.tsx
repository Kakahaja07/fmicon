import { faq } from "~/content/site";
import { Accordion, AccordionItem } from "~/components/ui/Accordion";
import { Container } from "~/components/ui/Container";
import { Reveal } from "~/components/ui/Reveal";
import s from "./Faq.module.css";
import { titleCase } from "~/lib/titleCase";

export function Faq() {
  return (
    <section id="faq" className={s.section} aria-labelledby="faq-title">
      <Container className={s.inner}>
        <Reveal>
          <h2 id="faq-title" className={s.title}>
            {titleCase(faq.title)}
          </h2>
          <Accordion>
            {faq.items.map((item) => (
              <AccordionItem key={item.q} question={item.q}>
                {item.a}
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Container>
    </section>
  );
}
