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

  // =========================================
  // PACKAGE SERVICES ACCORDION
  // =========================================

  const packageDetails = document.querySelectorAll(
    ".full-package-card .package-detail",
  );

  packageDetails.forEach((detail, index) => {
    const heading = detail.querySelector("h4");
    const list = detail.querySelector("ul");

    // Only make the "Services Included" section expandable.
    if (
      !heading ||
      heading.textContent.trim().toLowerCase() !== "services included" ||
      !list
    ) {
      return;
    }

    const button = document.createElement("button");
    const panel = document.createElement("div");

    const panelId = `package-services-${index + 1}`;

    button.className = "package-accordion-trigger";
    button.type = "button";
    button.textContent = "Services Included";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", panelId);

    panel.className = "package-accordion-panel";
    panel.id = panelId;
    panel.setAttribute("aria-hidden", "true");

    // Move the existing list into the accordion panel.
    heading.replaceWith(button);
    panel.appendChild(list);
    detail.appendChild(panel);

    button.addEventListener("click", () => {
      const isExpanded = button.getAttribute("aria-expanded") === "true";

      button.setAttribute("aria-expanded", String(!isExpanded));
      panel.setAttribute("aria-hidden", String(isExpanded));

      if (isExpanded) {
        panel.classList.remove("is-open");
        panel.style.maxHeight = "0";
      } else {
        panel.classList.add("is-open");
        panel.style.maxHeight = `${panel.scrollHeight}px`;
      }
    });
  });

  // =========================================
  // SUBTLE SCROLL REVEAL ANIMATIONS
  // =========================================

  const revealElements = document.querySelectorAll(
    ".full-package-card, .custom-package-content",
  );

  if (
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
      },
    );

    revealElements.forEach((element) => {
      element.classList.add("scroll-reveal");
      revealObserver.observe(element);
    });
  }

  // =========================================
  // JOHANNESBURG INTERACTIVE MAP
  // =========================================

  const mapElement = document.getElementById("service-area-map");

  if (mapElement && typeof L !== "undefined") {
    // Approximate centre of Johannesburg
    const johannesburg = [-26.2041, 28.0473];

    const map = L.map("service-area-map").setView(johannesburg, 11);

    // Load OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // General service area marker
    const marker = L.marker(johannesburg).addTo(map);

    marker.bindPopup(`
            <strong>The Little Table Co.</strong><br>
            Johannesburg Service Area<br>
            Children's Event Planning and Catering
        `);

    // Approximate coverage area, not an exact boundary
    L.circle(johannesburg, {
      color: "#9E4A7C",
      fillColor: "#D88EA9",
      fillOpacity: 0.15,
      radius: 10000,
      weight: 2,
    }).addTo(map);

    marker.openPopup();
  }

  // =========================================
  // CONTACT FORM AJAX SUBMISSION
  // =========================================

  const contactForm = document.getElementById("contactForm");
  const contactFormStatus = document.getElementById("contactFormStatus");

  if (contactForm && contactFormStatus) {
    contactForm.addEventListener("submit", async (event) => {
      // Prevent the normal page redirect.
      event.preventDefault();

      // Check browser validation.
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      // Find the submit button.
      const submitButton = contactForm.querySelector('button[type="submit"]');

      // Save the original button text.
      const originalButtonText = submitButton.textContent;

      // Show loading state.
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";

      contactFormStatus.textContent = "Sending your message...";
      contactFormStatus.className = "form-status";

      try {
        // FormSubmit AJAX endpoint.
        const formAction = contactForm.action.replace(
          "https://formsubmit.co/",
          "https://formsubmit.co/ajax/",
        );

        // Send the form data.
        const response = await fetch(formAction, {
          method: "POST",
          body: new FormData(contactForm),
          headers: {
            Accept: "application/json",
          },
        });

        // Read FormSubmit response.
        const result = await response.json();

        // Check whether submission succeeded.
        if (response.ok && result.success === "true") {
          contactFormStatus.textContent =
            "Thank you! Your message has been sent successfully.";

          contactFormStatus.className = "form-status form-status-success";

          // Clear the form.
          contactForm.reset();
        } else {
          throw new Error(result.message || "Unable to send your message.");
        }
      } catch (error) {
        console.error("Contact form error:", error);

        contactFormStatus.textContent =
          "Sorry, your message could not be sent. Please try again.";

        contactFormStatus.className = "form-status form-status-error";
      } finally {
        // Restore the button.
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    });
  }
});
