/* ----------------------------- react ----------------------------- */
import { useEffect, useState } from "react";

/* ----------------------------- libraries ----------------------------- */
import axios from "axios";

/* ----------------------------- components ----------------------------- */
import Loader from "../../common-ui/Loader";

export default function AdminUsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("/api/admin/users");
      setUsers(data.users);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="alert alert-danger text-center mt-5" role="alert">
        {error}
      </div>
    );
  }

  return (
    <Loader isLoading={loading}>
      <div className="container py-5">
        <h3 className="text-center text-success mb-4">All Users</h3>
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark text-center">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user._id}>
                    <td className="text-center">{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.isActive ? "Active" : "Inactive"}</td>
                    <td className="text-center">
                      {new Date(user.createdOn).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Loader>
  );
}
