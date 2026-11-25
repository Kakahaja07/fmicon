import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { brand } from "~/content/site";
import { blogAuthor, blogPosts, findPost } from "~/content/blog";
import { BlogCard, BlogCover, Byline, blogImage } from "~/components/blog/BlogCard";
import { Container } from "~/components/ui/Container";
import { pageHead } from "~/lib/iconSeo";
import s from "~/components/blog/Blog.module.css";

const site = brand.siteUrl;

/** /blog/<slug>: one answer-first article, rendered from its HTML file in src/content/blog. */
export const Route = createFileRoute("/_site/blog/$slug")({
  beforeLoad: ({ params }) => {
    if (!findPost(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const post = findPost(params.slug);
    if (!post) return {};
    const url = `${site}/blog/${post.slug}`;
    return pageHead({
      title: post.metaTitle,
      description: post.description,
      path: `/blog/${post.slug}`,
      image: blogImage(post.slug),
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: post.date,
          url,
          mainEntityOfPage: url,
          image: site + blogImage(post.slug),
          author: { "@type": "Person", name: blogAuthor.name, url: site },
          publisher: { "@type": "Organization", name: brand.name, url: site, logo: { "@type": "ImageObject", url: `${site}/favicon.svg` } },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Blog", item: `${site}/blog` },
            { "@type": "ListItem", position: 2, name: post.title, item: url },
          ],
        },
        ...(post.faqLd ? [post.faqLd] : []),
      ],
    });
  },
  component: BlogArticle,
});

function BlogArticle() {
  const { slug } = Route.useParams();
  const post = findPost(slug);
  if (!post) return null;
  const more = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <main className={s.page}>
      <Container>
        <div className={s.layout}>
          <article>
            <header className={s.header}>
              <nav className={s.crumbs} aria-label="Breadcrumb">
                <Link to="/blog">Blog</Link>
                <span aria-hidden="true">/</span>
                <span>{post.tag}</span>
              </nav>
              <h1 className={s.h1}>{post.title}</h1>
              <Byline post={post} withTime />
            </header>

            <div className={s.articleCover}>
              <BlogCover post={post} eager />
            </div>

            {/* Our own article file, written and checked in this repo */}
            <div className={s.prose} dangerouslySetInnerHTML={{ __html: post.html }} />
          </article>

          <nav className={s.toc} aria-label="On this page">
            <p className={s.tocTitle}>On this page</p>
            {post.toc.map((item) => (
              <a key={item.id} href={`#${item.id}`}>
                {item.title}
              </a>
            ))}
          </nav>
        </div>

        <section className={s.more} aria-labelledby="more-title">
          <h2 id="more-title" className={s.moreTitle}>
            Keep Reading
          </h2>
          <div className={s.grid}>
            {more.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}
