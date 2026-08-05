import { Head } from '@inertiajs/react';
import Layout from '@/Layouts/Layout';

export default function Index({ books }) {
    return (
        <Layout>
            <Head title="Books" />
            <div className="p-6 bg-white border-b border-gray-200">
                <h1 className="text-2xl font-bold mb-4">Books</h1>

                {books.length === 0 ? (
                    <div className="text-gray-600">No books yet. Add one through your database or later UI.</div>
                ) : (
                    <ul>
                        {books.map((book) => (
                            <li key={book.id} className="mb-2">
                                <strong>{book.title}</strong>
                                {book.author ? ` — ${book.author}` : ''}
                                <span className="ml-2 text-sm text-gray-500">{book.status}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </Layout>
    );
}
