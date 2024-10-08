import { doTiles } from "./maincontent.js";
import { getConfigFile } from "../util.js";

export function addItensToLateralMenu(jsonResult) {
  //ADD ITENS DO LATERAL MENU (BRANDS)
  jsonResult.sort((a, b) => a.desc.localeCompare(b.desc));

  var menu = document.getElementById("brandMenu");

  jsonResult.forEach((element, index) => {
    let menuItem = document.createElement("li");
    menuItem.className = "pure-menu-item";
    menuItem.setAttribute("data-brand", element.name);

    menuItem.innerHTML = `<a href="#" data-brand="${element.name}"  class="pure-menu-link"> \
                            <i class="fa fa-circle"  data-brand="${element.name}"></i> \
                            ${element.desc} \
                          </a>`;

    menuItem.addEventListener("click", selectBrand);
    menu.appendChild(menuItem);
  });

  let separator = document.createElement("li");
  separator.className = "pure-menu-item";
  separator.innerHTML = `<li class="pure-menu-item"> \
                      <span class='separator'>&nbsp;</span>
                    </li>`;
  menu.appendChild(separator);

  let favorites = document.createElement("li");
  favorites.className = "pure-menu-item";
  favorites.setAttribute("data-brand", "favorites");
  favorites.innerHTML = `<a href="#" data-brand="favorites" class="pure-menu-link"> \
                            <i class="fa fa-star favicon"  data-brand="favorites"></i> \
                            Favorites \
                          </a>`;
  favorites.addEventListener("click", selectBrand);
  menu.appendChild(favorites);
}

// Lateral Menu (brand) Click events
function selectBrand(event) {
  var jsonResult = getConfigFile();
  const element = event.target;
  const selectBrand = element.dataset.brand;

  //Remove pure-menu-selected-background from previous selected brand
  var previous = document.querySelector(".pure-menu-selected-background");
  if (previous) previous.classList.remove("pure-menu-selected-background");

  //Add selected-class to selected button
  const menuItem = document.querySelector(`li[data-brand='${selectBrand}']`);
  menuItem.classList.add("pure-menu-selected-background");

  if (selectBrand == "favorites") {
    doTiles(
      "favorites",
      jsonResult.systems.filter((system) => system.favorite == "true")
    );
  } else {
    doTiles(
      selectBrand,
      jsonResult.systems.filter((system) => system.brand == selectBrand)
    );
  }
}
