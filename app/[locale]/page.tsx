import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex flex-col gap-8 items-center max-w-4xl">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-8">
          <FeatureCard
            title={t("features.free.title")}
            description={t("features.free.description")}
            icon="🚀"
          />
          <FeatureCard
            title={t("features.cdn.title")}
            description={t("features.cdn.description")}
            icon="🌍"
          />
          <FeatureCard
            title={t("features.deploy.title")}
            description={t("features.deploy.description")}
            icon="⚡"
          />
          <FeatureCard
            title={t("features.edge.title")}
            description={t("features.edge.description")}
            icon="🔧"
          />
        </div>

        <div className="flex gap-4 mt-8">
          <a
            href="https://developers.cloudflare.com/pages/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t("docsLink")}
          </a>
        </div>
      </main>

      <footer className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>{t("footer")}</p>
      </footer>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}
