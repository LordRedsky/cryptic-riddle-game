/**
 * Telegram WebApp SDK Helper
 */

export const getTelegramWebApp = () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
};

export const initTelegramSDK = () => {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.ready();
    tg.expand();
    // Enable closing confirmation if supported
    if (tg.enableClosingConfirmation) {
      tg.enableClosingConfirmation();
    }
  }
};

export const getTelegramUser = () => {
  const tg = getTelegramWebApp();
  if (tg?.initDataUnsafe?.user) {
    return tg.initDataUnsafe.user;
  }
  // Fallback mock user for local dev/testing outside Telegram
  return {
    id: 99999999,
    first_name: "Cyber",
    last_name: "Player",
    username: "cyber_player",
    language_code: "id"
  };
};

export const sendHapticFeedback = (type = 'light') => {
  const tg = getTelegramWebApp();
  if (tg?.HapticFeedback) {
    try {
      if (['light', 'medium', 'heavy', 'rigid', 'soft'].includes(type)) {
        tg.HapticFeedback.impactOccurred(type);
      } else if (['error', 'success', 'warning'].includes(type)) {
        tg.HapticFeedback.notificationOccurred(type);
      } else if (type === 'selectionChanged') {
        tg.HapticFeedback.selectionChanged();
      }
    } catch (e) {
      console.warn("Haptic feedback error:", e);
    }
  }
};

export const shareScoreToTelegram = (score, streak, puzzleCount) => {
  const tg = getTelegramWebApp();
  const text = `🎮 *Cryptic Decoder*\n\nGua berhasil dapetin *${score} Poin* dengan max streak *${streak}🔥* setelah menaklukkan ${puzzleCount} puzzle!\n\nLu bisa ngalahin skor gua gak? 😎`;
  
  if (tg?.shareToStory) {
    // Share options if available
  }
  
  if (tg?.openTelegramLink) {
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent('https://t.me/CrypticDecoderBot')}&text=${encodeURIComponent(text)}`;
    tg.openTelegramLink(shareUrl);
  } else {
    // Fallback window open
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent('https://t.me/CrypticDecoderBot')}&text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
  }
};
