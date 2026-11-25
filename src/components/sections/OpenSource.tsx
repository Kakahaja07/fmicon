import { Container } from "~/components/ui/Container";
import { OpenSourcePanel } from "./OpenSourcePanel";
import s from "./OpenSource.module.css";

/** Home page: free and open source, with install code. Same panel as under the icon browser. */
export function OpenSource() {
  return (
    <section id="open-source" className={s.section} aria-labelledby="open-source-title">
      <Container>
        <OpenSourcePanel titleId="open-source-title" />
      </Container>
    </section>
  );
}
