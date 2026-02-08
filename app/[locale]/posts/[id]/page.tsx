import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostById } from "@/lib/posts";
import { incrementViewCount } from "@/lib/views";
import { trackPostRead } from "@/lib/analytics";
import AiSummary from "./AiSummary";

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations("PostsPage");
  const [post, views] = await Promise.all([
    getPostById(id),
    incrementViewCount(id),
    trackPostRead({ postId: id, locale, path: `/${locale}/posts/${id}` }),
  ]);

  if (!post) notFound();

  return (
    <div className="min-h-screen p-8 bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-3xl mx-auto">
        <Link
          href={`/${locale}/posts`}
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium mb-8 inline-block"
        >
          {t("backToList")}
        </Link>

        <article className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            {locale === "zh" ? post.titleZh : post.title}
          </h1>
          <div className="text-sm text-gray-400 mb-6 flex items-center gap-3">
            <span>{post.author} · {post.date}</span>
            {views > 0 && (
              <span>· {t("views", { count: views })}</span>
            )}
          </div>
          <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
            {locale === "zh" ? post.contentZh : post.content}
          </div>
          <AiSummary
            postId={post.id}
            locale={locale}
            label={t("aiSummary")}
            loadingLabel={t("aiSummaryLoading")}
            titleLabel={t("aiSummaryTitle")}
          />
        </article>
      </div>
    </div>
  );
}
