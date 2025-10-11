// Portfolio Owner entity (static data)

export const portfolioOwner = {
  name: "Tim Radtke",
  professionalLinks: [
    { type: "GitHub", url: "https://github.com/timradtke" },
    { type: "LinkedIn", url: "https://linkedin.com/in/timradtke" }
  ],
  credentials: "Software Engineer, B.Sc. Computer Science, 10+ years experience. See resume for details.",
  contactMethods: [
    { type: "Email", value: "tim@radtke.dev" },
    { type: "Twitter", value: "@timradtke" }
  ]
};

// User model for routing feature
export const user = {
  deviceCapabilities: {
    jsEnabled: typeof window !== 'undefined' ? !!window.navigator && !!window.document : false,
    screenReader: false, // Placeholder, should be detected via accessibility API if available
    keyboard: true // Assume keyboard available; can be refined
  },
  navigationHistory: [] // Will be populated by router logic
};
