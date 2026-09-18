import dayjs from 'dayjs';
import { formatMoney } from '../../utils/money';
import { DeliveryOptions } from './DeliveryOptions';
import axios from 'axios';
import { useState } from 'react';

export const OrderSummary = ({ cart, deliveryOptions, loadCart }) => {
  return (
    <div className="order-summary">
      {deliveryOptions.length > 0 &&
        cart.map((cartItem) => (
          <CartItem
            key={cartItem.productId}
            cartItem={cartItem}
            deliveryOptions={deliveryOptions}
            loadCart={loadCart}
          />
        ))}
    </div>
  );
};


const CartItem = ({ cartItem, deliveryOptions, loadCart }) => {

  const [quantity, setQuantity] = useState(cartItem.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  const selectedDeliveryOption = deliveryOptions.find((deliveryOption) => {
    return deliveryOption.id === cartItem.deliveryOptionId;
  });


  const deleteCartItem = async () => {
    await axios.delete(`/api/cart-items/${cartItem.productId}`);
    await loadCart();
  };


  const updateCartItem = async () => {
    setIsUpdating(true);

    await axios.put(`/api/cart-items/${cartItem.productId}`, {
      quantity: Number(quantity)
    });

    await loadCart();

    setIsUpdating(false);
  };


  return (
    <div className="cart-item-container">

      <div className="delivery-date">
        Delivery date:{' '}
        {dayjs(selectedDeliveryOption.estimatedDeliveryTimeMs)
          .format('dddd, MMMM D')}
      </div>

      <div className="cart-item-details-grid">

        <img
          className="product-image"
          src={cartItem.product.image}
        />

        <div className="cart-item-details">

          <div className="product-name">
            {cartItem.product.name}
          </div>

          <div className="product-price">
            {formatMoney(cartItem.product.priceCents)}
          </div>

          <div className="product-quantity">

            <span>
              Quantity:
              
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(event) => {
                  setQuantity(event.target.value);
                }}
                className="quantity-input"
              />

            </span>

            <span
              className="update-quantity-link link-primary"
              onClick={updateCartItem}
            >
              {isUpdating ? 'Updating...' : 'Update'}
            </span>

            <span
              className="delete-quantity-link link-primary"
              onClick={deleteCartItem}
            >
              Delete
            </span>

          </div>
        </div>

        <DeliveryOptions
          cartItem={cartItem}
          deliveryOptions={deliveryOptions}
          loadCart={loadCart}
        />

      </div>
    </div>
  );
};