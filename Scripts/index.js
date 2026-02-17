async function getTopRatedProducts() {
    try {
        const response = await fetch("https://fakestoreapi.com/products");
        const products = await response.json();

        const top3 = products
            .filter(product => product.rating && product.rating.rate != null)
            .sort((a, b) => b.rating.rate - a.rating.rate)
            .slice(0, 3);

        displayProducts(top3);

    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

const displayProducts = (products) => {
    const trendingProducts = document.getElementById("trending-products");
    trendingProducts.innerHTML = "";

    products.forEach(product => {
        const card = document.createElement("div");
        card.innerHTML = `
        <div class="card bg-base-100 border border-base-200 shadow-sm">
            <figure class="bg-base-200">
                <img class="h-56 w-full object-contain p-6" src="${product.image}" alt="${product.title}">
            </figure>
            <div class="card-body">
                <div class="flex items-center justify-between">
                    <span class="badge badge-outline text-primary font-semibold bg-gray-100">${product.category}</span>
                    <div class="flex items-center gap-2 text-sm text-base-content/70">
                        <span class="text-warning">★</span>
                        <span>${product.rating.rate}</span>
                        <span>(${product.rating.count})</span>
                    </div>
                </div>
                <h3 class="font-semibold leading-snug">${product.title.slice(0, 40)}</h3>
                <p class="text-lg font-bold">$${product.price}</p>
                <div class="card-actions justify-between items-center mt-2">
                    <button class="btn btn-outline btn-sm w-[48%]"><i class="fa-regular fa-eye"></i>Details</button>
                    <button class="btn btn-primary btn-sm w-[48%]"><i class="fa-solid fa-cart-shopping"></i>Add</button>
                </div>
            </div>
        </div>
    `;
    trendingProducts.appendChild(card);
    });
};

getTopRatedProducts();
