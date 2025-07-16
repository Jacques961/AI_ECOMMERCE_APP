import React, { useState, useEffect } from 'react';
import axios from 'axios';

const url = 'http://localhost:8000';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [form, setForm] = useState({ product_id: '', quantity: 1 });
  const [orders, setOrders] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const interval = setInterval(() => {
      const storedToken = localStorage.getItem('token');
      if (storedToken !== token) {
        setToken(storedToken);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [token]);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${url}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data.items || []);
    } catch (error) {
      console.error("Failed to fetch cart", error);
      setCartItems([]);
    }
  };

  const addItem = async () => {
    try {
      await axios.post(`${url}/cart`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ product_id: '', quantity: 1 });
      fetchCart();
    } catch (error) {
      console.error("Failed to add item", error);
    }
  };

  const deleteItem = async (product_id) => {
    try {
      await axios.delete(`${url}/cart/${product_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (error) {
      console.error("Failed to delete item", error);
    }
  };

  const checkout = async () => {
    try {
      await axios.post(`${url}/checkout`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
      fetchOrders();
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Checkout failed", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${url}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data || []);
    } catch (error) {
      console.error("Failed to fetch orders", error);
      setOrders([]);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCart();
      fetchOrders();
    } else {
      setCartItems([]);
      setOrders([]);
    }
  }, [token]);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>🛒 Cart Manager</h2>

      {/* Add Item Form */}
      <input
        name="product_id"
        placeholder="Product ID"
        value={form.product_id}
        onChange={(e) => setForm({ ...form, product_id: e.target.value })}
      />
      <input
        type="number"
        min={1}
        name="quantity"
        placeholder="Quantity"
        value={form.quantity}
        onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
      />
      <button onClick={addItem}>Add to Cart</button>

      {/* Cart Items List */}
      <ul style={{ marginTop: '1rem' }}>
        {cartItems.length === 0 ? (
          <li>Your cart is empty</li>
        ) : (
          cartItems.map((item) => (
            <li key={item.id} style={{ marginBottom: '0.5rem' }}>
              <b>Product ID:</b> {item.product?.id || item.product_id} — <b>Quantity:</b> {item.quantity}
              <button
                onClick={() => deleteItem(item.product?.id || item.product_id)}
                style={{ marginLeft: '0.5rem' }}
              >
                🗑️ Remove
              </button>
            </li>
          ))
        )}
      </ul>

      <button onClick={checkout} style={{ marginTop: '1rem' }}>
        ✅ Place Order
      </button>

      {/* Order History */}
      <h3 style={{ marginTop: '2rem' }}>📜 Order History</h3>
      <ul>
        {orders.length === 0 ? (
          <li>No orders placed yet</li>
        ) : (
          orders.map((order) => (
            <li key={order.checkout_id}>
              <b>Order ID:</b> {order.checkout_id} —
              <b> Total:</b> ${order.total_price} —
              <b> Date:</b> {order.items[0]?.date ? new Date(order.items[0].date).toLocaleString() : 'N/A'}
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>
                    Product: {item.product_name} (ID: {item.product_id}) — Quantity: {item.quantity} — Unit Price: ${item.unit_price} — Total: ${item.total}
                  </li>
                ))}
              </ul>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
