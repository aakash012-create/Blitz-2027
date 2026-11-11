# Blitzschlag 2027 — The Exhibition
Public, scroll-driven cultural festival website for MNIT Jaipur. Uses HTML, CSS, JavaScript, React and Node.js. All fonts use system fallbacks, and the React runtime and scene artwork are included.

## Start in VS Code
1. Run **node server.js** and open http://localhost:3000 in your browser. No npm install or build step is required. Keep the terminal open and use Ctrl+C to stop.

## Visit
Scroll or swipe vertically to move the camera down a continuous 3D exhibition hall. The first two wall displays pass sideways. The camera moves through a copper doorway, turns between adjoining panoramic murals, and follows the display wall in a black-box gallery. A rose-plaster workshop leads to a sixteen-layer twisted passage and a cyan pavilion. Reverse the scroll to retrace the same route. Use the bottom arrows or the chapter index to jump. With page focus, the left/right and up/down keys move between chapters. On small screens, Menu opens the categories. In the print gallery, scrolling moves the camera sideways along one continuous wall of seven programme cards. The bottom arrows move between viewpoints. Choose a print to see its programme details. The question-mark button opens the FAQ. Register opens the final public visitor desk.

## Editing and enquiries
- public/app.js — React screens, scroll choreography, gallery, programme details and forms
- public/walk.js — static room geometry, camera track and camera orientation
- public/tree.js — procedural circuit-tree artwork
- public/program.js — sample events and FAQ copy
- public/style.css — presentation, keyboard focus and reduced-motion layout
- public/art — original generated festival illustrations; these are not documentary event photographs
- server.js — serves the frontend and accepts the contact and sponsorship forms
- The server saves enquiries in data/enquiries.jsonl outside the public folder. Each line is a JSON record. FESTIVAL_DATA_DIR may specify another directory. Submissions are stored on the running server; email forwarding is not configured.

The experience ends at the public visitor desk, before login. The programme, artwork and names of the exhibition rooms are original adaptations for Blitzschlag. Replace sample programme content and add confirmed dates before an official launch.
