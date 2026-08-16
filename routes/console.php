<?php

use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Storage;
use App\Models\Book;

Schedule::call(function () {
    $books = Book::where('created_at', '<', now()->subDays(30))
        ->with('chapters')
        ->get();

    foreach ($books as $book) {
        foreach ($book->chapters as $chapter) {
            // Delete chunk files
            Storage::disk('public')->deleteDirectory('chunks/book_' . $book->id . '/chapter_' . $chapter->id);

            // Delete stitched audio file
            if ($chapter->audio_path) {
                Storage::disk('public')->delete($chapter->audio_path);
            }
        }

        // Delete the original PDF
        if ($book->pdf_path) {
            Storage::disk('public')->delete($book->pdf_path);
        }

        // Delete the audio-books directory for this book
        Storage::disk('public')->deleteDirectory('audio-books/' . $book->id);

        // Delete the book record (chapters cascade via migration)
        $book->delete();
    }
})->daily()->name('cleanup-old-books')->description('Delete books and audio files older than 30 days');
