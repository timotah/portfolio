import { JSDOM } from 'jsdom';
import { expect } from 'chai';
import BaseComponent from '../../src/js/BaseComponent.js';

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

// Mock fetch for testing
global.fetch = async (url) => {
  console.log('Mocked fetch called with:', url);
  
  if (url.includes('test.html') || url.includes('/pages/') && url.includes('.html')) {
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

describe('BaseComponent Contract Tests', () => {
  let component;
  
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '<main id="router-outlet"></main>';
    component = new BaseComponent('test');
  });

  describe('activate() contract', () => {
    it('MUST load component CSS when activated', async () => {
      await component.activate();
      const linkElements = document.querySelectorAll('link[rel="stylesheet"]');
      const hasComponentCSS = Array.from(linkElements).some(link => 
        link.href.includes('test.css')
      );
      expect(hasComponentCSS).to.be.true;
    });

    it('MUST load component HTML into router-outlet when activated', async () => {
      await component.activate();
      const outlet = document.getElementById('router-outlet');
      expect(outlet.innerHTML).to.not.be.empty;
    });

    it('MUST be idempotent - multiple calls should not duplicate resources', async () => {
      await component.activate();
      await component.activate();
      const linkElements = document.querySelectorAll('link[rel="stylesheet"]');
      const cssLinks = Array.from(linkElements).filter(link => 
        link.href.includes('test.css')
      );
      expect(cssLinks.length).to.equal(1);
    });

    it('MUST return component instance for method chaining', async () => {
      const result = await component.activate();
      expect(result).to.equal(component);
    });
  });

  describe('destroy() contract', () => {
    beforeEach(async () => {
      await component.activate();
    });

    it('MUST remove component CSS when destroyed', () => {
      component.destroy();
      const linkElements = document.querySelectorAll('link[rel="stylesheet"]');
      const hasComponentCSS = Array.from(linkElements).some(link => 
        link.href.includes('test.css')
      );
      expect(hasComponentCSS).to.be.false;
    });

    it('MUST clear component HTML from router-outlet when destroyed', () => {
      component.destroy();
      const outlet = document.getElementById('router-outlet');
      expect(outlet.innerHTML).to.be.empty;
    });

    it('MUST be safe to call multiple times', () => {
      component.destroy();
      expect(() => component.destroy()).to.not.throw();
    });

    it('MUST allow reactivation after destruction', async () => {
      component.destroy();
      await component.activate();
      const outlet = document.getElementById('router-outlet');
      expect(outlet.innerHTML).to.not.be.empty;
    });
  });
});