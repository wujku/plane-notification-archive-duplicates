// Default value for extensionEnabled
const defaultEnabledState = { extensionEnabled: false };

// Initialize storage with a default state if it hasn't been set
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed, checking initial state...');

  chrome.storage.sync.get(['extensionEnabled'], (result) => {
    console.log('Current storage state:', result.extensionEnabled);

    // Set default state if not set
    if (result.extensionEnabled === undefined) {
      chrome.storage.sync.set(defaultEnabledState, () => {
        console.log('Default state set: extensionEnabled = false');
        updateContextMenu(false); // Initial state is false
      });
    } else {
      updateContextMenu(result.extensionEnabled); // Update menu based on current state
    }
  });

  // Create the context menu for toggling the extension state
  chrome.contextMenus.create({
    id: "toggleExtension",
    title: "Enable Extension", // Default title, will be updated later
    contexts: ["action"]
  });
});

// Function to update context menu title based on the extension state
function updateContextMenu(isEnabled) {
  const title = isEnabled ? "Disable Extension" : "Enable Extension";
  chrome.contextMenus.update("toggleExtension", { title: title }, () => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    }
  });
}

// Listener for context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "toggleExtension") {
    console.log('Context menu item clicked: Toggle Extension Enabled');
    
    // Get current state
    chrome.storage.sync.get(["extensionEnabled"], (result) => {
      console.log('Current extensionEnabled value:', result.extensionEnabled);
      
      const newState = !result.extensionEnabled; // Toggle the state
      chrome.storage.sync.set({ extensionEnabled: newState }, () => {
        console.log('Extension enabled state set to:', newState);
        
        // Update context menu title after toggling state
        updateContextMenu(newState);
      });
    });
  }
});
