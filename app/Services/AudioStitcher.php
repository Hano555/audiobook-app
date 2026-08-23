<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class AudioStitcher
{
    public function stitch(array $chunkPaths, string $outputPath): string
    {
        $tempDir = sys_get_temp_dir() . '/audio_chunks_' . uniqid();
        mkdir($tempDir, 0755, true);

        $tempChunkPaths = [];

        // Download each chunk from R2 to a temp file on disk
        foreach ($chunkPaths as $index => $path) {
            $tempChunkPath = $tempDir . '/chunk_' . $index . '.mp3';
            file_put_contents($tempChunkPath, Storage::disk('s3')->get($path));
            $tempChunkPaths[] = $tempChunkPath;
        }

        // Build the file list for FFmpeg
        $fileListContent = '';
        foreach ($tempChunkPaths as $tempChunkPath) {
            $fileListContent .= "file '" . $tempChunkPath . "'\n";
        }

        // Save file list to temp file
        $fileListPath = $tempDir . '/filelist.txt';
        file_put_contents($fileListPath, $fileListContent);

        // Run FFmpeg to stitch chunks into final audio file
        $tempOutputPath = $tempDir . '/output.mp3';

        // -c copy skips re-encoding (faster, no quality loss)
        // Alternative: -c:a libmp3lame to re-encode all chunks to mp3
        // Re-encoding needed if chunk formats differ (e.g. mixing TTS providers)
        exec("ffmpeg -f concat -safe 0 -i \"{$fileListPath}\" -c copy \"{$tempOutputPath}\" 2>&1");

        // Upload stitched audio to R2
        Storage::disk('s3')->put($outputPath, file_get_contents($tempOutputPath));

        // Clean up all temp files
        unlink($fileListPath);
        unlink($tempOutputPath);
        foreach ($tempChunkPaths as $tempChunkPath) {
            unlink($tempChunkPath);
        }
        rmdir($tempDir);

        return $outputPath;
    }
}
