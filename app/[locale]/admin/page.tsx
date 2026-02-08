import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { getAllPosts } from '@/lib/posts';
import { requireAuth, logout } from '@/lib/auth';
import AdminClient from './AdminClient';

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requireAuth(locale);

  const t = await getTranslations('AdminPage');
  const posts = await getAllPosts();

  async function logoutAction() {
    'use server';
    await logout();
    redirect(`/${locale}/admin/login`);
  }

  return (
    <div className="min-h-screen p-8 bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {t('title')}
          </h1>
          <form action={logoutAction}>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
        <AdminClient
          initialPosts={posts}
          messages={{
            newPost: t('newPost'),
            editPost: t('editPost'),
            deletePost: t('deletePost'),
            save: t('save'),
            cancel: t('cancel'),
            confirmDelete: t('confirmDelete'),
            fieldTitle: t('fieldTitle'),
            fieldTitleZh: t('fieldTitleZh'),
            fieldExcerpt: t('fieldExcerpt'),
            fieldExcerptZh: t('fieldExcerptZh'),
            fieldContent: t('fieldContent'),
            fieldContentZh: t('fieldContentZh'),
            fieldAuthor: t('fieldAuthor'),
            fieldDate: t('fieldDate'),
          }}
        />
      </div>
    </div>
  );
}
