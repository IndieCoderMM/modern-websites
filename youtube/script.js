const toggleBtn = document.getElementsByClassName("toggle-btn")[0];
const tabContainer = document.getElementsByClassName("tab-container")[0];
const tabButtons = document.getElementsByClassName("tab-btn");
const sectionTitle = document.getElementsByClassName("section-title")[0];

toggleBtn.addEventListener("click", () => {
  tabContainer.classList.toggle("hide");
  toggleBtn.classList.toggle("active-toggle");
});

for (let btn of tabButtons) {
  btn.addEventListener("click", () => {
    for (let tab of tabButtons) {
      if (tab.id === btn.id) tab.classList.add("active-tab");
      else tab.classList.remove("active-tab");
    }
    changeSectionTitle(btn.id);
  });
}

function changeSectionTitle(id) {
  if (id === "tab-trend") {
    sectionTitle.innerHTML = "Trending Right Now";
  } else if (id === "tab-sub") {
    sectionTitle.innerHTML = "Videos from Subscriptions";
  } else {
    sectionTitle.innerHTML = "Top Videos for You";
  }
}

// toggleBtn.addEventListener("click", () => {
//   btnContainer.classList.toggle("active");
// });
