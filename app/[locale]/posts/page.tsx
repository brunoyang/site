import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default async function PostsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("PostsPage");
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen p-8 bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {t("title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-10">
          {t("description")}
        </p>

        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {locale === "zh" ? post.titleZh : post.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {locale === "zh" ? post.excerptZh : post.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  {post.author} · {post.date}
                </span>
                <Link
                  href={`/${locale}/posts/${post.id}`}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium"
                >
                  {t("readMore")} →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
