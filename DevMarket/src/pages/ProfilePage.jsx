import React, { useState, useEffect } from 'react';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    // PROBLEM: Hardcoded URL, manual token, async/await
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch('https://fakestoreapi.com/users/1', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
            return;
          }
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setUser(data);
        setFormData({
          firstname: data.name?.firstname || '',
          lastname: data.name?.lastname || '',
          email: data.email || '',
          phone: data.phone || '',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = (e) => {
    e.preventDefault();

    // PROBLEM: Hardcoded URL, manual token, .then pattern
    const token = localStorage.getItem('auth_token');

    fetch('https://fakestoreapi.com/users/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: formData.email,
        name: {
          firstname: formData.firstname,
          lastname: formData.lastname,
        },
        phone: formData.phone,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
            return;
          }
          throw new Error('Failed to update profile');
        }
        return res.json();
      })
      .then((data) => {
        setUser({
          ...user,
          email: formData.email,
          name: { firstname: formData.firstname, lastname: formData.lastname },
          phone: formData.phone,
        });
        setEditing(false);
        alert('Profile updated successfully!');
      })
      .catch((err) => {
        alert('Error: ' + err.message);
      });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>⚠️ Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="profile-page">
      <h1>👤 Profile</h1>

      <div className="profile-card">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {user.name?.firstname?.[0]?.toUpperCase()}
            {user.name?.lastname?.[0]?.toUpperCase()}
          </div>
        </div>

        {!editing ? (
          <div className="profile-info">
            <div className="profile-field">
              <label>Name</label>
              <p>
                {user.name?.firstname} {user.name?.lastname}
              </p>
            </div>
            <div className="profile-field">
              <label>Email</label>
              <p>{user.email}</p>
            </div>
            <div className="profile-field">
              <label>Username</label>
              <p>{user.username}</p>
            </div>
            <div className="profile-field">
              <label>Phone</label>
              <p>{user.phone}</p>
            </div>
            <div className="profile-field">
              <label>Address</label>
              <p>
                {user.address?.street}, {user.address?.city} {user.address?.zipcode}
              </p>
            </div>

            <button className="btn btn-primary" onClick={() => setEditing(true)}>
              ✏️ Edit Profile
            </button>
          </div>
        ) : (
          <form className="profile-form" onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label htmlFor="firstname">First Name</label>
              <input
                id="firstname"
                type="text"
                value={formData.firstname}
                onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastname">Last Name</label>
              <input
                id="lastname"
                type="text"
                value={formData.lastname}
                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
