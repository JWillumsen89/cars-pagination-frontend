import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import {
  loadTemplate,
  adjustForMissingHash,
  setActiveLink,
  renderTemplate,

} from "./utils.js"

import { initCars } from "./pages/cars/cars.js";
import { initSite2 } from "./pages/site2/site2.js";
import { initSite3 } from "./pages/site3/site3.js";

window.addEventListener("load", async () => {
  const templateHome = await loadTemplate("./pages/home/home.html")
  const templateCars = await loadTemplate("./pages/cars/cars.html")
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
      "/cars": () => {
        renderTemplate(templateCars, "content")
        initCars(1);
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