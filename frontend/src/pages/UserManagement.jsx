import { useState } from "react";
import { FaTrashAlt, FaUserCircle, FaUserPlus } from "react-icons/fa";
import AddUserModal from "../components/AddUserModal";
import "../styles/UserManagement.css";

const UserManagement = ({ users, onAddUser, onDeleteUser, canEdit }) => {
  const [showModal, setShowModal] = useState(false);

  const addUser = async (newUser) => {
    await onAddUser(newUser);
    setShowModal(false);
  };

  return (
    <div className="user-page">
      <div className="user-header">
        <div>
          <h1>User Management</h1>
          <p>View registered users and their roles.</p>
        </div>

        {canEdit ? (
          <button className="add-user-btn" onClick={() => setShowModal(true)}>
            <FaUserPlus /> Add User
          </button>
        ) : null}
      </div>

      <div className="user-card">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Username</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.id || user._id || index}>
                  <td className="user-info">
                    <span className="avatar">
                      <FaUserCircle />
                    </span>
                    <span>{user.fullName}</span>
                  </td>
                  <td>@{user.username}</td>
                  <td>
                    <span className="role-pill">{user.role}</span>
                  </td>
                  <td>
                    <span className={`status ${String(user.status || "Active").toLowerCase() === "active" ? "active" : ""}`}>
                      {user.status || "Active"}
                    </span>
                    {canEdit && user.role !== "Admin" ? (
                      <button
                        type="button"
                        onClick={() => onDeleteUser(user.id || user._id).catch((error) => alert(error.message))}
                        style={{
                          marginLeft: 12,
                          border: "none",
                          background: "transparent",
                          color: "#dc2626",
                          cursor: "pointer",
                        }}
                      >
                        <FaTrashAlt />
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
                  No users added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && canEdit ? <AddUserModal onClose={() => setShowModal(false)} onAddUser={addUser} /> : null}
    </div>
  );
};

export default UserManagement;
