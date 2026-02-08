import { useTranslations } from 'next-intl';
import ContactForm from './ContactForm';

const TURNSTILE_SITE_KEY = '0x4AAAAAACZQex4NDR_h9o_j';

export default function ContactPage() {
  const t = useTranslations('ContactPage');

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-16 px-4">
      <div className="max-w-lg mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{t('description')}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <ContactForm
            siteKey={TURNSTILE_SITE_KEY}
            labels={{
              name: t('fieldName'),
              email: t('fieldEmail'),
              message: t('fieldMessage'),
              submit: t('submit'),
              submitting: t('submitting'),
              success: t('success'),
              error: t('error'),
            }}
          />
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          🛡️ {t('protected')}
        </p>
      </div>
    </div>
  );
}
