<?php

namespace App\Jobs;

use App\Models\Chapter;
use Illuminate\Support\Facades\Storage;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class GenerateChapterAudio implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public Chapter $chapter)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $chapter_text = $this->chapter->text_content;

        $text_chunks = str_split($chapter_text, 3000);

        $chunkPaths = [];

        $this->chapter->update(['status' => 'processing']);

        foreach ($text_chunks as $index => $chunk) {

            $chunkFilename = sprintf('chunk_%03d.mp3', $index + 1);
            $chunkPath = 'chunks/book_' . $this->chapter->book_id . '/chapter_' . $this->chapter->id . '/' . $chunkFilename;

            Storage::disk('public')->put($chunkPath, '');

            $chunkPaths[] = $chunkPath;
        }


    }
}
