import { useForm, Head, usePage } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import { useState } from "react";

export default function Index({ books }) {
    const { flash } = usePage().props;
    const [fileName, setFileName] = useState("");

    // 1. Initialize the useForm hook with your input keys
    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        author: "",
        pdf: null,
    });

    // 2. Handle form submission via XHR
    const handleSubmit = (e) => {
        e.preventDefault();

        post("/books", {
            // Clears local string state and resets useForm inputs on success
            onSuccess: () => {
                reset();
                setFileName("");
            },
        });
    };

    return (
        <Layout>
            <Head title="Books" />

            {flash?.success && (
                <div className="w-full max-w-md mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                    {flash.success}
                </div>
            )}

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 transition-all duration-300 hover:shadow-2xl mb-6 flex flex-col items-center justify-center">
                {/* 3. Switch back to a standard HTML form tag linked to your handler */}
                <form
                    onSubmit={handleSubmit}
                    className="mb-6 w-full flex flex-col items-center justify-center space-y-4"
                >
                    <input
                        type="text"
                        name="title"
                        value={data.title}
                        placeholder="Book Title"
                        onChange={(e) => setData("title", e.target.value)}
                        className="w-full border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.title && (
                        <div className="text-red-500 text-xs self-start">
                            {errors.title}
                        </div>
                    )}

                    <input
                        type="text"
                        name="author"
                        value={data.author}
                        placeholder="Author"
                        onChange={(e) => setData("author", e.target.value)}
                        className="w-full border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.author && (
                        <div className="text-red-500 text-xs self-start">
                            {errors.author}
                        </div>
                    )}

                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50">
                        Choose PDF
                        <input
                            type="file"
                            name="pdf"
                            accept="application/pdf"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                setData("pdf", file); // Save the actual file object to form data
                                setFileName(file ? file.name : "");
                            }}
                        />
                    </label>
                    {errors.pdf && (
                        <div className="text-red-500 text-xs self-start">
                            {errors.pdf}
                        </div>
                    )}

                    {fileName && (
                        <div className="mt-2 text-sm text-slate-600">
                            {fileName}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={processing}
                        className={`w-full font-bold py-2 px-4 rounded text-white transition-all ${
                            processing
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-700"
                        }`}
                    >
                        {processing ? "Uploading Book..." : "Create Book"}
                    </button>
                </form>
            </div>

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 transition-all duration-300 hover:shadow-2xl">
                <h1 className="text-2xl font-bold mb-4">Books</h1>

                {books.length === 0 ? (
                    <div className="text-gray-500 text-center py-4 border border-gray-200 rounded bg-gray-50 text-sm font-medium">
                        No books yet. Add one through your database or later UI.
                    </div>
                ) : (
                    <ul>
                        {books.map((book) => (
                            <li
                                key={book.id}
                                className="mb-2 border border-gray-200 rounded p-2 hover:bg-gray-50 transition-all duration-300"
                            >
                                <div className="flex items-center justify-between">
                                    <strong>{book.title}</strong>
                                    {book.author ? ` — ${book.author}` : ""}
                                    <span className="ml-2 text-sm text-gray-500 px-2 py-1 rounded-full bg-gray-100">
                                        {book.status}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                    {book.chapters.length} chapter(s)
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </Layout>
    );
}
