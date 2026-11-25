import { Link } from "@tanstack/react-router";
import { blogAuthor, formatDate, type BlogPost } from "~/content/blog";
import { Avatar } from "~/components/ui/Avatar";
import { cx } from "~/lib/cx";
import s from "./Blog.module.css";

/** The post's share image (public/og/blog-<slug>.png, from npm run social), used as its cover too. */
export const blogImage = (slug: string) => `/og/blog-${slug}.png`;

export function BlogCover({ post, eager }: { post: BlogPost; eager?: boolean }) {
  return (
    <img
      className={s.cover}
      src={blogImage(post.slug)}
      alt=""
      width={1200}
      height={630}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}

/** Writer and date, flush with the card's text. */
export function Byline({ post, withTime }: { post: BlogPost; withTime?: boolean }) {
  return (
    <p className={s.byline}>
      <Avatar initial="P" image={blogAuthor.avatar} size="sm" className={s.avatar} />
      <span className={s.author}>{blogAuthor.name}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      {withTime && (
        <>
          <span aria-hidden="true">·</span>
          {post.minutes} min read
        </>
      )}
    </p>
  );
}

/** One post in the list. `featured` lays it out wide, image beside the text. */
export function BlogCard({ post, featured }: { post: BlogPost; featured?: boolean }) {
  return (
    <Link to="/blog/$slug" params={{ slug: post.slug }} className={cx(s.card, featured && s.featured)}>
      <div className={s.thumb}>
        <BlogCover post={post} eager={featured} />
      </div>
      <div className={s.cardBody}>
        <p className={s.meta}>
          <span className={s.tag}>{post.tag}</span>
          {post.minutes} min read
        </p>
        <h2 className={s.cardTitle}>{post.title}</h2>
        {featured && <p className={s.excerpt}>{post.description}</p>}
        <Byline post={post} />
      </div>
    </Link>
  );
}
