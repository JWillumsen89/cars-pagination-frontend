import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import {
  loadTemplate,
  adjustForMissingHash,
  setActiveLink,
  renderTemplate,

} from "./utils.js"

import { initSite1 } from "./pages/site1/site1.js";
import { initSite2 } from "./pages/site2/site2.js";
import { initSite3 } from "./pages/site3/site3.js";

window.addEventListener("load", async () => {
  const templateHome = await loadTemplate("./pages/home/home.html")
  const templateSite1 = await loadTemplate("./pages/site1/site1.html")
  const templateSite2 = await loadTemplate("./pages/site2/site2.html")
  const templateSite3 = await loadTemplate("./pages/site3/site3.html")

  const router = new Navigo("/", { hash: true });
  window.router = router

  adjustForMissingHash()
  router
    .hooks({
      before(done, match) {
        setActiveLink("topnav", match.url)
        done()
      }
    })
    .on({
      "/": () => renderTemplate(templateHome, "content"),
      "/site1": () => {
        renderTemplate(templateSite1, "content")
        initSite1();
      },
      "/site2": () => {
        renderTemplate(templateSite2, "content")
        initSite2();
      },
      "/site3": () => {
        renderTemplate(templateSite3, "content")
        initSite3();
      }
    })
    .notFound(() => renderTemplate("No page for this route found", "content"))
    .resolve()
});


window.onerror = (e) => alert(e)