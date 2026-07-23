/**
 * Adsgram Rewarded Ads Integration Helper for Telegram Mini Apps
 */

// Block ID from environment variable (set VITE_ADSGRAM_BLOCK_ID in frontend/.env)
const ENV_BLOCK_ID = import.meta.env.VITE_ADSGRAM_BLOCK_ID || '';
const DEFAULT_TEST_BLOCK_ID = 'int-4361';

export const showRewardedAd = ({ blockId, onSuccess, onError }) => {
  // Priority: explicit blockId arg → env variable → fallback test ID
  const activeBlockId =
    blockId && !blockId.includes('YOUR_')
      ? blockId
      : ENV_BLOCK_ID || DEFAULT_TEST_BLOCK_ID;

  console.log(`[Adsgram] Initializing ad with Block ID: "${activeBlockId}"`);

  if (typeof window !== 'undefined' && window.Adsgram) {
    try {
      const AdController = window.Adsgram.init({ blockId: String(activeBlockId) });
      
      AdController.show()
        .then((result) => {
          console.log("[Adsgram] Ad completed successfully:", result);
          if (onSuccess) onSuccess(result);
        })
        .catch((error) => {
          console.warn("[Adsgram] Ad error or closed early:", error);
          // If test ad or if error occurs, pass error details
          if (activeBlockId === DEFAULT_TEST_BLOCK_ID) {
            console.log("Test mode: Auto-rewarding for dev testing...");
            if (onSuccess) onSuccess({ done: true, test: true });
          } else {
            if (onError) onError(error);
          }
        });
    } catch (e) {
      console.error("[Adsgram] Init error:", e);
      if (onError) onError(e);
      else if (onSuccess) onSuccess({ done: true, fallback: true });
    }
  } else {
    // Fallback simulation for dev environment outside Telegram
    console.log("[Adsgram] SDK not loaded. Simulating rewarded ad success...");
    setTimeout(() => {
      if (onSuccess) onSuccess({ done: true, description: 'simulated' });
    }, 1000);
  }
};
