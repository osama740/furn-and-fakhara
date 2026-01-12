document.addEventListener("DOMContentLoaded", () => {

  // ===== ELEMENTS =====
  const cartButton = document.getElementById("cartButton");
  const cartCount = document.getElementById("cartCount");
  const backToTop = document.getElementById("backToTop");
  const subNavLinks = document.querySelectorAll(".sub-nav a");
  const mainNavLinks = document.querySelectorAll(".main-nav a");
  const sections = document.querySelectorAll("section.sub-section");

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

  // ===== OPEN POPUP WHEN CLICK "اطلب" =====
  document.querySelectorAll(".order-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      currentItem = btn.closest(".item");
      orderNoteInput.value = "";
      orderPopup.classList.add("show");
    });
  });

  // ===== CLOSE POPUP =====
  closePopup.addEventListener("click", () => {
    orderPopup.classList.remove("show");
    currentItem = null;
  });

  // ===== CONFIRM ADD TO CART =====
  confirmOrderBtn.addEventListener("click", () => {
    if (!currentItem) return;

    const itemName = currentItem.querySelector("h4").innerText;
    const note = orderNoteInput.value.trim();

    // الحصول على السعر والنص المختار
    let selectedOption = "";
    let price = 0;

    const radios = currentItem.querySelectorAll("input[type='radio']");
    if (radios.length) {
      radios.forEach(r => {
        if (r.checked) {
          selectedOption = r.parentNode.textContent.replace(r.parentNode.querySelector(".price").innerText, '').trim();
          price = parseInt(r.parentNode.querySelector(".price").innerText.replace(/,/g, '').replace(/\s*L\.L/i, ''));
        }
      });
    } else {
      const priceEl = currentItem.querySelector(".price");
      if (priceEl) price = parseInt(priceEl.innerText.replace(/,/g, '').replace(/\s*L\.L/i, ''));
    }

    const finalName = selectedOption ? `${itemName} (${selectedOption})` : itemName;

    cart.push({ name: finalName, price, note });
    updateCart();
    orderPopup.classList.remove("show");
    currentItem = null;
  });

  // ===== UPDATE CART =====
  function updateCart() {
    cartItemsList.innerHTML = "";
    let total = 0;

    cart.forEach((item, i) => {
      total += item.price || 0;
      const li = document.createElement("li");
      li.innerHTML = `
        <div>${item.name}${item.price ? ' - ' + item.price.toLocaleString() + ' L.L' : ''}${item.note ? ' <span class="note">ملاحظة: ' + item.note + '</span>' : ''}</div>
        <button class="remove">×</button>
      `;
      li.querySelector(".remove").addEventListener("click", () => {
        cart.splice(i, 1);
        updateCart();
      });
      cartItemsList.appendChild(li);
    });

    cartCount.innerText = cart.length;

    // تحديث المجموع النهائي
    const totalEl = document.getElementById("cart-total");
    if (totalEl) totalEl.innerText = "المجموع: " + total.toLocaleString() + " L.L";
  }

  // ===== CART PANEL =====
  cartButton.addEventListener("click", () => cartPanel.classList.add("show"));
  closeCartBtn.addEventListener("click", () => cartPanel.classList.remove("show"));
  clearCartBtn.addEventListener("click", () => {
    cart = [];
    updateCart();
    cartPanel.classList.remove("show");
  });

  // ===== SEND TO WHATSAPP =====
  sendWhatsappBtn.addEventListener("click", () => {
    if (!cart.length) return;

    let text = "طلبات من فرن & فخارة:\n"; // بدون ايموجي
    cart.forEach((item, i) => {
      text += `${i+1}. ${item.name}${item.price ? ' - ' + item.price.toLocaleString() + ' L.L' : ''}`;
      if (item.note) text += ` (ملاحظة: ${item.note})`;
      text += "\n";
    });

    let total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
    text += `المجموع النهائي: ${total.toLocaleString()} L.L`;

    const phone = "96176484273";
    window.open("https://wa.me/" + phone + "?text=" + encodeURIComponent(text), "_blank");
  });

  // ===== BACK TO TOP =====
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // ===== HIGHLIGHT NAV =====
  function highlightNav() {
    const scrollY = window.scrollY + 150;

    let subActive = false;
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
        subNavLinks.forEach(link => link.classList.remove("active"));
        const activeLink = document.querySelector(`.sub-nav a[href="#${sec.id}"]`);
        if (activeLink) activeLink.classList.add("active");
        subActive = true;
      }
    });

    if (!subActive) subNavLinks.forEach(link => link.classList.remove("active"));

    // Main nav
    mainNavLinks.forEach(link => link.classList.remove("active"));
    if (subActive) mainNavLinks[0].classList.add("active");
    else if (scrollY >= document.getElementById("drinks").offsetTop) mainNavLinks[1].classList.add("active");
    else if (scrollY >= document.getElementById("desserts").offsetTop) mainNavLinks[2].classList.add("active");
  }

  window.addEventListener("scroll", highlightNav);
  highlightNav();

  // ===== SMOOTH SCROLL =====
  [...subNavLinks, ...mainNavLinks].forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

});
