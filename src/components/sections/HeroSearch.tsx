import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { hero } from "~/content/site";
import { ArrowRightIcon, SearchNormalIcon } from "~/components/icons/Icons";
import s from "./HeroSearch.module.css";

/** The platform's core action, right in the hero: search goes straight into the free icon browser. */
export function HeroSearch() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate({ to: "/icons", search: q ? { q } : {} });
  };

  return (
    <div className={s.wrap}>
      <form className={s.form} role="search" onSubmit={submit}>
        <SearchNormalIcon size={20} className={s.icon} />
        <label className="sr-only" htmlFor="hero-search">
          Search icons
        </label>
        <input
          id="hero-search"
          className={s.input}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={hero.search.placeholder}
          autoComplete="off"
          spellCheck={false}
        />
        <button type="submit" className={s.go} aria-label="Search">
          <ArrowRightIcon size={18} />
        </button>
      </form>
      <p className={s.popular}>
        <span>{hero.search.popularLabel}</span>
        {hero.search.popular.map((term) => (
          <Link key={term} to="/icons" search={{ q: term }} className={s.chip}>
            {term}
          </Link>
        ))}
      </p>
    </div>
  );
}
