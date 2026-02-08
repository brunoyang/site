import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostById, getAllPosts } from "@/lib/posts";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ id: post.id }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations("PostsPage");
  const post = getPostById(id);

  if (!post) notFound();

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
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
          <div className="text-sm text-gray-400 mb-6">
            {post.author} · {post.date}
          </div>
          <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
            {locale === "zh" ? post.contentZh : post.content}
          </div>
        </article>
      </div>
    </div>
  );
}
