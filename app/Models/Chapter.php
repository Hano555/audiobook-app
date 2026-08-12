<?php

namespace App\Models;

use App\Jobs\GenerateChapterAudio;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Chapter extends Model
{
    use HasFactory;

    protected $fillable = [
        'book_id',
        'chapter_number',
        'title',
        'text_content',
        'audio_path',
        'status',
    ];

    protected static function booted(): void
    {
        static::updated(function (Chapter $chapter) {
            if($chapter->text_content && $chapter->wasChanged('text_content')){
                GenerateChapterAudio::dispatch($chapter);
            }
        });
    }

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }
}
