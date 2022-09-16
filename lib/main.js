"use strict";

document.getElementById("dropDownButton").addEventListener("click", function () {
  var dropDownMenu = document.getElementById("dropdown-menu");
  if (dropDownMenu.style.display === "block") {
    dropDownMenu.style.display = "none";
  } else {
    dropDownMenu.style.display = "block";
  }
});