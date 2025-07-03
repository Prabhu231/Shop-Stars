import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  useEffect(() => {
    const callBackend = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/user`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.data) {
          setUser({
            name: res.data.name,
            email: res.data.email,
            role: res.data.role,
          });
          setDashboardStats({
            totalRatings: res.data.totalRatings || 0,
            totalUsers: res.data.totalUsers || 0,
            totalStores: res.data.totalStores || 0,
          });
        }
      } catch (err) {
        console.log(err);
        navigate("/login");
      }
    };

    callBackend();
  }, []);
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      address: "123 Main St, City",
      role: "Normal User",
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      address: "456 Oak Ave, Town",
      role: "Store Owner",
      rating: 4.5,
    },
    {
      id: 3,
      name: "Carol Williams",
      email: "carol@example.com",
      address: "789 Pine Rd, Village",
      role: "Normal User",
    },
    {
      id: 4,
      name: "David Brown",
      email: "david@example.com",
      address: "321 Elm St, City",
      role: "Store Owner",
      rating: 4.2,
    },
    {
      id: 5,
      name: "Eva Davis",
      email: "eva@example.com",
      address: "654 Maple Dr, Town",
      role: "Normal User",
    },
  ]);

  const [stores, setStores] = useState([
    {
      id: 1,
      name: "Tech Paradise",
      email: "tech@paradise.com",
      address: "100 Tech Blvd, Silicon Valley",
      rating: 4.5,
      userRating: 5,
    },
    {
      id: 2,
      name: "Book Haven",
      email: "info@bookhaven.com",
      address: "200 Library St, Downtown",
      rating: 4.2,
      userRating: 4,
    },
    {
      id: 3,
      name: "Coffee Corner",
      email: "hello@coffeecorner.com",
      address: "300 Brew Ave, Uptown",
      rating: 4.8,
      userRating: null,
    },
    {
      id: 4,
      name: "Fashion Hub",
      email: "style@fashionhub.com",
      address: "400 Style Blvd, Mall District",
      rating: 4.1,
      userRating: 3,
    },
    {
      id: 5,
      name: "Gaming Zone",
      email: "play@gamingzone.com",
      address: "500 Game St, Entertainment District",
      rating: 4.6,
      userRating: null,
    },
  ]);

  const [storeRatings, setStoreRatings] = useState([
    {
      id: 1,
      userName: "Alice Johnson",
      userEmail: "alice@example.com",
      rating: 5,
      date: "2024-01-15",
    },
    {
      id: 2,
      userName: "Bob Smith",
      userEmail: "bob@example.com",
      rating: 4,
      date: "2024-01-14",
    },
    {
      id: 3,
      userName: "Carol Williams",
      userEmail: "carol@example.com",
      rating: 5,
      date: "2024-01-13",
    },
    {
      id: 4,
      userName: "David Brown",
      userEmail: "david@example.com",
      rating: 4,
      date: "2024-01-12",
    },
  ]);

  // Filters and search
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [newRating, setNewRating] = useState(5);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form states
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "Normal User",
  });

  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Filter functions
  const filterUsers = () => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        user.email.toLowerCase().includes(filters.email.toLowerCase()) &&
        user.address.toLowerCase().includes(filters.address.toLowerCase()) &&
        (filters.role === "" || user.role === filters.role)
    );
  };

  const filterStores = () => {
    return stores.filter(
      (store) =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const paginate = (items) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const getTotalPages = (items) => Math.ceil(items.length / itemsPerPage);

  const handleAddUser = (e) => {
    e.preventDefault();
    const newId = Math.max(...users.map((u) => u.id)) + 1;
    setUsers([...users, { ...newUser, id: newId }]);
    setNewUser({
      name: "",
      email: "",
      address: "",
      password: "",
      role: "Normal User",
    });
    setShowAddForm(false);
  };

  const handleAddStore = (e) => {
    e.preventDefault();
    const newId = Math.max(...stores.map((s) => s.id)) + 1;
    setStores([
      ...stores,
      { ...newStore, id: newId, rating: 0, userRating: null },
    ]);
    setNewStore({ name: "", email: "", address: "" });
    setShowAddForm(false);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/password`,
      {
        oldPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (res.data.success) {
      alert("Password updated successfully!");
    } else {
      alert(res.data.message);
    }
  };

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    setStores(
      stores.map((store) =>
        store.id === selectedStore.id
          ? { ...store, userRating: newRating }
          : store
      )
    );
    setShowRatingModal(false);
    setSelectedStore(null);
    setNewRating(5);
  };

  const handleLogout = () => {
    navigate("/login");
  };
  const renderAdminDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Total Users
        </h3>
        <p className="text-3xl font-bold text-blue-600">
          {dashboardStats.totalUsers}
        </p>
      </div>
      <div className="bg-green-50 p-6 rounded-xl border border-green-200">
        <h3 className="text-lg font-semibold text-green-900 mb-2">
          Total Stores
        </h3>
        <p className="text-3xl font-bold text-green-600">
          {dashboardStats.totalStores}
        </p>
      </div>
      <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-900 mb-2">
          Total Ratings
        </h3>
        <p className="text-3xl font-bold text-purple-600">
          {dashboardStats.totalRatings}
        </p>
      </div>
    </div>
  );

  const renderStoreOwnerDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">
          Store Average Rating
        </h3>
        <p className="text-3xl font-bold text-yellow-600">4.5 ⭐</p>
      </div>
      <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200">
        <h3 className="text-lg font-semibold text-indigo-900 mb-2">
          Total Reviews
        </h3>
        <p className="text-3xl font-bold text-indigo-600">
          {storeRatings.length}
        </p>
      </div>
    </div>
  );

  const renderFilters = () => (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Filter by name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="text"
          placeholder="Filter by email"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="text"
          placeholder="Filter by address"
          value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Roles</option>
          <option value="Normal User">Normal User</option>
          <option value="Store Owner">Store Owner</option>
          <option value="System Administrator">System Administrator</option>
        </select>
      </div>
    </div>
  );

  const renderPagination = (totalItems) => {
    const totalPages = getTotalPages(totalItems);
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center space-x-2 mt-6">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-2 border rounded-lg ${
              currentPage === i + 1
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    );
  };

  const renderUsersList = () => {
    const filteredUsers = filterUsers();
    const paginatedUsers = paginate(filteredUsers);

    return (
      <div>
        {renderFilters()}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.role === "System Administrator"
                          ? "bg-red-100 text-red-800"
                          : user.role === "Store Owner"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.rating ? `${user.rating} ⭐` : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {renderPagination(filteredUsers)}
      </div>
    );
  };

  const renderStoresList = () => {
    const filteredStores = filterStores();
    const paginatedStores = paginate(filteredStores);

    return (
      <div>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search stores by name or address"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedStores.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {store.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{store.email}</p>
              <p className="text-sm text-gray-600 mb-3">{store.address}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">
                  Overall Rating: {store.rating} ⭐
                </span>
                {store.userRating && (
                  <span className="text-sm text-blue-600">
                    Your Rating: {store.userRating} ⭐
                  </span>
                )}
              </div>
              {user.role === "Normal User" && (
                <button
                  onClick={() => {
                    setSelectedStore(store);
                    setNewRating(store.userRating || 5);
                    setShowRatingModal(true);
                  }}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {store.userRating ? "Update Rating" : "Rate Store"}
                </button>
              )}
            </div>
          ))}
        </div>
        {renderPagination(filteredStores)}
      </div>
    );
  };

  const renderStoreRatings = () => {
    const paginatedRatings = paginate(storeRatings);

    return (
      <div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedRatings.map((rating) => (
                <tr key={rating.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {rating.userName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rating.userEmail}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rating.rating} ⭐
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rating.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {renderPagination(storeRatings)}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return user.role === "System Administrator"
          ? renderAdminDashboard()
          : renderStoreOwnerDashboard();
      case "users":
        return renderUsersList();
      case "stores":
        return user.role === "Store Owner"
          ? renderStoreRatings()
          : renderStoresList();
      default:
        return null;
    }
  };

  const getTabsForRole = () => {
    switch (user.role) {
      case "System Administrator":
        return [
          { key: "dashboard", label: "Dashboard" },
          { key: "users", label: "Users" },
          { key: "stores", label: "Stores" },
        ];
      case "Normal User":
        return [{ key: "stores", label: "Stores" }];
      case "Store Owner":
        return [
          { key: "dashboard", label: "Dashboard" },
          { key: "stores", label: "Ratings" },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.role}</span>
              <button
                onClick={() => setShowPasswordForm(true)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8">
          {getTabsForRole().map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
          {user.role === "System Administrator" && (
            <button
              onClick={() => setShowAddForm(true)}
              className="ml-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Add New
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div>{renderTabContent()}</div>
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Add New {activeTab === "users" ? "User" : "Store"}
            </h2>
            <form
              onSubmit={activeTab === "users" ? handleAddUser : handleAddStore}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Name"
                value={activeTab === "users" ? newUser.name : newStore.name}
                onChange={(e) =>
                  activeTab === "users"
                    ? setNewUser({ ...newUser, name: e.target.value })
                    : setNewStore({ ...newStore, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={activeTab === "users" ? newUser.email : newStore.email}
                onChange={(e) =>
                  activeTab === "users"
                    ? setNewUser({ ...newUser, email: e.target.value })
                    : setNewStore({ ...newStore, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <textarea
                placeholder="Address"
                value={
                  activeTab === "users" ? newUser.address : newStore.address
                }
                onChange={(e) =>
                  activeTab === "users"
                    ? setNewUser({ ...newUser, address: e.target.value })
                    : setNewStore({ ...newStore, address: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                required
              />
              {activeTab === "users" && (
                <>
                  <input
                    type="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Normal User">Normal User</option>
                    <option value="Store Owner">Store Owner</option>
                    <option value="System Administrator">
                      System Administrator
                    </option>
                  </select>
                </>
              )}
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add {activeTab === "users" ? "User" : "Store"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Rate {selectedStore?.name}
            </h2>
            <form onSubmit={handleRatingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={1}>1 ⭐</option>
                  <option value={2}>2 ⭐</option>
                  <option value={3}>3 ⭐</option>
                  <option value={4}>4 ⭐</option>
                  <option value={5}>5 ⭐</option>
                </select>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Rating
                </button>
                <button
                  type="button"
                  onClick={() => setShowRatingModal(false)}
                  className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
