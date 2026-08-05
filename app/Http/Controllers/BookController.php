<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Inertia\Inertia;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Books/Index', [
            'books' => Book::orderBy('created_at', 'desc')->get(),
        ]);
    }
}
