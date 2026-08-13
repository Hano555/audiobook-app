<?php

namespace App\Jobs;

use App\Models\Chapter;
use App\Services\AudioStitcher;
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


        $book = $this->chapter->book()->first();
        \App\Models\Book::find($this->chapter->book_id)->update(['status' => 'processing']);

        foreach ($text_chunks as $index => $chunk) {

            $chunkFilename = sprintf('chunk_%03d.mp3', $index + 1);
            $chunkPath = 'chunks/book_' . $this->chapter->book_id . '/chapter_' . $this->chapter->id . '/' . $chunkFilename;

            Storage::disk('public')->put($chunkPath, '');

            $chunkPaths[] = $chunkPath;
        }

        //Create a directory to store stitched final audio file
        Storage::disk('public')->makeDirectory('audio-books/' . $this->chapter->book_id);

        //create relative path of where final stitched mp3 audio file should be stored and then pass it to stitch method inside the update Eloquent DB method for it to resolve the absolute path and save the stiched audio file there
        $finalAudioPath = 'audio-books/' . $this->chapter->book_id . '/chapter_' . $this->chapter->id . '.mp3';
        $audioStitcher = new AudioStitcher();

        //Save it to the database
        $this->chapter->update([
            'audio_path' => $audioStitcher->stitch($chunkPaths, $finalAudioPath),
            'status' => 'completed',
        ]);

        \App\Models\Book::find($this->chapter->book_id)->update(['status' => 'completed']);
    }
}
