"use strict";

document.getElementById("dropDownButton").addEventListener("click", function () {
  var dropDownMenu = document.getElementById("dropdown-menu");
  if (dropDownMenu.style.display === "none") {
    dropDownMenu.style.display = "block";
  } else {
    dropDownMenu.style.display = "none";
  }
});