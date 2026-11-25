import { createFileRoute } from "@tanstack/react-router";
import { brand } from "~/content/site";
import { blogIntro, blogPosts } from "~/content/blog";
import { BlogCard } from "~/components/blog/BlogCard";
import { Container } from "~/components/ui/Container";
import { pageHead } from "~/lib/iconSeo";
import s from "~/components/blog/Blog.module.css";

const site = brand.siteUrl;

export const Route = createFileRoute("/_site/blog/")({
  head: () =>
    pageHead({
      title: `Icon Guides: SVG, React & Accessible Icons | ${brand.name} Blog`,
      description: "Plain-English guides on using icons well: SVG vs PNG, React icons, free SVG icons for websites and accessible icons. Tested on 891 free icons.",
      path: "/blog",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Blog",
          name: `${brand.name} Blog`,
          url: `${site}/blog`,
          blogPost: blogPosts.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            url: `${site}/blog/${p.slug}`,
            datePublished: p.date,
          })),
        },
      ],
    }),
  component: BlogIndex,
});

function BlogIndex() {
  const [featured, ...rest] = blogPosts;
  return (
    <main className={s.page}>
      <Container>
        <header className={s.intro}>
          <p className={s.eyebrow}>{blogIntro.eyebrow}</p>
          <h1 className={s.h1}>{blogIntro.title}</h1>
          <p className={s.sub}>{blogIntro.sub}</p>
        </header>

        <div className={s.grid}>
          <BlogCard post={featured} featured />
          {rest.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </Container>
    </main>
  );
}
