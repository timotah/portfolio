# Manual Test Plan: Portfolio First Pass

## Devices
- Desktop (Windows, Mac, Linux)
- Mobile (iOS, Android)
- Tablet

## Browsers
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Accessibility
- Keyboard navigation: Tab through all links, sidebar, and main content
- ARIA labels: Confirm with screen reader (NVDA, VoiceOver)
- Focus states: Visible and clear on all interactive elements
- Color contrast: Meets WCAG 2.1 AA
- Responsive layout: No horizontal scroll, readable on all screen sizes

## Performance
- Homepage loads <14kb, <2s on 3G (use dev tools)
- Navigation between pages is instant (client-side)
- Fallback navigation works with JS disabled

## Test Scenarios
1. Load homepage on desktop and mobile
2. Navigate to Projects, About Me, Learning, Contact via nav links
3. Use keyboard (Tab/Shift+Tab) to navigate all links and sidebar
4. Use screen reader to verify ARIA labels and live region updates
5. Download resume PDF from About Me
6. Confirm empty states for Projects, Learning, Contact if no data
7. Disable JS and verify navigation still works
8. Check performance metrics in browser dev tools
