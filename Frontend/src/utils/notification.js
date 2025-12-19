// Simple notification sound utility
export const playNotificationSound = () => {
  try {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Beep parameters
    oscillator.frequency.value = 1000; // Hz
    oscillator.type = "sine";

    // Volume
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    // Play sound
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.log("Could not play notification sound:", error);
  }
};

// Alternative: Use a notification API sound if available
export const playSystemNotification = (title = "New Message") => {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, {
      icon: "/vite.svg",
      tag: "chat-notification",
      requireInteraction: false,
    });
  }
};

// Request notification permission
export const requestNotificationPermission = () => {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
};
