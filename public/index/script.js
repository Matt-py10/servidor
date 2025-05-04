 
  // ============================
  // 🌗 theme.js
  // ============================
  document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;
  
    if (localStorage.getItem("darkMode") === "enabled") {
      body.classList.add("dark-mode");
      themeToggle.textContent = "🌞";
    }
  
    themeToggle?.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
      localStorage.setItem("darkMode", body.classList.contains("dark-mode") ? "enabled" : "disabled");
      themeToggle.textContent = body.classList.contains("dark-mode") ? "🌞" : "🌝";
    });
  });
  
  
  // ============================
  // 🎵 music.js
  // ============================
  document.addEventListener("DOMContentLoaded", () => {
    const musicToggle = document.getElementById("music-toggle");
    const musicPlayer = document.getElementById("music-player");
    let isPlaying = false;
  
    musicToggle?.addEventListener("click", () => {
      isPlaying ? musicPlayer.pause() : musicPlayer.play();
      isPlaying = !isPlaying;
    });
  });
  
  
  // ============================
  // 📚 books-render.js
  // ============================
  document.addEventListener("DOMContentLoaded", () => {
    const bookList = document.getElementById("book-list");
    const searchInput = document.getElementById("search");
    const modal = document.createElement("div");
  
    function openModal(book) {
      modal.innerHTML = `
        <div class="modal-content">
          <button class="modal-close">&times;</button>
          <img src="${book.image}" alt="${book.title}" class="modal-image"/>
          <div class="modal-text">
            <h2>${book.title}</h2>
            <p>${book.synopsis}</p>
            <button class="modal-button">${book.free ? "Leer" : "Comprar"}</button>
          </div>
        </div>
      `;
      modal.classList.add("floating-modal");
      document.body.appendChild(modal);
      modal.style.display = "flex";
  
      document.querySelector(".modal-button").addEventListener("click", (e) => {
        e.stopPropagation();
        if (book.free) {
          window.open(`libros/${book.title.replace(/\s+/g, "_").toLowerCase()}.pdf`, "_blank");
        } else {
          alert("Por favor, inicia sesión para comprar el libro.");
        }
      });
  
      document.querySelector(".modal-close").addEventListener("click", () => {
        modal.style.display = "none";
      });
    }
  
    function renderBooks() {
      if (!bookList) return;
      bookList.innerHTML = "";
      books.forEach((book, index) => {
        const div = document.createElement("div");
        div.classList.add("book-card");
        div.setAttribute("data-genre", book.category.toLowerCase());
        div.style.animation = `fadeIn 0.3s ease-in-out ${index * 0.1}s both`;
        div.innerHTML = `
          <img src="${book.image}" alt="${book.title}" class="book-image"/>
          <h2 class="book-title">${book.title}</h2>
          <p class="book-category">${book.category}</p>
        `;
        div.addEventListener("click", (event) => {
          event.stopPropagation();
          openModal(book);
        });
        bookList.appendChild(div);
      });
    }
  
    document.addEventListener("click", () => (modal.style.display = "none"));
  
    // Búsqueda
    searchInput?.addEventListener("input", () => {
      const term = searchInput.value.toLowerCase();
      document.querySelectorAll(".book-card").forEach((book) => {
        const title = book.querySelector(".book-title").textContent.toLowerCase();
        book.style.display = title.includes(term) ? "block" : "none";
      });
    });
  
    renderBooks();
  });
  