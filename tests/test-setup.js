import { JSDOM } from 'jsdom';
import { expect } from 'chai';

// Setup DOM environment for testing
const dom = new JSDOM('<!DOCTYPE html><html><head></head><body><main id="router-outlet"></main></body></html>', {
  url: 'http://localhost:3000',
  pretendToBeVisual: true,
  resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.history = dom.window.history;
global.location = dom.window.location;

// Make expect globally available
global.expect = expect;

// Mock fetch for testing - much more robust mocking
global.fetch = async (url) => {
  console.log('Mocked fetch called with:', url);
  
  // Mock HTML responses
  if (url.includes('test.html') || url.includes('/pages/') && url.includes('.html')) {
    return {
      ok: true,
      status: 200,
      text: async () => '<div>Test Component HTML</div>',
      json: async () => ({ content: '<div>Test Component HTML</div>' })
    };
  }
  
  // Mock CSS responses
  if (url.includes('.css')) {
    return {
      ok: true,
      status: 200,
      text: async () => '/* Test CSS */',
    };
  }
  
  // Default 404 response
  return {
    ok: false,
    status: 404,
    text: async () => 'Not found'
  };
};