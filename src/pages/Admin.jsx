import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

function Admin() {
  const {
    users,
    certifications,
    deleteCertification,
    renewCertification,
  } = useContext(UserContext);

  const [filter, setFilter] = useState("all");

  const today = new Date();

  const filteredCerts = certifications.filter((cert) => {
    if (filter === "expired") {
      return new Date(cert.expiryDate) < today;
    }
    if (filter === "active") {
      return new Date(cert.expiryDate) >= today;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-3xl font-bold mb-8">
        Admin Control Panel
      </h1>

      {/* System Overview */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3>Total Users</h3>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3>Total Certifications</h3>
          <p className="text-2xl font-bold">{certifications.length}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3>Expired Certifications</h3>
          <p className="text-2xl font-bold">
            {
              certifications.filter(
                (c) => new Date(c.expiryDate) < today
              ).length
            }
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="mb-6">
        <button
          onClick={() => setFilter("all")}
          className="mr-4 text-blue-500"
        >
          All
        </button>
        <button
          onClick={() => setFilter("active")}
          className="mr-4 text-green-500"
        >
          Active
        </button>
        <button
          onClick={() => setFilter("expired")}
          className="text-red-500"
        >
          Expired
        </button>
      </div>

      {/* Certifications Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Issuer</th>
              <th>Expiry</th>
              <th>Owner</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCerts.map((cert) => (
              <tr key={cert.id}>
                <td>{cert.name}</td>
                <td>{cert.issuer}</td>
                <td>{cert.expiryDate}</td>
                <td>{cert.ownerId}</td>
                <td>
                  <button
                    onClick={() =>
                      renewCertification(
                        cert.id,
                        prompt("New expiry date (YYYY-MM-DD)")
                      )
                    }
                    className="text-blue-500 mr-3"
                  >
                    Renew
                  </button>

                  <button
                    onClick={() =>
                      deleteCertification(cert.id)
                    }
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;