import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

interface Chapter {
    id: number;
    status: string;
    audio_path: string | null;
    audio_url?: string | null;
}

interface Book {
    id: number;
    title: string;
    author: string | null;
    status: string;
    chapters: Chapter[];
}

interface Props {
    books: Book[];
    flash?: {
        success?: string;
    };
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
};

export default function Index({ books }: Props) {
    const { flash } = usePage<{ flash: { success?: string, error?: string } }>().props;
    const [fileName, setFileName] = useState('');

    const { data, setData, post, processing, progress, errors, reset } =
        useForm({
            title: '',
            author: '',
            pdf: null as File | null,
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/books', {
            onSuccess: () => {
                reset();
                setFileName('');
            },
        });
    };

    const handleDelete = (bookId: number, bookTitle: string) => {
        if(window.confirm(`Are you sure you want to delete the book "${bookTitle}"? This will permanently erase the book and all its related files.`)) {
            router.delete(`/books/${bookId}`, {
                preserveScroll: true,
            });
        }
    }

    return (
        <>
            <Head title="Books" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {flash?.success && (
                    <div className="rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
                        {flash.success}
                    </div>
                )}

                <div className="rounded-xl border p-6">
                    <h2 className="mb-4 text-lg font-semibold">
                        Upload a Book
                    </h2>
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4"
                    >
                        <input
                            type="text"
                            placeholder="Book Title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="rounded border px-4 py-2"
                        />
                        {errors.title && (
                            <p className="text-sm text-red-500">
                                {errors.title}
                            </p>
                        )}

                        <input
                            type="text"
                            placeholder="Author"
                            value={data.author}
                            onChange={(e) => setData('author', e.target.value)}
                            className="rounded border px-4 py-2"
                        />
                        {errors.author && (
                            <p className="text-sm text-red-500">
                                {errors.author}
                            </p>
                        )}

                        <label className="cursor-pointer rounded border px-4 py-2 text-sm">
                            Choose PDF
                            <input
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    setData('pdf', file);
                                    setFileName(file ? file.name : '');
                                }}
                            />
                        </label>
                        {errors.pdf && (
                            <p className="text-sm text-red-500">{errors.pdf}</p>
                        )}
                        {fileName && (
                            <p className="text-sm text-gray-500">{fileName}</p>
                        )}

                        <button
                            type="submit"
                            disabled={processing}
                            className={`rounded px-4 py-2 font-bold text-white ${processing ? 'cursor-not-allowed bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'}`}
                        >
                            {processing ? 'Uploading...' : 'Create Book'}
                        </button>

                        {progress && (
                            <div className="mt-2 h-2.5 w-full rounded-full bg-gray-200">
                                <div
                                    className="h-2.5 rounded-full bg-blue-600"
                                    style={{ width: `${progress.percentage}%` }}
                                ></div>
                            </div>
                        )}
                    </form>
                </div>

                <div className="rounded-xl border p-6">
                    <h2 className="mb-4 text-lg font-semibold">My Books</h2>
                    {books.length === 0 ? (
                        <p className="text-sm text-gray-500">
                            No books yet. Upload a PDF to get started.
                        </p>
                    ) : (
                        <ul className="flex flex-col gap-3">
                            {books.map((book) => (
                                <li
                                    key={book.id}
                                    className="rounded-xl border p-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <strong>{book.title}</strong>
                                        {book.author && (
                                            <span className="text-sm text-gray-500">
                                                {' '}
                                                — {book.author}
                                            </span>
                                        )}
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[book.status] ?? 'bg-gray-100 text-gray-800'}`}
                                        >
                                            {book.status}
                                        </span>
                                    </div>
                                    <div className="mt-1 text-sm text-gray-500">
                                        {book.chapters.length} chapter(s)
                                        {book.chapters[0]?.status ===
                                            'completed' && (
                                            <div className="mt-2">
                                                <audio
                                                    src={
                                                        book.chapters[0]
                                                            .audio_url ?? ''
                                                    }
                                                    controls
                                                    className="mt-1 w-full"
                                                />

                                                <a
                                                    href={
                                                        book.chapters[0]
                                                            .audio_url ?? ''
                                                    }
                                                    download
                                                    className="mt-1 block text-xs text-blue-500"
                                                >
                                                    Download Audio
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 flex justify-end border-t border-gray-100 pt-3">
                                        <button
                                            onClick={() => handleDelete(book.id, book.title)}
                                            className="rounded bg-red-500 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                                        >
                                            Delete Book
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Books',
            href: '/books',
        },
    ],
};
