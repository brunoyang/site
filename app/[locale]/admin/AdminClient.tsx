'use client';

import { useState } from 'react';
import type { Post, PostSummary } from '@/lib/posts';

type Messages = {
  newPost: string;
  editPost: string;
  deletePost: string;
  save: string;
  cancel: string;
  confirmDelete: string;
  fieldTitle: string;
  fieldTitleZh: string;
  fieldExcerpt: string;
  fieldExcerptZh: string;
  fieldContent: string;
  fieldContentZh: string;
  fieldAuthor: string;
  fieldDate: string;
};

type Props = {
  initialPosts: PostSummary[];
  messages: Messages;
};

const emptyForm = (): Omit<Post, 'id'> => ({
  title: '',
  titleZh: '',
  excerpt: '',
  excerptZh: '',
  content: '',
  contentZh: '',
  author: '',
  date: new Date().toISOString().slice(0, 10),
});

export default function AdminClient({ initialPosts, messages: m }: Props) {
  const [posts, setPosts] = useState<PostSummary[]>(initialPosts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Post, 'id'>>(emptyForm());
  const [showForm, setShowForm] = useState(false);

  function openNew() {
    setEditingId(null);
    setForm(emptyForm());
    setShowForm(true);
  }

  async function openEdit(id: string) {
    const res = await fetch(`/api/posts/${id}`);
    const post = await res.json() as Post;
    setEditingId(post.id);
    setForm({
      title: post.title,
      titleZh: post.titleZh,
      excerpt: post.excerpt,
      excerptZh: post.excerptZh,
      content: post.content,
      contentZh: post.contentZh,
      author: post.author,
      date: post.date,
    });
    setShowForm(true);
  }

  async function handleSave() {
    if (editingId) {
      const res = await fetch(`/api/posts/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const updated = await res.json() as Post;
      setPosts(posts.map((p) => (p.id === editingId ? updated : p)));
    } else {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const created = await res.json() as Post;
      setPosts([created, ...posts]);
    }
    setShowForm(false);
  }

  async function handleDelete(id: string) {
    if (!confirm(m.confirmDelete)) return;
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    setPosts(posts.filter((p) => p.id !== id));
  }

  const field = (
    label: string,
    key: keyof Omit<Post, 'id'>,
    multiline = false
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      {multiline ? (
        <textarea
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm font-mono"
          rows={6}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      ) : (
        <input
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm"
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      )}
    </div>
  );

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          onClick={openNew}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
        >
          + {m.newPost}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {editingId ? m.editPost : m.newPost}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field(m.fieldTitle, 'title')}
            {field(m.fieldTitleZh, 'titleZh')}
            {field(m.fieldExcerpt, 'excerpt')}
            {field(m.fieldExcerptZh, 'excerptZh')}
            {field(m.fieldContent, 'content', true)}
            {field(m.fieldContentZh, 'contentZh', true)}
            {field(m.fieldAuthor, 'author')}
            {field(m.fieldDate, 'date')}
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
            >
              {m.save}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg text-sm font-medium"
            >
              {m.cancel}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow flex items-start justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white truncate">
                {post.title}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {post.titleZh}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {post.author} · {post.date}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => openEdit(post.id)}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium"
              >
                {m.editPost}
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg text-xs font-medium"
              >
                {m.deletePost}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
