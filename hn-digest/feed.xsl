<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/rss/channel">
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title><xsl:value-of select="title"/></title>
        <style>
          :root { color-scheme: light dark; }
          body { max-width: 720px; margin: 0 auto; padding: 2.5rem 1.25rem 4rem;
            font: 17px/1.7 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif; color: #1a1a1a; background: #fafafa; }
          header { border-bottom: 1px solid #e2e2e2; padding-bottom: 1.25rem;
            margin-bottom: 1rem; }
          h1 { font-size: 1.5rem; margin: 0 0 .25rem; }
          .tagline { color: #666; margin: 0; }
          .note { font-size: .85rem; color: #888; margin-top: .75rem; }
          .note code { background: #eee; padding: .1rem .35rem; border-radius: 4px; }
          article { border-bottom: 1px solid #ececec; padding: 1.75rem 0; }
          article h2 { font-size: 1.15rem; margin: 0 0 .5rem; }
          article h2 a { color: inherit; text-decoration: none; }
          .date { color: #888; font-size: .85rem; margin: 0 0 1rem; }
          .body p { margin: 0 0 .5rem; }
          .body ul { margin: 0 0 1.25rem; padding-left: 1.1rem; list-style: none; }
          .body li { position: relative; margin: .25rem 0; padding-left: 1rem;
            font-size: .92rem; color: #555; }
          .body li::before { content: "\2014"; position: absolute; left: 0;
            color: #aaa; }
          a { color: #1a5fb4; }
          article iframe.digest { width: 100%; border: 0; display: block;
            height: 50vh; background: transparent; }
          @media (prefers-color-scheme: dark) {
            body { color: #e6e6e6; background: #121212; }
            header { border-color: #2c2c2c; } article { border-color: #242424; }
            .tagline, .date, .note { color: #9a9a9a; }
            .body li { color: #a8a8a8; } .body li::before { color: #555; }
            .note code { background: #242424; } a { color: #6ea8fe; }
          }
        </style>
      </head>
      <body>
        <header>
          <h1><xsl:value-of select="title"/></h1>
          <p class="tagline"><xsl:value-of select="description"/></p>
          <p class="note">This is an RSS feed. Paste this page's URL into your
            reader to subscribe, or read the latest briefings below.</p>
        </header>
        <xsl:for-each select="item">
          <article>
            <h2><a href="{link}"><xsl:value-of select="title"/></a></h2>
            <p class="date"><xsl:value-of select="pubDate"/></p>
            <iframe class="digest" sandbox="allow-same-origin allow-popups allow-top-navigation-by-user-activation">
              <xsl:attribute name="srcdoc">
                <xsl:text>&lt;!DOCTYPE html&gt;&lt;html&gt;&lt;head&gt;&lt;meta charset="utf-8"/&gt;&lt;base target="_blank"/&gt;&lt;style&gt;:root{color-scheme:light dark}body{margin:0;font:17px/1.7 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;background:transparent}p{margin:0 0 .6rem}ul{margin:0 0 1.5rem;padding-left:1.1rem;list-style:none}li{position:relative;margin:.25rem 0;padding-left:1rem;font-size:.92rem;color:#555}li::before{content:"\2014";position:absolute;left:0;color:#aaa}a{color:#1a5fb4}@media(prefers-color-scheme:dark){body{color:#e6e6e6}li{color:#a8a8a8}li::before{color:#555}a{color:#6ea8fe}}&lt;/style&gt;&lt;/head&gt;&lt;body&gt;</xsl:text>
                <xsl:value-of select="description"/>
                <xsl:text>&lt;/body&gt;&lt;/html&gt;</xsl:text>
              </xsl:attribute>
            </iframe>
          </article>
        </xsl:for-each>
        <script>
(function () {
  function fit(f) {
    try { f.style.height = f.contentDocument.documentElement.scrollHeight + 'px'; } catch (e) {}
  }
  var frames = document.querySelectorAll('iframe.digest');
  frames.forEach(function (f) {
    f.addEventListener('load', function () { fit(f); });
    if (f.contentDocument) { if (f.contentDocument.readyState === 'complete') fit(f); }
  });
  window.addEventListener('resize', function () { frames.forEach(fit); });
})();
        </script>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
