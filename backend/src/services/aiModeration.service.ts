export interface ModerationResult {
  isSafe: boolean;
  score: number;
  reason?: string;
  flagType?: 'TOXICITY' | 'NSFW' | 'SPAM' | 'FAKE_CAMERA' | 'NO_FACE';
}

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  detectedLanguage: string;
  targetLanguage: string;
}

const BAD_WORDS = ['hate', 'abuse', 'spam', 'nsfw', 'naked', 'violent', 'scam'];

const TRANSLATIONS_DICTIONARY: Record<string, Record<string, string>> = {
  Uzbek: {
    'Hello! How are you?': 'Salom! Qalaysiz?',
    'Nice to meet you!': 'Tanishganimdan xursandman!',
    'Where are you from?': 'Qaysi davlatdansiz?',
    'What are your hobbies?': 'Qanday sevimli mashg‘ulotlaringiz bor?',
    'You are awesome!': 'Siz juda ajoyibsiz!',
    'Let us be friends!': 'Keling, do‘st bo‘lamiz!',
  },
  English: {
    'Salom! Qalaysiz?': 'Hello! How are you?',
    'Tanishganimdan xursandman!': 'Nice to meet you!',
    'Qaysi davlatdansiz?': 'Where are you from?',
  },
  Spanish: {
    'Hello! How are you?': '¡Hola! ¿Cómo estás?',
    'Nice to meet you!': '¡Encantado de conocerte!',
  },
  Russian: {
    'Hello! How are you?': 'Привет! Как дела?',
    'Nice to meet you!': 'Приятно познакомиться!',
  },
};

export class AIModerationService {
  /**
   * Scans text content for spam, toxicity, and inappropriate terms.
   */
  public static scanText(text: string): ModerationResult {
    const lower = text.toLowerCase();
    const foundBadWord = BAD_WORDS.find((word) => lower.includes(word));

    if (foundBadWord) {
      return {
        isSafe: false,
        score: 0.95,
        reason: `Inappropriate keyword detected: "${foundBadWord}"`,
        flagType: 'TOXICITY',
      };
    }

    // Check for repetitive spam
    if (text.length > 300) {
      return {
        isSafe: false,
        score: 0.85,
        reason: 'Excessively long message (Spam Prevention)',
        flagType: 'SPAM',
      };
    }

    return {
      isSafe: true,
      score: 0.05,
    };
  }

  /**
   * Real-time text translation engine
   */
  public static translateText(text: string, targetLanguage: string): TranslationResult {
    const dict = TRANSLATIONS_DICTIONARY[targetLanguage];
    let translated = text;

    if (dict && dict[text]) {
      translated = dict[text];
    } else if (targetLanguage === 'Uzbek') {
      translated = `[AI Tarjima: ${text}]`;
    } else if (targetLanguage === 'Spanish') {
      translated = `[AI Traducción: ${text}]`;
    } else if (targetLanguage === 'Russian') {
      translated = `[AI Перевод: ${text}]`;
    } else {
      translated = `[AI Trans: ${text}]`;
    }

    return {
      originalText: text,
      translatedText: translated,
      detectedLanguage: 'Auto',
      targetLanguage,
    };
  }

  /**
   * Evaluates incoming frame telemetry (face detected count, motion variance)
   */
  public static evaluateFrameTelemetry(faceCount: number, motionVariance: number): ModerationResult {
    if (faceCount === 0) {
      return {
        isSafe: false,
        score: 0.8,
        reason: 'No face detected in video stream',
        flagType: 'NO_FACE',
      };
    }

    if (motionVariance < 0.001) {
      return {
        isSafe: false,
        score: 0.88,
        reason: 'Static image or fake camera loop detected',
        flagType: 'FAKE_CAMERA',
      };
    }

    return {
      isSafe: true,
      score: 0.02,
    };
  }
}
