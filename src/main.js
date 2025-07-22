import './assets/css/style.css';
import data from './data.json';

const categories = data.categories;
let products = data.products;
const filterForm = document.querySelector('form.filter');

filterForm.addEventListener('submit', (event) => {
	console.log('submit')
	event.preventDefault();
	const category = document.querySelector('#category').value
	const minPrice = document.querySelector('#price-from').value
	const maxPrice = document.querySelector('#price-until').value
	const sort = document.querySelector('#sorting').value

	console.log(category, minPrice, maxPrice, sort)

	products = filterAndSortProducts(products, {
		category,
    minPrice,
    maxPrice,
    sort
	})

  loadItems('product', '.products-list', products);
})

const getMinMaxPrice = () => {
	const priceInputs = document.querySelectorAll('input.price-input');
	const prices = products.map(product => product.price);
	const minPrice = Math.min(...prices);
	const maxPrice = Math.max(...prices);
	console.log(minPrice, maxPrice)

	priceInputs.forEach((input) => {
		input.min = minPrice;
		input.max = maxPrice;
	})
}

const filterAndSortProducts = (
  products,
  {
    category = '',
    minPrice = '',
    maxPrice = '',
    sort = ''
  } = {}
) => {
  let result = [...products];

  if (category !== '') {
    result = result.filter(p => p.category === category);
  }

	console.log(result)

  if (minPrice !== '') {
    result = result.filter(p => p.price >= minPrice);
  }

	console.log(result)

  if (maxPrice !== '') {
    result = result.filter(p => p.price <= maxPrice);
  }

	console.log(result)

  if (sort !== '') {
    result.sort((a, b) => {
      switch (sort) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating-asc':
          return a.rating - b.rating;
        case 'rating-desc':
          return b.rating - a.rating;
        case 'alphabetically':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }

  return result;
};

const generateTemplate = (type, item) => {
	switch(type) {
		case "product":
			return `<a class='products-item'>
				<picture class="products-picture">
					<source media="(min-width: 1024px)" srcset="${item.image.desktop}">
					<source media="(min-width: 575px)" srcset="${item.image.tablet}">
					<img src="${item.image.mobile}" alt="${item.name}">
				</picture>
				<div class="products-info">
					<span class="products-name">${item.name}</span>
					<span class="products-price">$${item.price.toLocaleString('en-US')} </span>
					<div class="products-rating">&#11088; ${item.rating}</div>
					<span class="products-category">${item.category}</span>
				</div>
			</a>`;
		break;
		case "category":
			return `<option value="${item}">${item}</option>`;
		break;
		default:
			return ''
	}
}

const renderItem = (type, item) => {
	const template = document.createElement('template');
	template.innerHTML = generateTemplate(type, item);
	return template.content;
}

const loadItems = (type, parentSelector, itemsArray) => {
	products = data.products
	const parent = document.querySelector(parentSelector)
	parent.innerHTML = ''
	const fragment = document.createDocumentFragment();
	
	itemsArray.forEach((item) => {
		fragment.appendChild(renderItem(type, item));
	});

	parent.appendChild(fragment)
}

window.onload = (event) => {
  loadItems('product', '.products-list', products);
  loadItems('category', 'select[name="category"]', categories);
	getMinMaxPrice();
};


