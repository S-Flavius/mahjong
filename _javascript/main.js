document.getElementById("dropDownButton").addEventListener("click", function () {
  let dropDownMenu = document.getElementById("dropdown-menu");
  if (dropDownMenu.style.display === "block") {
    dropDownMenu.style.display = "none";
  } else {
    dropDownMenu.style.display = "block";
  }
})
