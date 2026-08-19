import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Chapter {
    id: number;
    status: string;
    audio_path: string | null;
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
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const [fileName, setFileName] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
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
                    <h2 className="mb-4 text-lg font-semibold">Upload a Book</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Book Title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="rounded border px-4 py-2"
                        />
                        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}

                        <input
                            type="text"
                            placeholder="Author"
                            value={data.author}
                            onChange={(e) => setData('author', e.target.value)}
                            className="rounded border px-4 py-2"
                        />
                        {errors.author && <p className="text-sm text-red-500">{errors.author}</p>}

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
                        {errors.pdf && <p className="text-sm text-red-500">{errors.pdf}</p>}
                        {fileName && <p className="text-sm text-gray-500">{fileName}</p>}

                        <button
                            type="submit"
                            disabled={processing}
                            className={`rounded py-2 px-4 text-white font-bold ${processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`}
                        >
                            {processing ? 'Uploading...' : 'Create Book'}
                        </button>
                    </form>
                </div>

                <div className="rounded-xl border p-6">
                    <h2 className="mb-4 text-lg font-semibold">My Books</h2>
                    {books.length === 0 ? (
                        <p className="text-sm text-gray-500">No books yet. Upload a PDF to get started.</p>
                    ) : (
                        <ul className="flex flex-col gap-3">
                            {books.map((book) => (
                                <li key={book.id} className="rounded-xl border p-4">
                                    <div className="flex items-center justify-between">
                                        <strong>{book.title}</strong>
                                        {book.author && <span className="text-sm text-gray-500"> — {book.author}</span>}
                                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[book.status] ?? 'bg-gray-100 text-gray-800'}`}>
                                            {book.status}
                                        </span>
                                    </div>
                                    <div className="mt-1 text-sm text-gray-500">
                                        {book.chapters.length} chapter(s)
                                        {book.chapters[0]?.status === 'completed' && (
                                            <div className="mt-2">
                                                <audio
                                                    src={`/storage/${book.chapters[0].audio_path}`}
                                                    controls
                                                    className="w-full mt-1"
                                                />

                                                <a
                                                    href={`/storage/${book.chapters[0].audio_path}`}
                                                    download
                                                    className="text-blue-500 text-xs mt-1 block"
                                                >
                                                    Download Audio
                                                </a>
                                            </div>
                                        )}
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
