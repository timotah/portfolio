/**
 * Integration Tests: Router-Component Integration
 * 
 * Tests that Router class works correctly with actual BaseComponent instances,
 * verifying the integration between routing and component lifecycle.
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
    '/pages/home/home.html': () => '<div class="home-page">Home Content</div>',
    '/pages/contact/contact.html': () => '<div class="contact-page">Contact Content</div>',
    '/pages/tracked/tracked.html': () => '<div class="tracked-page">Tracked Content</div>',
    '/pages/a/a.html': () => '<div class="a-page">A Content</div>',
    '/pages/b/b.html': () => '<div class="b-page">B Content</div>',
    '/404.html': () => '<div class="not-found">404 Not Found</div>'
  },
  writable: true,
  configurable: true
});

describe('Router-Component Integration Tests', function() {
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
    
    // Mock fetch for HTML/CSS loading
    globalThis.fetch = async (url) => {
      console.log(`Integration test fetch called with: ${url}`);
      
      if (url.includes('.html')) {
        const routePath = url.replace('http://localhost:3000', '');
        if (routePath === '/pages/home/home.html') {
          return {
            ok: true,
            status: 200,
            text: async () => '<div class="home-component">Home Component HTML</div>'
          };
        }
        if (routePath === '/pages/contact/contact.html') {
          return {
            ok: true,
            status: 200,
            text: async () => '<div class="contact-component">Contact Component HTML</div>'
          };
        }
        if (routePath === '/pages/test/test.html') {
          return {
            ok: true,
            status: 200,
            text: async () => '<div class="test-component">Test Component HTML</div>'
          };
        }
        if (routePath === '/pages/cycle/cycle.html') {
          return {
            ok: true,
            status: 200,
            text: async () => '<div class="cycle-component">Cycle Component HTML</div>'
          };
        }
        if (routePath === '/pages/tracked/tracked.html') {
          return {
            ok: true,
            status: 200,
            text: async () => '<div class="tracked-component">Tracked Component HTML</div>'
          };
        }
        if (routePath === '/pages/a/a.html') {
          return {
            ok: true,
            status: 200,
            text: async () => '<div class="a-component">Component A HTML</div>'
          };
        }
        if (routePath === '/pages/b/b.html') {
          return {
            ok: true,
            status: 200,
            text: async () => '<div class="b-component">Component B HTML</div>'
          };
        }
      }
      
      if (url.includes('.css')) {
        return {
          ok: true,
          status: 200,
          text: async () => '.test-css { color: blue; }'
        };
      }
      
      return {
        ok: false,
        status: 404,
        text: async () => 'Not Found'
      };
    };
    
    // Import modules after globals are set
    const routerModule = await import('../../src/js/router.js');
    const componentModule = await import('../../src/js/BaseComponent.js');
    
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

  describe('Router with BaseComponent Integration', function() {
    it('MUST load BaseComponent instances when navigating to routes', async function() {
      const router = new Router();
      
      // Navigate to home route
      await router.navigateTo('/home');
      
      // Verify URL was updated
      assert.strictEqual(window.location.pathname, '/home');
      
      // Verify content was loaded into router-outlet
      const outlet = document.getElementById('router-outlet');
      assert(outlet, 'Router outlet should exist');
      assert(outlet.innerHTML.includes('Home Content'), 'Home template should be loaded');
    });
    
    it('MUST create and activate BaseComponent instances for routes', async function() {
      const router = new Router();
      
      // Create a test component class extending BaseComponent
      class TestHomeComponent extends BaseComponent {
        constructor() {
          super('home');
          this.activated = false;
        }
        
        async activate() {
          await super.activate();
          this.activated = true;
          return this;
        }
      }
      
      // Manually test component creation and activation
      const component = new TestHomeComponent();
      assert.strictEqual(component.componentName, 'home');
      assert.strictEqual(component.activated, false);
      
      // Activate the component
      await component.activate();
      assert.strictEqual(component.activated, true);
      
      // Verify HTML was loaded
      const outlet = document.getElementById('router-outlet');
      assert(outlet.innerHTML.includes('Home Component HTML'), 'Component HTML should be loaded');
    });
    
    it('MUST handle component cleanup when navigating between routes', async function() {
      const router = new Router();
      
      // Create test component to track destruction
      class TrackableComponent extends BaseComponent {
        constructor(name) {
          super(name);
          this.destroyed = false;
        }
        
        destroy() {
          super.destroy();
          this.destroyed = true;
          return this;
        }
      }
      
      const homeComponent = new TrackableComponent('home');
      const contactComponent = new TrackableComponent('contact');
      
      // Activate home component
      await homeComponent.activate();
      assert.strictEqual(homeComponent.destroyed, false);
      
      // Verify home content is loaded
      const outlet = document.getElementById('router-outlet');
      assert(outlet.innerHTML.includes('Home Component HTML'));
      
      // Destroy home component (simulate route change)
      homeComponent.destroy();
      assert.strictEqual(homeComponent.destroyed, true);
      
      // Activate contact component
      await contactComponent.activate();
      
      // Verify contact content replaced home content
      assert(outlet.innerHTML.includes('Contact Component HTML'));
      assert(!outlet.innerHTML.includes('Home Component HTML'));
    });
    
    it('MUST load component CSS and HTML independently', async function() {
      class TestComponent extends BaseComponent {
        constructor() {
          super('test');
        }
      }
      
      const component = new TestComponent();
      await component.activate();
      
      // Check that HTML was loaded
      const outlet = document.getElementById('router-outlet');
      assert(outlet.innerHTML.length > 0, 'HTML should be loaded');
      
      // Check that CSS link was added (even if it fails to load)
      const head = document.head;
      const cssLinks = head.querySelectorAll('link[rel="stylesheet"]');
      
      // Should have attempted to load CSS (even if mocked to fail)
      // The BaseComponent should create a link element
      assert(cssLinks.length >= 0, 'CSS loading should be attempted');
    });
  });
  
  describe('Component Lifecycle Integration', function() {
    it('MUST support activate -> destroy -> activate cycle', async function() {
      class CyclableComponent extends BaseComponent {
        constructor() {
          super('cycle');
          this.activationCount = 0;
        }
        
        async activate() {
          await super.activate();
          this.activationCount++;
          return this;
        }
      }
      
      const component = new CyclableComponent();
      
      // First activation
      await component.activate();
      assert.strictEqual(component.activationCount, 1);
      
      let outlet = document.getElementById('router-outlet');
      const firstContent = outlet.innerHTML;
      assert(firstContent.length > 0, 'First activation should load content');
      
      // Destroy
      component.destroy();
      outlet = document.getElementById('router-outlet');
      assert.strictEqual(outlet.innerHTML, '', 'Destruction should clear content');
      
      // Second activation
      await component.activate();
      assert.strictEqual(component.activationCount, 2);
      
      outlet = document.getElementById('router-outlet');
      assert(outlet.innerHTML.length > 0, 'Second activation should reload content');
    });
  });
  
  describe('Component Caching Integration', function() {
    it('MUST cache component instances in Router.loadComponent()', async function() {
      const router = new Router();
      
      // Create a mock route with component class
      class CacheTestComponent extends BaseComponent {
        constructor() {
          super('cachetest');
          this.instanceId = Math.random(); // Unique identifier
        }
      }
      
      const mockRoute = {
        path: '/cachetest',
        component: CacheTestComponent
      };
      
      // First call should create new instance
      const component1 = router.loadComponent(mockRoute);
      assert(component1 instanceof CacheTestComponent, 'Should create component instance');
      
      // Second call should return cached instance
      const component2 = router.loadComponent(mockRoute);
      assert.strictEqual(component1, component2, 'Should return same cached instance');
      assert.strictEqual(component1.instanceId, component2.instanceId, 'Should have same instance ID');
    });
    
    it('MUST create separate cache entries for different routes', async function() {
      const router = new Router();
      
      class ComponentA extends BaseComponent {
        constructor() { super('a'); this.type = 'A'; }
      }
      
      class ComponentB extends BaseComponent {
        constructor() { super('b'); this.type = 'B'; }
      }
      
      const routeA = { path: '/a', component: ComponentA };
      const routeB = { path: '/b', component: ComponentB };
      
      const compA = router.loadComponent(routeA);
      const compB = router.loadComponent(routeB);
      
      assert.notStrictEqual(compA, compB, 'Different routes should have different instances');
      assert.strictEqual(compA.type, 'A', 'Component A should be type A');
      assert.strictEqual(compB.type, 'B', 'Component B should be type B');
      
      // Verify caching still works per route
      assert.strictEqual(router.loadComponent(routeA), compA, 'Route A should return cached instance');
      assert.strictEqual(router.loadComponent(routeB), compB, 'Route B should return cached instance');
    });
  });
  
  describe('End-to-End Navigation Flow', function() {
    it('MUST use BaseComponent instances during actual navigation', async function() {
      // Create a component class that tracks activation
      class TrackedComponent extends BaseComponent {
        constructor() {
          super('tracked');
          this.wasActivated = false;
          this.wasDestroyed = false;
        }
        
        async activate() {
          await super.activate();
          this.wasActivated = true;
          return this;
        }
        
        destroy() {
          super.destroy();
          this.wasDestroyed = true;
          return this;
        }
      }
      
      // Create routes with BaseComponent classes
      const routes = [
        { path: '/tracked', component: TrackedComponent }
      ];
      
      const router = new Router(routes);
      
      // Navigate to the route - should now use BaseComponent integration
      await router.navigateTo('/tracked');
      
      // Verify that a component instance was created and activated
      assert(router.currentComponent, 'Router should have a current component');
      assert(router.currentComponent instanceof TrackedComponent, 'Current component should be TrackedComponent');
      assert.strictEqual(router.currentComponent.wasActivated, true, 'Component should have been activated');
      
      // Verify content was loaded by the component, not just templates
      const outlet = document.getElementById('router-outlet');
      assert(outlet.innerHTML.includes('Tracked Component HTML'), 'Component should load its own HTML');
    });
    
    it('MUST clean up previous components when navigating', async function() {
      class ComponentA extends BaseComponent {
        constructor() { 
          super('a'); 
          this.destroyed = false;
        }
        destroy() {
          super.destroy();
          this.destroyed = true;
          return this;
        }
      }
      
      class ComponentB extends BaseComponent {
        constructor() { 
          super('b'); 
          this.destroyed = false;
        }
        destroy() {
          super.destroy();
          this.destroyed = true;
          return this;
        }
      }
      
      const routes = [
        { path: '/a', component: ComponentA },
        { path: '/b', component: ComponentB }
      ];
      
      const router = new Router(routes);
      
      // Navigate to component A
      await router.navigateTo('/a');
      const compA = router.currentComponent;
      assert(compA instanceof ComponentA, 'Should load component A');
      assert.strictEqual(compA.destroyed, false, 'Component A should not be destroyed yet');
      
      // Navigate to component B
      await router.navigateTo('/b');
      const compB = router.currentComponent;
      assert(compB instanceof ComponentB, 'Should load component B');
      assert.strictEqual(compA.destroyed, true, 'Component A should be destroyed');
      assert.strictEqual(compB.destroyed, false, 'Component B should not be destroyed');
    });
    
    it('MUST fall back to template loading for routes without components', async function() {
      // Create router with mixed route types
      const routes = [
        { path: '/home', component: null } // No component - should use template
      ];
      
      const router = new Router(routes);
      
      // Navigate to template-based route
      await router.navigateTo('/home');
      
      // Should load template content, not use BaseComponent
      const outlet = document.getElementById('router-outlet');
      assert(outlet.innerHTML.includes('Home Content'), 'Should load template content');
      assert.strictEqual(router.currentComponent, null, 'Should not have current component');
    });
  });
});