# Audiobook Generator App - Project Architecture & Context

## Overview
A web app built for converting uploaded `.pdf` books into audiobooks using background job queues and audio stitching. V1.0 is a public MVP that validates the full pipeline. V2.0 transforms it into a proper multi-user paid service with real TTS audio, Cloudflare R2 storage, and Stripe payments.

## Tech Stack & Setup
- **Framework:** Laravel 13 + Inertia.js + React + Vite
- **Frontend:** React 19 + Vite
- **Development Server:** Laravel Herd or local dev server at `http://audiobook-app.test`
- **Queue:** Laravel Queue using the database queue
- **Audio stitching:** FFmpeg
- **Storage (V1.0):** Laravel public storage for PDF uploads and generated audio
- **Storage (V2.0):** Cloudflare R2
- **TTS (V1.0):** Placeholder audio
- **TTS (V2.0):** ElevenLabs or Google Cloud TTS
- **Auth (V2.0):** Laravel React Starter Kit
- **Payments (V2.0):** Stripe via Laravel Cashier
- **Email (V2.0):** Mailgun or Resend via Laravel Mail
- **Note:** FFmpeg must be installed globally on the host OS

## MVP Scope (V1.0 — Completed)
- Public app with `user_id` nullable
- `.pdf` upload support only
- Placeholder/local audio generation to validate the full pipeline
- Book status tracking: `pending`, `processing`, `completed`, `failed`
- Playback UI for completed audio
- Scheduled cleanup of old audio files and records after 30 days

## V2.0 Scope
- User registration, login, password reset, email verification
- Books belong to authenticated users — users only see their own books
- Real TTS audio generation replacing placeholder
- Cloudflare R2 for PDF and audio file storage
- Book deletion — delete book, chapters, and associated files
- Email notification when audiobook is ready
- Error handling and retry logic for failed jobs
- Upload progress indicator
- Free tier with limits, paid tier via Stripe

## Database Schema Design
1. `users`: standard Laravel users table (required from V2.0)
2. `books`: `id`, `user_id` (nullable in V1.0, required in V2.0), `title`, `author`, `original_filename`, `status`, `timestamps`
3. `chapters`: `id`, `book_id`, `chapter_number`, `title`, `text_content`, `audio_path`, `status`, `timestamps`
4. `subscriptions`: managed by Laravel Cashier (V2.0)
5. `user_book_progress`: deferred for later phases

## Architectural Guidelines
- **Text Sanitization:** Use PHP regex to remove simple headers, footers, and page numbers before saving chapter text.
- **Chunking:** Split chapter text into ~3,000-character chunks for audio processing.
- **Chunk Ordering:** Save temp chunk files with sequential prefixes like `chunk_001.mp3`, `chunk_002.mp3`.
- **FFmpeg Stitching:** Concatenate chunk files into a final audio file and save that path to the chapter record.
- **Storage Lifecycle:** Add a scheduled cleanup task to delete old audio and records after 30 days.

## Current Progress Status

### V1.0 (Completed)
- [x] Manual Inertia + React + Vite bridge configured
- [x] `Book` model exists
- [x] `BookController@index` and book list page exist
- [x] `books` migration exists
- [x] PDF upload UI and backend route
- [x] `Chapter` model and migration
- [x] PDF text extraction and cleanup pipeline
- [x] Queue job workflow and chunked audio processing
- [x] FFmpeg stitching and playback UI
- [x] Cleanup scheduler
- [x] Status badges and README

### V2.0 (In Progress)
- [x] Auth installed and user ownership enforced
- [ ] Cloudflare R2 storage configured
- [ ] Real TTS integration
- [ ] Book deletion
- [ ] Email notifications
- [ ] Error handling and retry logic
- [ ] Upload progress indicator
- [ ] Stripe payments and free tier limits
- [ ] V2.0 deployed

## V1.0 Day-by-Day Roadmap (Completed)

### Day 1: Setup and inspect the current app
### Day 2: Add PDF upload and book creation
### Day 3: Add chapters and relationships
### Day 4: Implement PDF text extraction and cleanup
### Day 5: Add queued audio processing
### Day 6: Stitch audio and playback UI
### Day 7: Polish MVP and add cleanup

## V2.0 Day-by-Day Roadmap

### Day 1: Install auth and migrate user ownership
- Install Laravel React Starter Kit:
  - `php artisan install --starter-kit=react`
- Run fresh migrations
- Make `user_id` required on `books` table via new migration
- Scope `BookController@index` to only return authenticated user's books
- Protect book routes with `auth` middleware
- Test registration, login, and book list scoped to user

### Day 2: Cloudflare R2 storage
- Create a Cloudflare R2 bucket
- Install AWS S3 SDK (R2 is S3-compatible):
  - `composer require league/flysystem-aws-s3-v3`
- Configure `.env` with R2 credentials
- Update `BookController@store` to upload PDFs to R2
- Update `AudioStitcher` to save audio files to R2
- Update `PdfTextExtractor` to read from R2
- Test full pipeline with R2 storage

### Day 3: Real TTS integration
- Sign up for ElevenLabs or Google Cloud TTS
- Add API key to `.env`
- Create `app/Services/TextToSpeechService.php`
- Replace placeholder audio generation in `GenerateChapterAudio` job with real TTS API calls
- Test real audio generation end to end
- Confirm audio player works with real audio

### Day 4: Book deletion
- Add `destroy()` method to `BookController`
- Delete associated files from R2 (PDF, chunks, audio)
- Delete book and chapter records (cascade handles chapters)
- Add delete button to UI
- Confirm deletion works cleanly

### Day 5: Email notifications
- Configure mail driver in `.env` (Mailgun or Resend)
- Create `BookCompleted` notification:
  - `php artisan make:notification BookCompleted`
- Send notification to user when chapter status hits `completed`
- Add email view with link back to the app
- Test email delivery

### Day 6: Error handling and retry logic
- Add `failed()` method to `GenerateChapterAudio` job
- Set chapter and book status to `failed` on job failure
- Set `$tries = 3` on the job for automatic retries
- Show `failed` status badge in UI with a retry option
- Add upload progress indicator to the upload form in React

### Day 7: Stripe payments and free tier limits
- Install Laravel Cashier:
  - `composer require laravel/cashier`
- Set up Stripe account and add keys to `.env`
- Define free tier limit (e.g. 3 books) and paid tier (unlimited)
- Gate book creation behind subscription check
- Add upgrade prompt when free tier limit is reached
- Add basic subscription management page

### Day 8: Polish and deploy
- Update README for V2.0
- Add V2.0 screenshots
- Test full flow — register, upload, process, receive email, play audio
- Deploy to Laravel Cloud or Railway with R2 storage configured
- Update GitHub repo and showcase post

## V2.0 Verification Checklist
- Day 1: Auth works, books scoped to logged-in user
- Day 2: PDFs and audio files stored in R2
- Day 3: Real audio generated and playable
- Day 4: Book deletion removes files and records
- Day 5: Email sent when audiobook is ready
- Day 6: Failed jobs retry, failed status shows in UI
- Day 7: Free tier enforced, Stripe subscription works
- Day 8: App deployed and accessible publicly

## Notes for V2.0
- Laravel Breeze is no longer recommended for Laravel 13 — use the official React Starter Kit instead
- R2 setup requires a Cloudflare account — free tier covers MVP usage
- ElevenLabs has a free tier with 10,000 characters per month — enough for testing
- Stripe test mode is available so no real payments needed during development
