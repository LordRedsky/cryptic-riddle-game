/**
 * Adsgram Rewarded Ads Integration Helper for Telegram Mini Apps
 */

export const showRewardedAd = ({ blockId = 'YOUR_BLOCK_ID', onSuccess, onError }) => {
  if (typeof window !== 'undefined' && window.Adsgram) {
    try {
      const AdController = window.Adsgram.init({ blockId });
      
      AdController.show()
        .then((result) => {
          // User completed watching the ad successfully
          if (onSuccess) onSuccess(result);
        })
        .catch((error) => {
          // Ad was closed early or failed to load
          console.warn("Adsgram error or closed early:", error);
          if (onError) onError(error);
        });
    } catch (e) {
      console.error("Adsgram init error:", e);
      if (onError) onError(e);
    }
  } else {
    // Fallback simulation for dev environment outside Telegram
    console.log("Adsgram SDK not loaded. Simulating rewarded ad success...");
    setTimeout(() => {
      if (onSuccess) onSuccess({ done: true, description: 'simulated' });
    }, 1000);
  }
};
