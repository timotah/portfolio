# Pseudo Code

The purpose of this markdown file is to reflect and write out pseudocode of the applicationn

## Layout Structure of homepage

### initial <body></body> element

- the initial element will be a **min-height** of 100vh - this will confirm the whole initial page will take up the window, but allow for scroll

**Units: vh**

### main parent flexboxes

- top taskbar (possible removal)
- middle section (80%)
- timeline section (20%)
- footer - static (possibly be the replacement for the top taskbar?)

footer will not be taking any vh for now, as it will be absolute - taskbar undecided, it should be at top level unable to be covered by the future moving timeline

### inner flexboxes

- will float on their own time

#### first section with text

- i would like them to decrease with the screen size - relative to the viewport, and then for them to collapse into the same box
- this can probably be achieved by at some point changing the flex-direction and background of the section rather than the articles
- in the right box, for skills, i want it to possibly be expandable to see everything, get a minified svg array, and on skills click you can expand it out

# Jan 20th 2025

- do not expand height for everything, have a preset limit on the size of things, and then shrink for mobile
- ensure to have cool transitions and everything, have a written out timeline as well - don't overwhelm people with unfamiliar features
- the side by side approach is cool, but not necessary, have one top bar with the description

one longer white window that says tim radtke, and then the windows to other pages infront of it, on scroll it turns into the navbar
