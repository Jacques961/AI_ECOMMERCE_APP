import React, { useState, useEffect } from 'react';
import axios from 'axios';

const url = 'http://localhost:8000';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', category: '', price: '', image: '', id: null });

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${url}/products`);
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch Products", error);
    }
  };

  const addProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${url}/products`,
        { ...form, price: parseFloat(form.price) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForm({ name: '', category: '', price: '', image: '', id: null });
      fetchProducts();
    } catch (error) {
      console.error("Failed to add product", error.response?.data || error.message);
    }
  };

  const updateProduct = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${url}/products/${id}`,
        { ...form, price: parseFloat(form.price) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForm({ name: '', category: '', price: '', image: '', id: null });
      fetchProducts();
    } catch (error) {
      console.error("Failed to update product", error.response?.data || error.message);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${url}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📦 Product Manager</h2>

      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />
      <input
        name="price"
        placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />
      <input
        name="image"
        placeholder="Image URL"
        value={form.image}
        onChange={(e) => setForm({ ...form, image: e.target.value })}
      />

      {form.id ? (
        <button
          onClick={() => {
            updateProduct(form.id);
          }}
        >
          Update Product
        </button>
      ) : (
        <button onClick={addProduct}>Add Product</button>
      )}

      <ul>
        {products.map((p) => (
          <li key={p.id} style={{ marginBottom: '1rem' }}>
            <img
              src={p.image}
              alt={p.name}
              width="100"
              style={{ display: 'block', marginBottom: '0.5rem' }}
            />
            <b>ID: {p.id}</b> — {p.name} (${p.price})
            <button onClick={() => deleteProduct(p.id)}>🗑️</button>
            <button
              onClick={() =>
                setForm({
                  id: p.id,
                  name: p.name,
                  category: p.category,
                  price: p.price.toString(),
                  image: p.image,
                })
              }
              style={{ marginLeft: '0.5rem' }}
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}