/**
 * Error Handling Tests: Router and Component Error Recovery
 * 
 * Tests that Router and BaseComponent handle errors gracefully,
 * showing appropriate error messages and maintaining system stability.
 */

import { describe, it, beforeEach, afterEach } from 'mocha';
import assert from 'assert';
import { JSDOM } from 'jsdom';

// Setup globals for test environment
Object.defineProperty(globalThis, 'window', {
  value: undefined,
  writable: true,
  configurable: true
});

Object.defineProperty(globalThis, 'document', {
  value: undefined,
  writable: true,
  configurable: true
});

Object.defineProperty(globalThis, 'location', {
  value: undefined,
  writable: true,
  configurable: true
});

Object.defineProperty(globalThis, 'history', {
  value: undefined,
  writable: true,
  configurable: true
});

Object.defineProperty(globalThis, 'fetch', {
  value: undefined,
  writable: true,
  configurable: true
});

// Mock templates for testing
Object.defineProperty(globalThis, 'mockTemplates', {
  value: {
    '/pages/working/working.html': () => '<div class="working-page">Working Content</div>',
    // NOTE: No 404.html - this will force template loading to fail
  },
  writable: true,
  configurable: true
});

describe('Error Handling Tests', function() {
  let Router, BaseComponent;
  let dom, window, document;
  
  beforeEach(async function() {
    // Setup JSDOM
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <head></head>
        <body>
          <div id="router-outlet"></div>
        </body>
      </html>
    `, { 
      url: 'http://localhost:3000/',
      pretendToBeVisual: true,
      resources: 'usable'
    });
    
    window = dom.window;
    document = window.document;
    
    // Setup globals
    globalThis.window = window;
    globalThis.document = document;
    globalThis.location = window.location;
    globalThis.history = window.history;
    
    // Import modules after globals are set
    const routerModule = await import('../src/js/router.js');
    const componentModule = await import('../src/js/BaseComponent.js');
    
    Router = routerModule.default;
    BaseComponent = componentModule.default;
  });
  
  afterEach(function() {
    if (dom) {
      dom.window.close();
    }
    // Clean up globals
    globalThis.window = undefined;
    globalThis.document = undefined;
    globalThis.location = undefined;
    globalThis.history = undefined;
    globalThis.fetch = undefined;
  });

  describe('BaseComponent Error Handling', function() {
    it('MUST handle HTML loading failures gracefully', async function() {
      // Mock fetch to simulate network error
      globalThis.fetch = async (url) => {
        throw new Error('Network error');
      };
      
      const component = new BaseComponent('failing');
      
      try {
        await component.activate();
        assert.fail('Component activation should have thrown an error');
      } catch (error) {
        assert(error.message.includes('Network error'), 'Should propagate network error');
      }
      
      // Verify error state is shown
      const outlet = document.getElementById('router-outlet');
      assert(outlet.innerHTML.includes('Error Loading Page'), 'Should show error message');
      assert(outlet.innerHTML.includes('failing'), 'Should mention component name');
    });
    
    it('MUST handle HTTP errors (404, 500, etc.)', async function() {
      // Mock fetch to simulate 404 error
      globalThis.fetch = async (url) => {
        return {
          ok: false,
          status: 404,
          text: async () => 'Not Found'
        };
      };
      
      const component = new BaseComponent('notfound');
      
      try {
        await component.activate();
        assert.fail('Component activation should have thrown an error');
      } catch (error) {
        assert(error.message.includes('HTTP 404'), 'Should include HTTP status');
        assert(error.message.includes('notfound.html'), 'Should mention filename');
      }
    });
    
    it('MUST handle missing router-outlet gracefully', async function() {
      // Remove router outlet
      const outlet = document.getElementById('router-outlet');
      outlet.remove();
      
      // Mock successful fetch
      globalThis.fetch = async (url) => ({
        ok: true,
        status: 200,
        text: async () => '<div>Test Content</div>'
      });
      
      const component = new BaseComponent('test');
      
      try {
        await component.activate();
        assert.fail('Component activation should have thrown an error');
      } catch (error) {
        assert(error.message.includes('Router outlet not found'), 'Should detect missing outlet');
      }
    });
    
    it('MUST handle CSS loading failures without breaking component', async function() {
      // Mock successful HTML fetch
      globalThis.fetch = async (url) => ({
        ok: true,
        status: 200,
        text: async () => '<div>Test Content</div>'
      });
      
      const component = new BaseComponent('test');
      
      // Should not throw even if CSS fails to load
      await component.activate();
      
      assert.strictEqual(component.isActive, true, 'Component should be active despite CSS failure');
      
      const outlet = document.getElementById('router-outlet');
      assert(outlet.innerHTML.includes('Test Content'), 'HTML should still be loaded');
    });
  });

  describe('Router Error Handling', function() {
    it('MUST handle component creation failures', async function() {
      class FailingComponent extends BaseComponent {
        constructor() {
          throw new Error('Component constructor failed');
        }
      }
      
      const routes = [
        { path: '/failing', component: FailingComponent }
      ];
      
      const router = new Router(routes);
      
      // Should not throw - should handle error gracefully
      await router.navigateTo('/failing');
      
      const outlet = document.getElementById('router-outlet');
      assert(outlet.innerHTML.includes('Page Not Found'), 'Should show router error page');
      assert(outlet.innerHTML.includes('/failing'), 'Should mention the failing route');
    });
    
    it('MUST handle component activation failures', async function() {
      class ActivationFailingComponent extends BaseComponent {
        constructor() {
          super('failing');
        }
        
        async activate() {
          throw new Error('Activation failed');
        }
      }
      
      const routes = [
        { path: '/actfail', component: ActivationFailingComponent }
      ];
      
      const router = new Router(routes);
      
      // Should not throw - should handle error gracefully
      await router.navigateTo('/actfail');
      
      const outlet = document.getElementById('router-outlet');
      assert(outlet.innerHTML.includes('Page Not Found'), 'Should show router error page');
      assert(outlet.innerHTML.includes('Activation failed'), 'Should include error details');
    });
    
    it('MUST handle template loading failures', async function() {
      // Create router with no routes (will fall back to templates)
      const router = new Router([]);
      
      // Should not throw - should handle error gracefully
      await router.navigateTo('/nonexistent');
      
      const outlet = document.getElementById('router-outlet');
      assert(outlet.innerHTML.includes('Page Not Found'), 'Should show router error page');
      assert(outlet.innerHTML.includes('/nonexistent'), 'Should mention the failing route');
    });
    
    it('MUST maintain router state after errors', async function() {
      // Temporarily add 404.html for this test
      globalThis.mockTemplates['/404.html'] = () => '<div class="not-found">404 Not Found</div>';
      
      const routes = [
        { path: '/working', component: null }
      ];

      const router = new Router(routes);

      // First, navigate to a working route
      await router.navigateTo('/working');
      assert.strictEqual(router.getCurrentRoute(), '/working');

      const outlet = document.getElementById('router-outlet');
      assert(outlet.innerHTML.includes('Working Content'), 'Should load working route');

      // Remove 404.html to force error
      delete globalThis.mockTemplates['/404.html'];

      // Then navigate to a failing route
      await router.navigateTo('/nonexistent');
      assert.strictEqual(router.getCurrentRoute(), '/nonexistent');

      // Router should show error page after template failure
      assert(outlet.innerHTML.includes('Page Not Found'), 'Should show error page');

      // Restore 404.html for working route test
      globalThis.mockTemplates['/404.html'] = () => '<div class="not-found">404 Not Found</div>';

      // Should be able to navigate back to working route
      await router.navigateTo('/working');
      assert.strictEqual(router.getCurrentRoute(), '/working');
      assert(outlet.innerHTML.includes('Working Content'), 'Should work after error recovery');
      
      // Clean up
      delete globalThis.mockTemplates['/404.html'];
    });
  });

  describe('Error State Accessibility', function() {
    it('MUST include proper ARIA attributes for error states', async function() {
      // Mock fetch to fail
      globalThis.fetch = async (url) => {
        throw new Error('Network error');
      };
      
      const component = new BaseComponent('failing');
      
      try {
        await component.activate();
      } catch (error) {
        // Expected to fail
      }
      
      const outlet = document.getElementById('router-outlet');
      const errorDiv = outlet.querySelector('.error-state');
      
      assert(errorDiv, 'Should have error state element');
      assert.strictEqual(errorDiv.getAttribute('role'), 'alert', 'Should have alert role');
      assert.strictEqual(errorDiv.getAttribute('aria-live'), 'assertive', 'Should have assertive aria-live');
    });
    
    it('MUST provide actionable error recovery options', async function() {
      const router = new Router([]);
      await router.navigateTo('/nonexistent');
      
      const outlet = document.getElementById('router-outlet');
      const homeLink = outlet.querySelector('.error-home-link');
      const retryButton = outlet.querySelector('.error-retry-button');
      
      assert(homeLink, 'Should have home link');
      assert.strictEqual(homeLink.getAttribute('href'), '/', 'Home link should go to root');
      
      assert(retryButton, 'Should have retry button');
      assert(retryButton.textContent.includes('Try Again'), 'Retry button should have clear text');
    });
  });
});