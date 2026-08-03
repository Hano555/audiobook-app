# Audiobook Generator App - Project Architecture & Context

## Overview
A web app built for converting uploaded `.pdf` / `.epub` books into audiobooks using background job queues and TTS APIs.

## Tech Stack & Setup
- **Framework:** Laravel 11 + Inertia.js (Manual setup, no Breeze)
- **Frontend:** React 18 + Vite
- **Development Server:** Laravel Herd (`http://audiobook-app.test`)
- **Queue/Background Engine:** Laravel Queue (Database/Redis) + FFmpeg
- **System Dependency:** FFmpeg MUST be installed globally on the host OS for audio stitching to work.

## Database Schema Design
1. `users`: Standard Laravel user table (Requires manual auth implementation).
2. `books`: `id`, `user_id` (nullable for v1 testing), `title`, `author`, `original_filename`, `status` (`pending`, `processing`, `completed`, `failed`), `timestamps`
3. `chapters`: `id`, `book_id`, `chapter_number`, `title`, `text_content`, `audio_path`, `duration_seconds`, `status`, `timestamps`
4. `user_book_progress`: `user_id`, `book_id`, `current_chapter_id`, `progress_seconds`, `timestamps`

## Architectural Guidelines
- **Text Sanitization:** Must use PHP Regex to strip headers, footers, and page numbers before sending text to TTS.
- **Queue Batching & Rate Limiting:** Split text into ~3,000 character chunks. Dispatch via Laravel Job Batches with Redis rate limiting to avoid OpenAI/Edge-TTS 429 Too Many Requests errors.
- **Strict Chunk Ordering:** Jobs MUST save temporary chunk files with sequential prefixes (e.g., `chunk_001.mp3`, `chunk_002.mp3`) so FFmpeg concatenates them in the correct narrative order.
- **FFmpeg Stitching:** Merge processed chunk `.mp3` files into a single chapter audio file inside the Batch `onSuccess()` callback.
- **Storage Lifecycle:** Scheduled Laravel task (`routes/console.php`) to delete audio files and DB records older than 30 days.

## Current Progress Status
- [x] Manual Inertia + React + Vite bridge configured and audited.
- [ ] Manual Authentication (Login/Register) OR make `user_id` nullable in books.
- [ ] Database migrations & Eloquent models (`Book`, `Chapter`, `UserBookProgress`).
- [ ] React drag-and-drop file upload UI & Laravel controller.
- [ ] Text extraction & Regex cleanup pipeline.
- [ ] Laravel Queue Job, Chunk Ordering, & TTS API integration.
