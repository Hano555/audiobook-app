<?php

use App\Models\Book;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Storage;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::call(function () {
    $books = Book::where('created_at', '<', now()->subDays(30))
        ->with('chapters')
        ->get();

    foreach ($books as $book) {
        foreach ($book->chapters as $chapter) {
            // Delete chunk files from R2
            Storage::disk('s3')->deleteDirectory('chunks/book_' . $book->id . '/chapter_' . $chapter->id);

            // Delete stitched audio file from R2
            if ($chapter->audio_path) {
                Storage::disk('s3')->delete($chapter->audio_path);
            }
        }

        // Delete the original PDF from R2
        if ($book->pdf_path) {
            Storage::disk('s3')->delete($book->pdf_path);
        }

        // Delete the audio-books directory for this book from R2
        Storage::disk('s3')->deleteDirectory('audio-books/' . $book->id);

        // Delete the book record (chapters cascade)
        $book->delete();
    }
})->daily()->name('cleanup-old-books')->description('Delete books and audio files older than 30 days');
