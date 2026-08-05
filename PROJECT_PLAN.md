# Audiobook Generator App - Project Architecture & Context

## Overview
A web app built for converting uploaded `.pdf` books into audiobooks using background job queues and audio stitching. This initial MVP is public only, with authentication and EPUB support deferred to later phases.

## Tech Stack & Setup
- **Framework:** Laravel 13 + Inertia.js + React + Vite
- **Frontend:** React 19 + Vite
- **Development Server:** Laravel Herd or local dev server at `http://audiobook-app.test`
- **Queue:** Laravel Queue using the database queue for MVP
- **Audio stitching:** FFmpeg
- **Storage:** Laravel public storage for PDF uploads and generated audio
- **Note:** FFmpeg must be installed globally on the host OS

## MVP Scope
- Public app with `user_id` nullable
- `.pdf` upload support only
- Placeholder/local audio generation for MVP to validate the full pipeline
- Book status tracking: `pending`, `processing`, `completed`, `failed`
- Playback UI for completed audio
- Scheduled cleanup of old audio files and records
- Auth and EPUB support deferred to later phases

## Database Schema Design
1. `users`: standard Laravel users table (not required for MVP)
2. `books`: `id`, `user_id` (nullable), `title`, `author`, `original_filename`, `status`, `timestamps`
3. `chapters`: `id`, `book_id`, `chapter_number`, `title`, `text_content`, `audio_path`, `status`, `timestamps`
4. `user_book_progress`: deferred for later phases

## Architectural Guidelines
- **Text Sanitization:** Use PHP regex to remove simple headers, footers, and page numbers before saving chapter text.
- **Chunking:** Split chapter text into ~3,000-character chunks for audio processing.
- **Chunk Ordering:** Save temp chunk files with sequential prefixes like `chunk_001.mp3`, `chunk_002.mp3`.
- **FFmpeg Stitching:** Concatenate chunk files into a final audio file and save that path to the chapter record.
- **Storage Lifecycle:** Add a scheduled cleanup task to delete old audio and records after 30 days.

## Current Progress Status
- [x] Manual Inertia + React + Vite bridge configured
- [x] `Book` model exists
- [x] `BookController@index` and book list page exist
- [x] `books` migration exists
- [ ] PDF upload UI and backend route
- [ ] `Chapter` model and migration
- [ ] PDF text extraction and cleanup pipeline
- [ ] Queue job workflow and chunked audio processing
- [ ] FFmpeg stitching and playback UI
- [ ] Cleanup scheduler
- [ ] Auth and EPUB support

## Day-by-Day Roadmap

### Day 1: Setup and inspect the current app
- Install dependencies
  - `composer install`
  - `npm install`
- Run migrations
  - `php artisan migrate`
- Start the app
  - `npm run switch:dev` or `npm run dev`
- Inspect:
  - `routes/web.php`
  - `app/Http/Controllers/BookController.php`
  - `app/Models/Book.php`
  - `database/migrations/2026_08_05_011034_create_books_table.php`
  - `resources/js/Pages/Books/Index.jsx`
  - `resources/js/Layouts/Layout.jsx`
- Confirm the app loads and the book list renders
- Make a small frontend/backend change to verify the workflow

### Day 2: Add PDF upload and book creation
- Add upload route in `routes/web.php`
- Add `store()` method in `BookController`
- Add an upload form in `resources/js/Pages/Books/Index.jsx`
- Validate `.pdf` uploads
- Save uploads to `storage/app/public/books`
- Run `php artisan storage:link`
- Create `Book` records with `status = pending`
- Show uploaded books in the list

### Day 3: Add chapters and relationships
- Create `Chapter` model and migration
  - `php artisan make:model Chapter -m`
- Add migration fields:
  - `book_id`, `chapter_number`, `title`, `text_content`, `audio_path`, `status`
- Add relations:
  - `Book->chapters()` in `app/Models/Book.php`
  - `Chapter->book()` in `app/Models/Chapter.php`
- Eager load chapters in `BookController@index`
- Display book status and chapter counts in `resources/js/Pages/Books/Index.jsx`
- Optionally build `resources/js/Pages/Books/Show.jsx`

### Day 4: Implement PDF text extraction and cleanup
- Install PDF parser package
  - `composer require smalot/pdfparser`
- Add `app/Services/PdfTextExtractor.php`
- Extract text from uploaded PDFs
- Clean text with regex to remove headers, footers, and page numbers
- Create one `Chapter` record per PDF for MVP
- Save cleaned `text_content` and set chapter status to `pending`

### Day 5: Add queued audio processing
- Create `GenerateChapterAudio` job
  - `php artisan make:job GenerateChapterAudio`
- Use database queue for MVP
  - Set `QUEUE_CONNECTION=database`
- Job should:
  - Load chapter text
  - Split into ~3,000-character chunks
  - Generate placeholder audio chunks locally
  - Save chunks sequentially (`chunk_001.mp3`, `chunk_002.mp3`)
- Update chapter status to `processing`
- Dispatch job after chapter creation
- Run queue worker
  - `php artisan queue:work`

### Day 6: Stitch audio and playback UI
- Use FFmpeg to combine chunk files into final audio
- Save `audio_path` to chapter record
- Set chapter `status = completed`
- Add playback UI in React
  - `resources/js/Pages/Books/Show.jsx` or `resources/js/Pages/Books/Index.jsx`
- Show completed status, download link, and audio player
- Confirm audio playback works in browser

### Day 7: Polish MVP and add cleanup
- Keep `user_id` nullable and skip auth for MVP
- Add cleanup logic in `routes/console.php` or `app/Console/Kernel.php`
- Remove audio files and records older than 30 days
- Improve validation and UI messaging
- Add status badges for `pending`, `processing`, `completed`, `failed`
- Update `README.md` with MVP setup and usage
- Test the full upload-to-playback flow manually

## Verification checklist
- Day 1: app loads, book list page returns successfully
- Day 2: PDF upload stores file and creates a `books` record
- Day 3: `chapters` table exists and relations work
- Day 4: PDF text extracted and saved into chapter text
- Day 5: queued jobs run and chapter status updates
- Day 6: final audio file generated and playback works
- Day 7: cleanup task exists and README reflects MVP

## Notes for later
- Add auth and user ownership
- Add `.epub` support
- Replace placeholder audio with a real TTS provider
