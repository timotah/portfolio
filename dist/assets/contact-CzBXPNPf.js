const n=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact | Tim Radtke</title>
  <link rel="stylesheet" href="/pages/contact/contact.css">
  <link rel="stylesheet" href="/global.css">
</head>
<body>
  <header aria-label="Site Header">
    <nav aria-label="Main Navigation">
      <ul>
<li><a href="/">Home</a></li>
<li><a href="/aboutme">About Me</a></li>
<li><a href="/projects">Projects</a></li>
<li><a href="/learning">Current Learning</a></li>
<li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  </header>
  <main id="main-content" aria-live="polite">
    <section aria-label="Contact Methods">
      <h1>Contact</h1>
      <ul id="contact-list"></ul>
      <div id="contact-empty" style="display:none;">
        <p>No contact methods available.</p>
      </div>
    </section>
  </main>
  <script type="module" src="/pages/contact/contact.js"><\/script>
<script type="module" src="/js/router.js"><\/script>
</body>
</html>
`;export{n as default};
