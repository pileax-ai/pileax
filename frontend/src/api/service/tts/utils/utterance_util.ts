export const recommendVoices = (voices: SpeechSynthesisVoice[]) => {
  const keywords = ['Microsoft', 'Apple', 'Premium', 'Natural', 'Google'];
  return voices.filter(v => keywords.some(k => v.name.includes(k)));
}

export const prepareTextForVoice = (text: string, voice?: SpeechSynthesisVoice) => {
  if (voice && !voice.localService) {
    return text.replace(/<[^>]+>/g, "");
  }
  return text;
}
