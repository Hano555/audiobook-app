<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ChapterFactory extends Factory
{
    public function definition(): array
    {
        return [
            'chapter_number' => 1,
            'title'          => null,
            'text_content'   => $this->faker->paragraphs(5, true),
            'audio_path'     => null,
            'status'         => 'pending',
        ];
    }
}
