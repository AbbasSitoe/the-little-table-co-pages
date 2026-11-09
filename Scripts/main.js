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

  // =========================================
  // TEMPLATE IMAGE LIGHTBOX
  // =========================================

  const templateImages = Array.from(
    document.querySelectorAll(".template-card img"),
  );

  if (templateImages.length > 0) {
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Template image gallery");

    lightbox.innerHTML = `
            <button class="lightbox-close" aria-label="Close gallery">&times;</button>
            <button class="lightbox-prev" aria-label="Previous image">&#10094;</button>
            <img class="lightbox-image" src="" alt="">
            <button class="lightbox-next" aria-label="Next image">&#10095;</button>
            <p class="lightbox-caption"></p>
        `;

    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector(".lightbox-image");
    const caption = lightbox.querySelector(".lightbox-caption");
    const closeButton = lightbox.querySelector(".lightbox-close");
    const previousButton = lightbox.querySelector(".lightbox-prev");
    const nextButton = lightbox.querySelector(".lightbox-next");

    let currentImageIndex = 0;

    function showImage(index) {
      currentImageIndex =
        (index + templateImages.length) % templateImages.length;

      const selectedImage = templateImages[currentImageIndex];

      lightboxImage.src = selectedImage.src;
      lightboxImage.alt = selectedImage.alt || "Template preview";

      caption.textContent = `${currentImageIndex + 1} of ${templateImages.length}`;
    }

    function openLightbox(index) {
      showImage(index);
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden";
      closeButton.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove("active");
      document.body.style.overflow = "";
    }

    templateImages.forEach((image, index) => {
      image.addEventListener("click", (event) => {
        event.preventDefault();
        openLightbox(index);
      });
    });

    closeButton.addEventListener("click", closeLightbox);

    previousButton.addEventListener("click", () => {
      showImage(currentImageIndex - 1);
    });

    nextButton.addEventListener("click", () => {
      showImage(currentImageIndex + 1);
    });

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (!lightbox.classList.contains("active")) return;

      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") {
        showImage(currentImageIndex - 1);
      }
      if (event.key === "ArrowRight") {
        showImage(currentImageIndex + 1);
      }
    });
  }
});
