const cartItemsClass = '.cart__items';

const sumPrice = () => {
  const listItems = document.querySelectorAll('.cart__item');
  let sum = 0;
  listItems.forEach((item) => {
    const itemText = item.innerText.split(' ');
    const price = itemText[itemText.length - 1];
    sum += Number(price.split('').splice(1).join(''));
  });
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerText = `Valor Total: ${sum.toFixed(2)}`;
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

function cartItemClickListener(event) {
  event.target.remove();
  const cartItems = document.querySelector(cartItemsClass);
  localStorage.setItem('cartItems', cartItems.innerHTML);
  sumPrice();
}

function createCartItemElement({ sku, name, salePrice, image }) {
  const li = document.createElement('li');
  const img = document.createElement('img');
  console.log(image);
  img.src = image;
  img.className = 'cart__image';
  li.className = 'cart__item';
  li.innerText = `Product: ${name} 
  Price: $${salePrice}`;
  li.appendChild(document.createElement('br'));
  li.appendChild(img);
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const eachItemOnItems = async (item) => {
  document.querySelector('.loading').style.visibility = "visible";
  const items = document.querySelector('.items');
  const data = await fetchProducts(item);
  const products = data.results;
  products.forEach((product) => {
    const obj = {
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    };
    items.appendChild(createProductItemElement(obj));
  });
  document.querySelector('.loading').style.visibility = "hidden";
};

const adicionaItem = async (e) => {
  const cartItems = document.querySelector(cartItemsClass);
  const itemSku = e.target.parentNode.firstChild.innerText;
  const item = await fetchItem(itemSku);
  document.querySelector('.empty-cart').style.visibility = 'visible';
  const obj = {
    sku: item.id,
    name: item.title,
    salePrice: item.price,
    image: item.thumbnail,
  };
  cartItems.appendChild(createCartItemElement(obj));
  localStorage.setItem('cartItems', cartItems.innerHTML);
  sumPrice();
  
};

const emptCart = () => {
  const cartItems = document.querySelector(cartItemsClass);
  cartItems.innerHTML = '';
  sumPrice();
  localStorage.setItem('cartItems', cartItems.innerHTML);
  document.querySelector('.empty-cart').style.visibility = 'hidden';
};

const searchItem = async () => {
  const input = document.querySelector('.search__item').value;
  const items = document.querySelector('.items');
  items.innerHTML = '';
  await eachItemOnItems(input);
  buttonListener();
}

const buttonListener = () => {
  const buttonAddItem = document.querySelectorAll('.item__add');
  buttonAddItem.forEach((button) => {
    button.addEventListener('click', adicionaItem);
  });
}

window.onload = async () => {
  document.querySelector('.loading').style.visibility = "hidden"; 
  const cartItems = document.querySelector(cartItemsClass);
  const searchButton = document.querySelector('.search__button');
  cartItems.innerHTML = localStorage.getItem('cartItems');
  cartItems.addEventListener('click', cartItemClickListener);
  buttonListener();
  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.style.visibility = 'hidden';
  emptyCart.addEventListener('click', emptCart);

  searchButton.addEventListener('click', searchItem);
};
