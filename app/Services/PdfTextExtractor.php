<?php

namespace App\Services;

class PdfTextExtractor
{
    public function extract(string $path)
    {
        $parser = new \Smalot\PdfParser\Parser();
        // open the pdf
        $pdf = $parser->parseFile($path);
        // read the text
        $text = $pdf->getText();
        // return it

        $text = $this->clean($text);

        return $text;
    }

    private function clean(string $uncleanedText): string
    {
        $text = preg_replace('/\b\d+\b/', '', $uncleanedText);  // standalone numbers/page numbers
        $text = preg_replace('/page\s+\d+/i', '', $text);        // "Page X" patterns
        $text = preg_replace('/\n+/', ' ', $text);               // newlines
        $text = preg_replace('/\s+/', ' ', $text);               // extra whitespace
        $text = trim($text);                                      // leading/trailing whitespace

        return $text;
    }
}
