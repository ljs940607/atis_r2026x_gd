// todo: trying removing 'resources/' from NOTIF_WIDGET_DIST if not working

const NOTIF_WIDGET_DIST = 'resources/NotificationsCenterVue';

/**
 * After vite build, transform the HTML to replace script[src] and link[stylesheet] tags with JS
 * which will inject them dynamically at runtime to use window.dsDefaultWebappsBaseUrl.
 * @returns Transformed HTML.
 */
function VitePluginWidget() {
  return {
    name: 'transform-html-to-widget',
    apply: 'build',
    transformIndexHtml: {
      handler(html, context) {
        console.log(html);
        if (context.filename.includes('Widget')) {
          html = `<?xml version="1.0" encoding="UTF-8" ?>\n${html}`;
          const scriptRegex = /<script type="module" crossorigin src="([^"]*)"><\/script>/g;
          const scriptResults = [...html.matchAll(scriptRegex)];
          scriptResults.forEach(([match, result]) => {
            html = html.replace(
              match,
              `
              <!-- from center v1 -->
              <link rel="stylesheet" href="../UIKIT/UIKIT.css" />
    <script type="text/javascript" src="../AmdLoader/AmdLoader.js"></script>
    <script
      type="text/javascript"
      src="../WebappsUtils/WebappsUtils.js"
    ></script>
               <!-- Application JS Start -->
    <script>
      //
      function loadCenterV2() {
        //
        widget.addEvent("onLoad", function () {
          var baseUrl = window.dsDefaultWebappsBaseUrl.replace("../", "");
          //
          var script = document.createElement("script");
          script.setAttribute(
            "src",
            baseUrl +
              '${NOTIF_WIDGET_DIST}${result.replace('./', '')}'
          );
          script.setAttribute("type", "module");
          document.head.appendChild(script);
          //
          var link = document.createElement("link");
          link.setAttribute(
            "href",
            baseUrl +
              '${NOTIF_WIDGET_DIST}${result.replace('./', '')}'
          );
          link.setAttribute("rel", "stylesheet");
          document.head.appendChild(link);
          //
          var link = document.createElement("link");
          link.setAttribute("href", "../../..");
          link.setAttribute("rel", "webappsBaseUrl");
          document.head.appendChild(link);
        });
      }
      //
    `
            );
          });
          const linkRegex = /<link rel="stylesheet" crossorigin href="([^"]*)">/g;
          const linkResults = [...html.matchAll(linkRegex)];
          linkResults.forEach(([match, result]) => {
            html = html.replace(
              match,
              `
              function loadCenter() {
        
              loadCenterV2();

              }
      //
      loadCenter();
    </script>
    <!-- Application JS End -->
              `
            );
          });

          // Update webappsBaseUrl for widget config so window.dsDefaultWebappsBaseUrl will be set as expected
          html = html.replace('<link rel="webappsBaseUrl">', '<link rel="webappsBaseUrl" href="../../..">');
        }
        return html;
      },
    },
  };
}

export default VitePluginWidget;
