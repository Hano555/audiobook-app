<?php

namespace App\Models;

use App\Models\Chapter;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'author',
        'original_filename',
        'pdf_path',
        'status',
    ];

    protected static function booted(): void
    {
        static::created(function (Book $book) {
            $book->chapters()->create([
                'chapter_number' => 1,
                'title'          => null,
                'text_content'   => '',
                'status'         => 'pending',
            ]);
        });
    }

    public function chapters(): HasMany
    {
        return $this->hasMany(Chapter::class);
    }
}
