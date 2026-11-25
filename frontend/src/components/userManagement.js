
import "./userManagement.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaSearch,
  FaEdit,
  FaTrash,
  FaBan,
  FaCheckCircle,
  FaTimes,
  FaUsers
} from "react-icons/fa";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000/studentRoute/users";

function UserManagement() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    role: "user"
  });

  const limit = 10;

  const getToken = () => localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to fetch users");
      }

      setUsers(data.users || []);
      setTotalUsers(data.totalUsers || 0);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleEdit = (user) => {
    setEditingUser(user);

    setFormData({
      name: user.name || "",
      email: user.email || "",
      mobileNumber: user.mobileNumber || "",
      role: user.role || "user"
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/${editingUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "User update failed");
      }

      toast.success(data.message || "User updated successfully");
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleBlock = async (user) => {
    const action = user.isBlocked ? "unblock" : "block";

    try {
      const response = await fetch(`${API_URL}/${user._id}/${action}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || `Unable to ${action} user`);
      }

      toast.success(
        data.message || `User ${action}ed successfully`
      );

      fetchUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/${user._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to delete user");
      }

      toast.success(data.message || "User deleted successfully");

      if (users.length === 1 && page > 1) {
        setPage((previousPage) => previousPage - 1);
      } else {
        fetchUsers();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    return (
      (user.name || "").toLowerCase().includes(searchText) ||
      (user.email || "").toLowerCase().includes(searchText) ||
      (user.mobileNumber || "").toString().includes(searchText)
    );
  });

  return (
    <div className="user-management-page">
      <div className="user-management-header">
        <button
          className="user-back-button"
          onClick={() => navigate("/admin-dashboard")}
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        <div className="user-heading">
          <div className="user-heading-icon">
            <FaUsers />
          </div>

          <div>
            <h1>User Management</h1>
            <p>Manage and monitor registered users</p>
          </div>
        </div>
      </div>

      <div className="user-summary-card">
        <div className="user-summary-icon">
          <FaUsers />
        </div>

        <div>
          <p>Total Registered Users</p>
          <h2>{totalUsers}</h2>
        </div>
      </div>

      <div className="user-table-container">
        <div className="user-table-header">
          <div>
            <h2>All Users</h2>
            <p>View, edit, block or remove users</p>
          </div>

          <div className="user-search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search name, email or mobile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="user-table-wrapper">
          <table className="user-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="user-empty-message">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="user-empty-message">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user._id}>
                    <td>{(page - 1) * limit + index + 1}</td>
                    <td className="user-name-cell">{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.mobileNumber || "—"}</td>
                    <td>
                      <span className={`user-role ${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`user-status ${
                          user.isBlocked ? "blocked" : "active"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td>
                      <div className="user-action-buttons">
                        <button
                          className="user-edit-button"
                          title="Edit user"
                          onClick={() => handleEdit(user)}
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="user-block-button"
                          title={user.isBlocked ? "Unblock user" : "Block user"}
                          onClick={() => handleBlock(user)}
                        >
                          {user.isBlocked ? (
                            <FaCheckCircle />
                          ) : (
                            <FaBan />
                          )}
                        </button>

                        <button
                          className="user-delete-button"
                          title="Delete user"
                          onClick={() => handleDelete(user)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="user-pagination">
          <p>
            Page {page} of {totalPages}
          </p>

          <div>
            <button
              disabled={page <= 1 || loading}
              onClick={() => setPage((previousPage) => previousPage - 1)}
            >
              Previous
            </button>

            <button
              disabled={page >= totalPages || loading}
              onClick={() => setPage((previousPage) => previousPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {editingUser && (
        <div className="user-modal-overlay">
          <div className="user-edit-modal">
            <div className="user-modal-header">
              <div>
                <h2>Edit User</h2>
                <p>Update user information</p>
              </div>

              <button
                className="user-modal-close"
                onClick={() => setEditingUser(null)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleUpdate}>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />

              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />

              <label>Mobile Number</label>
              <input
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
              />

              <label>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <div className="user-modal-actions">
                <button
                  type="button"
                  className="user-cancel-button"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </button>

                <button type="submit" className="user-save-button">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
