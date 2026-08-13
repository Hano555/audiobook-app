<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class AudioStitcher
{
    public function stitch(array $chunkPaths, string $outputPath): string
    {
        //Build the file list content
        $fileListContent = '';
        foreach ($chunkPaths as $path) {
            $fullPath = Storage::disk('public')->path($path);
            $fileListContent .= "file '" . $fullPath . "'\n";
        }

        //Save the file list to a temp file
        $fileListPath = Storage::disk('public')->path('chunks/filelist.txt');
        file_put_contents($fileListPath, $fileListContent);


        //Run FFmpeg to stich chunks
        $fullOutputPath = Storage::disk('public')->path($outputPath);

        // -c copy skips re-encoding (faster, no quality loss)
        // Alternative: -c:a libmp3lame to re-encode all chunks to mp3
        // Re-encoding needed if chunk formats differ (e.g. mixing TTS providers)
        exec("ffmpeg -f concat -safe 0 -i \"{$fileListPath}\" -c copy \"{$fullOutputPath}\" 2>&1");

        //Clean up the file list
        unlink($fileListPath);

        return $outputPath;
    }
}
