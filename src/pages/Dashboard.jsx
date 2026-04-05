import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

const parseCertFile = (file) => {
  if (!file) return {};
  if (typeof file === "string") {
    try {
      return JSON.parse(file);
    } catch {
      return {};
    }
  }
  return file;
};

function Dashboard() {
  const navigate = useNavigate();

  const {
  currentUser,
  certifications,
  deleteCertification,
  requestRenewal
} = useContext(UserContext);

  const [selectedCert, setSelectedCert] = useState(null);

  if (!currentUser) return null;

  // ✅ FILTER ONLY LOGGED-IN USER CERTIFICATIONS
  const userCerts = certifications.filter(
    (cert) => cert.ownerId === currentUser.id
  );

  const today = new Date();

  const expired = userCerts.filter(
    (cert) => new Date(cert.expiryDate) < today
  );

  const expiringSoon = userCerts.filter((cert) => {
    const expiry = new Date(cert.expiryDate);
    const diff =
      (expiry - today) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= 30;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 hidden md:block shadow-sm">
        <h2 className="text-xl font-bold mb-10 text-pink-500">
          Dashboard
        </h2>

        <nav className="flex flex-col gap-4 text-gray-600 text-sm font-medium">
          <button className="hover:text-pink-500 transition text-left">
            Overview
          </button>

          <button
            onClick={() => navigate("/add-certification")}
            className="hover:text-orange-500 transition text-left"
          >
            Add Certification
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="hover:text-green-500 transition text-left"
          >
            Profile
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10">

        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Overview
        </h1>

        {/* Admin Banner */}
        {currentUser.role === "admin" && (
          <div className="mb-6 p-4 bg-purple-100 text-purple-700 rounded-xl">
            Admin Panel Access Enabled
          </div>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-gray-500 text-sm">Total Certifications</h3>
            <p className="text-3xl font-bold mt-2 text-pink-500">
              {userCerts.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-gray-500 text-sm">Expiring Soon</h3>
            <p className="text-3xl font-bold mt-2 text-blue-500">
              {expiringSoon.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-gray-500 text-sm">Expired</h3>
            <p className="text-3xl font-bold mt-2 text-red-500">
              {expired.length}
            </p>
          </div>

        </div>

        {/* Table */}
        <div className="mt-14 bg-white rounded-2xl shadow-md p-8">

          <h2 className="text-lg font-semibold mb-6 text-gray-800">
            Your Certifications
          </h2>

          {userCerts.length === 0 ? (
            <p className="text-gray-500">
              No certifications added yet.
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="py-3">Certification</th>
                  <th>Issuer</th>
                  <th>Expiry</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {userCerts.map((cert, index) => {
                  const expiry = new Date(cert.expiryDate);
                  const diff =
                    (expiry - today) /
                    (1000 * 60 * 60 * 24);

                  let status = "Active";
                  let color = "text-green-500";

                  if (expiry < today) {
                    status = "Expired";
                    color = "text-red-500";
                  } else if (diff <= 30) {
                    status = "Expiring Soon";
                    color = "text-blue-500";
                  }

                  return (
                    <tr
                      key={index}
                      className="hover:bg-pink-50 transition cursor-pointer"
                      onClick={() => setSelectedCert(cert)}
                    >
                      <td className="py-4">{cert.name}</td>
                      <td>{cert.issuer}</td>
                      <td>{cert.expiryDate}</td>
                      <td className={`${color} font-medium`}>
                        {status}
                      </td>
                      <td className="py-4 space-y-1" onClick={(e) => e.stopPropagation()}>

                        {/* Renewal Status Display */}
                        {cert.renewalStatus === "pending" && (
                          <div className="text-yellow-600 font-medium">
                            🕒 Renewal Request Sent
                          </div>
                        )}

                        {cert.renewalStatus === "approved" && (
                          <div className="text-green-600 font-medium">
                            ✅ Renewal Approved
                          </div>
                        )}

                        {cert.renewalStatus === "rejected" && (
                          <div className="text-red-600 font-medium">
                            ❌ Renewal Rejected
                          </div>
                        )}

                        {/* Request Button (only if no request yet) */}
                        {!cert.renewalStatus || cert.renewalStatus === "none" ? (
                          <button
                            onClick={() => {
                              requestRenewal(cert.id);
                              alert("Renewal request sent to admin");
                            }}
                            className="text-blue-600 hover:underline"
                          >
                            Request Renewal
                          </button>
                        ) : null}

                        {/* Delete Button */}
                        <button
                          onClick={() => deleteCertification(cert.id)}
                          className="text-red-500 hover:underline block"
                        >
                          Delete
                        </button>

                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

        </div>

      </main>

      {/* Certificate Detail Modal */}
      {selectedCert && (
        <CertificateDetailModal
          cert={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  );
}

function CertificateDetailModal({ cert, onClose }) {
  const file = parseCertFile(cert.file);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Certificate Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500 font-medium">Certificate Name</label>
            <p className="text-lg font-semibold text-gray-800">{cert.name}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500 font-medium">Issuing Organization</label>
            <p className="text-gray-800">{cert.issuer}</p>
          </div>

          {cert.description && (
            <div>
              <label className="text-sm text-gray-500 font-medium">Description</label>
              <p className="text-gray-800">{cert.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500 font-medium">Issue Date</label>
              <p className="text-gray-800">{cert.issueDate}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500 font-medium">Expiry Date</label>
              <p className="text-gray-800">{cert.expiryDate}</p>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500 font-medium">Certificate ID</label>
            <p className="text-gray-800 font-mono text-sm">{cert.certificateId}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500 font-medium">Visibility</label>
            <p className="text-gray-800 capitalize">{cert.visibility}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500 font-medium">Verification Status</label>
            <div className="flex items-center gap-2 mt-1">
              {cert.verificationStatus === "verified" && (
                <span className="text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-full">
                  ✔ Verified
                </span>
              )}
              {cert.verificationStatus === "pending" && (
                <span className="text-yellow-600 font-semibold bg-yellow-100 px-3 py-1 rounded-full">
                  ⏳ Pending Verification
                </span>
              )}
              {cert.verificationStatus === "rejected" && (
                <span className="text-red-600 font-semibold bg-red-100 px-3 py-1 rounded-full">
                  ❌ Rejected
                </span>
              )}
            </div>
          </div>

          {cert.verifiedBy && (
            <div>
              <label className="text-sm text-gray-500 font-medium">Verified At</label>
              <p className="text-gray-800">{new Date(cert.verifiedAt).toLocaleString()}</p>
            </div>
          )}

          <div>
            <label className="text-sm text-gray-500 font-medium">Renewal Status</label>
            <div className="mt-1">
              {cert.renewalStatus === "pending" && (
                <span className="text-yellow-600 font-medium">🕒 Renewal Request Pending</span>
              )}
              {cert.renewalStatus === "approved" && (
                <span className="text-green-600 font-medium">✅ Renewal Approved</span>
              )}
              {cert.renewalStatus === "rejected" && (
                <span className="text-red-600 font-medium">❌ Renewal Rejected</span>
              )}
              {(!cert.renewalStatus || cert.renewalStatus === "none") && (
                <span className="text-gray-600">No renewal request</span>
              )}
            </div>
          </div>

          {cert.renewalHistory && cert.renewalHistory.length > 0 && (
            <div>
              <label className="text-sm text-gray-500 font-medium">Renewal History</label>
              <div className="mt-2 space-y-2">
                {cert.renewalHistory.map((renewal, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-lg text-sm">
                    <p><strong>Approved:</strong> {new Date(renewal.approvedOn).toLocaleDateString()}</p>
                    <p><strong>Previous Expiry:</strong> {renewal.previousExpiry}</p>
                    <p><strong>New Expiry:</strong> {renewal.newExpiry}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FILE PREVIEW */}
          {cert.file && (
            <div>
              <label className="text-sm text-gray-500 font-medium block mb-2">Certificate File</label>
              {file.type?.includes("image") && (
                <img
                  src={file.data}
                  alt="certificate"
                  className="rounded-2xl max-h-96 w-full object-contain border"
                />
              )}
              {file.type?.includes("pdf") && (
                <iframe
                  src={file.data}
                  className="w-full h-[500px] rounded-xl border"
                  title="PDF Preview"
                />
              )}
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-semibold hover:scale-105 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default Dashboard;