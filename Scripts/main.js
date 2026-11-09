/* =========================================
   THE LITTLE TABLE CO.
   Main JavaScript File
   ========================================= */

// Run JavaScript after the HTML document is ready.
document.addEventListener("DOMContentLoaded", () => {
  // Identify that JavaScript is active.
  document.documentElement.classList.add("js");

  console.log("The Little Table Co. JavaScript loaded successfully.");

  // =========================================
  // TEMPLATE SEARCH, FILTER AND SORT
  // =========================================

  const templateGrid = document.querySelector(".template-grid");
  const searchInput = document.getElementById("templateSearch");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortSelect = document.getElementById("templateSort");
  const templateCount = document.getElementById("templateCount");
  const noTemplatesMessage = document.getElementById("noTemplatesMessage");

  if (
    templateGrid &&
    searchInput &&
    categoryFilter &&
    sortSelect &&
    templateCount &&
    noTemplatesMessage
  ) {
    const templateCards = Array.from(
      templateGrid.querySelectorAll(".template-card"),
    );

    function filterAndSortTemplates() {
      const searchTerm = searchInput.value.toLowerCase().trim();
      const selectedCategory = categoryFilter.value.toLowerCase();
      const sortOrder = sortSelect.value;

      const categoryNames = {
        adventure: "adventure theme",
        magical: "magical theme",
        action: "action theme",
        exploration: "exploration theme",
        sports: "sports theme",
        wild: "wild adventure",
      };

      const matchingCards = templateCards.filter((card) => {
        const cardText = card.textContent.toLowerCase();
        const categoryLabel =
          card
            .querySelector(".template-label")
            ?.textContent.toLowerCase()
            .trim() || "";

        const matchesSearch = cardText.includes(searchTerm);

        const matchesCategory =
          selectedCategory === "all" ||
          categoryLabel === categoryNames[selectedCategory];

        return matchesSearch && matchesCategory;
      });

      matchingCards.sort((a, b) => {
        const nameA = a.querySelector("h3")?.textContent.trim() || "";
        const nameB = b.querySelector("h3")?.textContent.trim() || "";

        return sortOrder === "az"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });

      templateCards.forEach((card) => {
        card.hidden = !matchingCards.includes(card);
      });

      matchingCards.forEach((card) => {
        templateGrid.appendChild(card);
      });

      templateCount.textContent = `Showing ${matchingCards.length} of ${templateCards.length} templates`;

      noTemplatesMessage.hidden = matchingCards.length !== 0;
    }

    searchInput.addEventListener("input", filterAndSortTemplates);
    categoryFilter.addEventListener("change", filterAndSortTemplates);
    sortSelect.addEventListener("change", filterAndSortTemplates);

    filterAndSortTemplates();
  }
});
