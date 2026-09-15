<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Services\PdfTextExtractor;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
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
            'books' => Book::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->with('chapters')
            ->get()
            ->map(function ($book) {
                $book->chapters->map(function ($chapter) {
                    if ($chapter->audio_path) {
                        $chapter->audio_url = Storage::disk('s3')->temporaryUrl($chapter->audio_path, now()->addHours(1));
                    }
                    return $chapter;
                });
                return $book;
            }),
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
        $path = $file->store('books', 's3');

        $book = Book::create([
            'user_id' => Auth::id(),
            'title' => $request->input('title') ?: pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
            'author' => $request->input('author'),
            'original_filename' => $file->getClientOriginalName(),
            'pdf_path' => $path,
            'status' => 'pending',
        ]);

        //We are extracting the saved PDF book on creation into pdf text using pdf extractor, since PHP natively cannot read PDF files.
        //So first we install the package required for this and then use it to extract uncleaned pdf text and
        //then clean it using regex expressions and then save it and thereafter update the created chapter record and updated the fields with that cleaned text and change the status

        $booktextextractor = new PdfTextExtractor();

        $tempPath = tempnam(sys_get_temp_dir(), 'pdf_');

        file_put_contents($tempPath, Storage::disk('s3')->get($book->pdf_path));

        $chaptertext = $booktextextractor->extract($tempPath);

        unlink($tempPath);

        $book->chapters()->first()->update([
            'text_content' => $chaptertext,
            'status'       => 'pending',
        ]);


        return redirect()->back()->with('success', 'PDF uploaded successfully.');
    }

    public function destroy(Book $book){

        $disk = Storage::disk('s3');

        if($book->pdf_path && $disk->exists($book->pdf_path)){
            $disk->delete($book->pdf_path);
        }

        $disk->deleteDirectory('chunks/book_' . $book->id);

        $disk->deleteDirectory('audio-books/' . $book->id);

        $book->delete();

        return redirect()->route('books.index')->with('success', 'Book and all associated R2 files deleted cleanly.');

    }
}
