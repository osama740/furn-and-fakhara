document.addEventListener("DOMContentLoaded", function() {

  // ===== ELEMENTS =====
  const cartButton = document.getElementById("cartButton");
  const cartCount = document.getElementById("cartCount");
  const backToTop = document.getElementById("backToTop");
  const subNavLinks = document.querySelectorAll(".sub-nav a");
  const sections = document.querySelectorAll("section.sub-section");
  const mainNavLinks = document.querySelectorAll(".main-nav a");

  const cartPanel = document.getElementById("cart-panel");
  const cartItemsList = document.getElementById("cart-items");
  const closeCartBtn = document.getElementById("close-cart");
  const clearCartBtn = document.getElementById("clear-cart");
  const sendWhatsappBtn = document.getElementById("send-whatsapp");

  const orderPopup = document.getElementById("order-popup");
  const closePopup = document.querySelector(".close-popup");
  const confirmOrderBtn = document.getElementById("confirm-order");
  const orderNoteInput = document.getElementById("order-note");

  let cart = [];
  let currentItem = null;
  let selectedOption = "";
  let selectedPrice = 0;

  // ===== OPEN POPUP ONLY WHEN ADDING ITEM =====
  document.querySelectorAll(".order-btn").forEach(btn => {
    btn.addEventListener("click", function() {
      currentItem = this.closest(".item");
      orderNoteInput.value = "";

      // Get selected radio option if exists
      const radios = currentItem.querySelectorAll("input[type='radio']");
      selectedOption = "";
      selectedPrice = 0;
      radios.forEach(r => {
        if(r.checked){
          selectedOption = r.parentNode.textContent.trim();
          // Extract price from the label text
          const match = selectedOption.match(/\d+/g);
          if(match) selectedPrice = parseInt(match.join(''));
        }
      });

      // If no radio selected, fallback to .price span
      if(selectedPrice === 0){
        const priceEl = currentItem.querySelector(".price");
        if(priceEl){
          const match = priceEl.innerText.match(/\d+/g);
          if(match) selectedPrice = parseInt(match.join(''));
        }
      }

      orderPopup.classList.add("show");
    });
  });

  // ===== CLOSE POPUP =====
  closePopup.addEventListener("click", function() {
    orderPopup.classList.remove("show");
    currentItem = null;
  });

  // ===== CONFIRM ADD TO CART =====
  confirmOrderBtn.addEventListener("click", function() {
    if(!currentItem) return;

    const itemName = currentItem.querySelector("h4").innerText;
    const note = orderNoteInput.value.trim();
    const finalName = selectedOption ? `${itemName} (${selectedOption.replace(/\d+/g,'').trim()})` : itemName;

    cart.push({ name: finalName, price: selectedPrice, note: note });
    updateCart();

    orderPopup.classList.remove("show");
    currentItem = null;
  });

  // ===== UPDATE CART =====
  function updateCart() {
    cartItemsList.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {
      total += item.price || 0;

      const li = document.createElement("li");
      li.innerHTML = `
        <div>${item.name}${item.price ? ' - ' + item.price.toLocaleString() + ' L.L' : ''}${item.note ? ' <span class="note">ملاحظة: ' + item.note + '</span>' : ''}</div>
        <button class="remove">×</button>
      `;
      li.querySelector(".remove").addEventListener("click", () => {
        cart.splice(index, 1);
        updateCart();
      });
      cartItemsList.appendChild(li);
    });

    cartCount.innerText = cart.length;

    // Show total
    let totalEl = document.getElementById("cart-total");
    if(!totalEl){
      totalEl = document.createElement("div");
      totalEl.id = "cart-total";
      totalEl.style.marginTop = "10px";
      totalEl.style.fontWeight = "bold";
      totalEl.style.color = "#145214"; // very dark green
      cartItemsList.parentNode.appendChild(totalEl);
    }
    totalEl.innerText = "المجموع: " + total.toLocaleString() + " L.L";
  }

  // ===== SHOW / HIDE CART =====
  function showCart() { cartPanel.classList.add("show"); }
  function hideCart() { cartPanel.classList.remove("show"); }
  cartButton.addEventListener("click", showCart);
  closeCartBtn.addEventListener("click", hideCart);

  // ===== CLEAR CART =====
  clearCartBtn.addEventListener("click", function() {
    cart = [];
    updateCart();
    hideCart();
  });

  // ===== SEND TO WHATSAPP =====
  sendWhatsappBtn.addEventListener("click", function() {
    if(cart.length === 0) return;
    let text = "🍽️ طلبات من فرن & فخارة:\n";
    cart.forEach((item, i) => {
      text += `${i+1}. ${item.name}${item.price ? ' - ' + item.price.toLocaleString() + ' L.L' : ''}`;
      if(item.note) text += ` (ملاحظة: ${item.note})`;
      text += "\n";
    });
    const phone = "96176484273"; 
    const url = "https://wa.me/" + phone + "?text=" + encodeURIComponent(text);
    window.open(url, "_blank");
  });

  // ===== BACK TO TOP =====
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ===== SUB-NAV & MAIN NAV HIGHLIGHT =====
  function highlightNav() {
    const scrollY = window.scrollY + 150;
    let subNavActive = false;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute("id");

      if(scrollY >= top && scrollY < top + height) {
        subNavLinks.forEach(link => link.classList.remove("active"));
        const activeLink = document.querySelector(`.sub-nav a[href="#${id}"]`);
        if(activeLink) activeLink.classList.add("active");
        subNavActive = true;
      }
    });
    if(!subNavActive) subNavLinks.forEach(link => link.classList.remove("active"));

    // Main nav
    const foodSection = document.getElementById("food");
    const drinksSection = document.getElementById("drinks");
    const dessertsSection = document.getElementById("desserts");

    mainNavLinks.forEach(link => link.classList.remove("active"));

    if(subNavActive) mainNavLinks[0].classList.add("active");
    else if(scrollY >= drinksSection.offsetTop && scrollY < drinksSection.offsetTop + drinksSection.offsetHeight)
      mainNavLinks[1].classList.add("active");
    else if(scrollY >= dessertsSection.offsetTop && scrollY < dessertsSection.offsetTop + dessertsSection.offsetHeight)
      mainNavLinks[2].classList.add("active");
  }

  window.addEventListener("scroll", highlightNav);
  highlightNav();

  // ===== SMOOTH SCROLL FOR SUB-NAV =====
  subNavLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if(target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // ===== SMOOTH SCROLL FOR MAIN NAV =====
  mainNavLinks.forEach(link => {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetEl = document.querySelector(targetId);
      if(targetEl) targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

});
