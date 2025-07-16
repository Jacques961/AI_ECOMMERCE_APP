import React, { useState, useEffect } from 'react';
import axios from 'axios';

const url = 'http://localhost:8000';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', password: '', is_admin: false });

  const fetchUsers = async () => {
    try{
        const res = await axios.get(`${url}/users`);
        setUsers(res.data);
    } catch (error) {
        console.error("Failed to fetch users", error);
        setUsers([])
    }
  };

  const addUser = async () => {
    try{
        await axios.post(`${url}/users`, form);
        setForm({ name: '', password: '', is_admin: false });
        fetchUsers();
    } catch (error) {
        console.error("Failed to add user.", error);
    }
  };

  const deleteUser = async (id) => {
      try {
            const token = localStorage.getItem('token');
            await axios.delete(`${url}/users/${id}/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
    });
    fetchUsers();
  } catch (error) {
        console.error("Failed to delete user", error)
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>👤 User Manager</h2>

      {/* User Form */}
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <label style={{ marginLeft: '1rem' }}>
        <input
          type="checkbox"
          checked={form.is_admin}
          onChange={(e) => setForm({ ...form, is_admin: e.target.checked })}
        />
        {' '}Is Admin
      </label>
      <br />
      <button onClick={addUser} style={{ marginTop: '0.5rem' }}>
        ➕ Add User
      </button>

      {/* User List */}
      <ul style={{ marginTop: '1rem' }}>
        {users.map((user) => (
          <li key={user.id} style={{ marginBottom: '0.5rem' }}>
            <b>ID:</b> {user.id} — <b>Name:</b> {user.name} — <b>Admin:</b> {user.is_admin ? '✅' : '❌'}
            {' '}
            <button onClick={() => deleteUser(user.id)}>🗑️ Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
