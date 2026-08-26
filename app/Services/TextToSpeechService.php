<?php

namespace App\Services;

use Google\Cloud\TextToSpeech\V1\AudioConfig;
use Google\Cloud\TextToSpeech\V1\AudioEncoding;
use Google\Cloud\TextToSpeech\V1\SynthesisInput;
use Google\Cloud\TextToSpeech\V1\SynthesizeSpeechRequest;
use Google\Cloud\TextToSpeech\V1\Client\TextToSpeechClient;
use Google\Cloud\TextToSpeech\V1\VoiceSelectionParams;

class TextToSpeechService
{
    public function generateAudioContent(string $text): string
    {
        $client = new TextToSpeechClient();

        $input = new SynthesisInput();
        $input->setText($text);

        $voice = new VoiceSelectionParams();
        $voice->setLanguageCode('en-US');
        $voice->setName('en-US-Journey-F');

        $audioConfig = new AudioConfig();
        $audioConfig->setAudioEncoding(AudioEncoding::MP3);

        $request = new SynthesizeSpeechRequest();
        $request->setInput($input);
        $request->setVoice($voice);
        $request->setAudioConfig($audioConfig);

        $response = $client->synthesizeSpeech($request);

        $client->close();

        return $response->getAudioContent();

    }
}
