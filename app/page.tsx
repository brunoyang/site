export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex flex-col gap-8 items-center max-w-4xl">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
            欢迎使用 Cloudflare + Next.js
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            这是一个部署在 Cloudflare Pages 上的 Next.js 应用示例
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-8">
          <FeatureCard
            title="免费托管"
            description="Cloudflare Pages 提供每天 100,000 次免费请求和无限带宽"
            icon="🚀"
          />
          <FeatureCard
            title="全球 CDN"
            description="利用 Cloudflare 的全球网络，为用户提供超快的加载速度"
            icon="🌍"
          />
          <FeatureCard
            title="自动部署"
            description="连接 Git 仓库，每次推送代码自动构建和部署"
            icon="⚡"
          />
          <FeatureCard
            title="边缘计算"
            description="使用 Cloudflare Workers 实现服务端渲染和 API 路由"
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
            查看文档
          </a>
        </div>
      </main>

      <footer className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>由 Next.js 构建 · 部署在 Cloudflare Pages</p>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}
