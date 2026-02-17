const productContainer = document.getElementById("product-container");
const categoryContainer = document.getElementById("category-container");

// map API category -> label like your screenshot
const labelMap = {
    "electronics": "Electronics",
    "jewelery": "Jewelery",
    "men's clothing": "Men's Clothing",
    "women's clothing": "Women's Clothing",
    "all": "All",
};

let activeCategory = "all";

const setActiveCategory = (cat) => {
    activeCategory = cat;
    // re-style pills
    [...categoryContainer.querySelectorAll("button")].forEach(btn => {
        const isActive = btn.dataset.cat === cat;
        btn.className = isActive
            ? "btn btn-primary btn-sm rounded-full"
            : "btn btn-outline btn-sm rounded-full";
    });
};

const makePill = (cat, text) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.cat = cat;
    btn.textContent = text;
    btn.className = "btn btn-outline btn-sm rounded-full";
    btn.addEventListener("click", () => {
        setActiveCategory(cat);
        if (cat === "all") loadAllProducts();
        else loadCategoryProducts(cat);
    });
    return btn;
};

const loadCategories = async () => {
    const res = await fetch("https://fakestoreapi.com/products/categories");
    const categories = await res.json();

    categoryContainer.innerHTML = "";
    categoryContainer.appendChild(makePill("all", "All"));

    categories.forEach(cat => {
        categoryContainer.appendChild(makePill(cat, labelMap[cat] || cat));
    });

    setActiveCategory("all");
};

const loadAllProducts = async () => {
    productContainer.innerHTML = skeletonGrid();
    const res = await fetch("https://fakestoreapi.com/products");
    const data = await res.json();
    displayProducts(data);
};

const loadCategoryProducts = async (category) => {
    productContainer.innerHTML = skeletonGrid();
    const res = await fetch(`https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`);
    const data = await res.json();
    displayProducts(data);
};

const displayProducts = (products) => {
    productContainer.innerHTML = "";

    products.forEach(p => {
        const card = document.createElement("div");
        card.className = "card bg-base-100 border border-base-200 shadow-sm";

        card.innerHTML = `
          <figure class="bg-base-200 rounded-t-2xl">
            <img src="${p.image}" alt="${escapeHtml(p.title)}"
                 class="h-56 w-full object-contain p-6" />
          </figure>

          <div class="card-body p-4">
            <div class="flex items-center justify-between">
              <span class="badge badge-outline text-primary font-semibold bg-gray-100">${labelMap[p.category] || p.category}</span>
              <div class="flex items-center gap-1 text-xs text-base-content/70">
                <span class="text-warning">★</span>
                <span>${p.rating?.rate ?? "-"}</span>
                <span>(${p.rating?.count ?? "-"})</span>
              </div>
            </div>

            <h3 class="mt-2 font-semibold text-sm line-clamp-2">${escapeHtml(p.title)}</h3>
            <p class="mt-1 text-base font-bold">$${Number(p.price).toFixed(2)}</p>

            <div class="card-actions justify-between mt-3">
              <button class="btn btn-outline btn-sm w-[48%]"><i class="fa-regular fa-eye"></i>Details</button>
              <button class="btn btn-primary btn-sm w-[48%]"><i class="fa-solid fa-cart-shopping"></i>Add</button>
            </div>
          </div>
        `;

        productContainer.appendChild(card);
    });
};

const skeletonGrid = () => {
    // simple loading skeletons (looks nice)
    return Array.from({ length: 8 }).map(() => `
        <div class="card bg-base-100 border border-base-200 shadow-sm">
          <div class="bg-base-200 h-56 rounded-t-2xl skeleton"></div>
          <div class="card-body p-4 space-y-3">
            <div class="flex justify-between">
              <div class="skeleton h-4 w-24"></div>
              <div class="skeleton h-4 w-20"></div>
            </div>
            <div class="skeleton h-4 w-full"></div>
            <div class="skeleton h-4 w-3/4"></div>
            <div class="skeleton h-5 w-24"></div>
            <div class="flex justify-between gap-3">
              <div class="skeleton h-8 w-1/2"></div>
              <div class="skeleton h-8 w-1/2"></div>
            </div>
          </div>
        </div>
      `).join("");
};

const escapeHtml = (str) =>
    String(str).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

// init
(async function init() {
    await loadCategories();
    await loadAllProducts();
})();