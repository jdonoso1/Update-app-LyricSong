// Initialize some mock data for demonstration purposes
import { createCollection } from "../utils/storage";

export function initializeMockData() {
  // Check if we already initialized
  const initialized = localStorage.getItem("lyricLearn_initialized");
  if (initialized) return;

  // Create some sample saved collections (from other users)
  createCollection({
    name: "French Travel Essentials",
    description: "Essential French phrases for travelers",
    songIds: ["2", "4", "6", "8", "10", "12"],
    isOwned: false,
  });

  createCollection({
    name: "Spanish Love Songs",
    description: "Romantic vocabulary through beautiful Spanish ballads",
    songIds: ["1", "3", "5", "9"],
    isOwned: false,
  });

  createCollection({
    name: "Daily French Vocabulary",
    description: "Common words and phrases for everyday conversations",
    songIds: ["2", "4", "6", "8", "10", "12", "14"],
    isOwned: false,
  });

  // Mark as initialized
  localStorage.setItem("lyricLearn_initialized", "true");
}
