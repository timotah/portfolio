import { JSDOM } from 'jsdom';
import { expect } from 'chai';

// Setup DOM environment for testing
const dom = new JSDOM('<!DOCTYPE html><html><head></head><body><main id="router-outlet"></main></body></html>', {
  url: 'http://localhost:3000',
  pretendToBeVisual: true,
  resources: 'usable'
});

// Use Object.defineProperty to properly set globals
Object.defineProperty(global, 'window', { value: dom.window });
Object.defineProperty(global, 'document', { value: dom.window.document });
Object.defineProperty(global, 'navigator', { value: dom.window.navigator, writable: true });
Object.defineProperty(global, 'history', { value: dom.window.history });
Object.defineProperty(global, 'location', { value: dom.window.location });
Object.defineProperty(global, 'PopStateEvent', { value: dom.window.PopStateEvent });

// Mock templates for testing
globalThis.mockTemplates = {
  '/pages/home/home.html': () => Promise.resolve('<div>Home Page</div>'),
  '/pages/contact/contact.html': () => Promise.resolve('<div>Contact Page</div>'),
  '/404.html': () => Promise.resolve('<div>404 Not Found</div>')
};

// Mock fetch for testing
global.fetch = async (url) => {
  if (url.includes('.html')) {
    return {
      ok: true,
      status: 200,
      text: async () => '<div>Test Component HTML</div>'
    };
  }
  return {
    ok: false,
    status: 404,
    text: async () => 'Not found'
  };
};

// Import router after mocking
import Router from '../../src/js/router.js';

describe('Router Contract Tests', () => {
  let router;
  
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '<main id="router-outlet"></main>';
    // Reset browser history
    history.replaceState({}, '', '/');
    
    // Use routes without components to test template loading
    const routes = [
      { path: '/home' },
      { path: '/contact' }
    ];
    router = new Router(routes);
  });

  describe('navigateTo() contract', () => {
    it('MUST update browser URL when navigating to valid route', async () => {
      await router.navigateTo('/home');
      expect(window.location.pathname).to.equal('/home');
    });

    it('MUST load content into router-outlet when navigating', async () => {
      await router.navigateTo('/home');
      const outlet = document.getElementById('router-outlet');
      expect(outlet.innerHTML).to.not.be.empty;
    });

    it('MUST handle navigation to non-existent routes with 404', async () => {
      await router.navigateTo('/nonexistent');
      const outlet = document.getElementById('router-outlet');
      expect(outlet.innerHTML).to.include('404');
    });

    it('MUST be callable multiple times without errors', async () => {
      await router.navigateTo('/home');
      await router.navigateTo('/contact');
      await router.navigateTo('/home');
      expect(window.location.pathname).to.equal('/home');
    });
  });

  describe('getCurrentRoute() contract', () => {
    it('MUST return current route path after navigation', async () => {
      await router.navigateTo('/home');
      expect(router.getCurrentRoute()).to.equal('/home');
    });

    it('MUST return root path initially', () => {
      expect(router.getCurrentRoute()).to.equal('/');
    });

    it('MUST update after browser back/forward navigation', async () => {
      await router.navigateTo('/home');
      await router.navigateTo('/contact');
      
      // Simulate history.back() by manually setting the URL and triggering popstate
      window.history.replaceState({}, '', '/home');
      window.dispatchEvent(new PopStateEvent('popstate'));
      
      // Need to wait for the async _loadRoute to complete
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(router.getCurrentRoute()).to.equal('/home');
    });
  });
});