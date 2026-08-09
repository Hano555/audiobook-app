<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Books/Index', [
            'books' => Book::orderBy('created_at', 'desc')->with('chapters')->get(),
        ]);
    }

    /**
     * Store a newly uploaded PDF book.
     */
    public function store(Request $request)
    {
        $request->validate([
            'pdf' => 'required|file|mimes:pdf|max:10240',
            'title' => 'nullable|string|max:255',
            'author' => 'nullable|string|max:255',
        ]);

        $file = $request->file('pdf');
        $path = $file->store('books', 'public');

        Book::create([
            'title' => $request->input('title') ?: pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
            'author' => $request->input('author'),
            'original_filename' => $file->getClientOriginalName(),
            'pdf_path' => $path,
            'status' => 'pending',
        ]);

        return redirect()->back()->with('success', 'PDF uploaded successfully.');
    }
}
