import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

function AdminDashboard() {
  const {
    users,
    certifications,
    deleteCertification,
    renewCertification,
    verifyCertificate,
    rejectCertificate,
    approveRenewal,
    rejectRenewal,
    setUsers,
  } = useContext(UserContext);

  const [showExpiredOnly, setShowExpiredOnly] = useState(false);
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const [renewingCertId, setRenewingCertId] = useState(null);
  const [newExpiryDate, setNewExpiryDate] = useState("");
  const [approvingRenewalId, setApprovingRenewalId] = useState(null);
  const [renewalExpiryDate, setRenewalExpiryDate] = useState("");
  const today = new Date();

  const pendingRequests = certifications.filter(
    cert => cert.renewalStatus === "pending"
  );

  const expiredCerts = certifications.filter(
    cert => new Date(cert.expiryDate) < today
  );

  const displayedCerts = certifications.filter(cert => {
    if (showPendingOnly) return cert.renewalStatus === "pending";
    if (showExpiredOnly) return new Date(cert.expiryDate) < today;
    return true;
  });

  const disableUser = (userId) => {
    const updated = users.map((u) =>
      u.id === userId ? { ...u, disabled: !u.disabled } : u
    );
    setUsers(updated);
  };

  const getOwnerName = (ownerId) => {
    return users.find(u => u.id === ownerId)?.name || "Unknown";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-10">

      <h1 className="text-3xl font-bold text-purple-700 mb-6">
        🔐 Admin Control Panel
      </h1>

      {/* 🔔 Renewal Notification */}
      {pendingRequests.length > 0 && (
        <div className="mb-8 p-4 bg-yellow-100 text-yellow-800 rounded-xl border border-yellow-300">
          🔔 {pendingRequests.length} Renewal Request(s) Awaiting Approval
        </div>
      )}

      {/* 📊 SYSTEM ANALYTICS */}
      <div className="grid md:grid-cols-5 gap-6 mb-12">

        <Card title="Total Users" value={users.filter(u => u.role !== "admin").length} />
        <Card title="Total Certifications" value={certifications.length} />
        <Card title="Expired" value={expiredCerts.length} />
        <Card title="Pending Renewals" value={pendingRequests.length} />
        <Card
          title="Active"
          value={certifications.length - expiredCerts.length}
        />

      </div>

      {/* 👥 USERS SECTION */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
        <h2 className="text-xl font-semibold mb-6">All Users</h2>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b text-left">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {users
              .filter(user => user.role !== "admin")
              .map((user) => (
                <tr key={user.id} className="border-b text-left">
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4 capitalize">{user.role}</td>
                  <td className="py-3 px-4">
                    {user.disabled ? (
                      <span className="text-red-500">Disabled</span>
                    ) : (
                      <span className="text-green-500">Active</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => disableUser(user.id)}
                      className="text-blue-600 hover:underline"
                    >
                      Toggle Status
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* 📜 CERTIFICATIONS SECTION */}
      <div className="bg-white rounded-2xl shadow-lg p-8">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            All Certifications
          </h2>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowExpiredOnly(false);
                setShowPendingOnly(false);
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-xl"
            >
              Show All
            </button>

            <button
              onClick={() => {
                setShowExpiredOnly(true);
                setShowPendingOnly(false);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-xl"
            >
              Expired
            </button>

            <button
              onClick={() => {
                setShowPendingOnly(true);
                setShowExpiredOnly(false);
              }}
              className="px-4 py-2 bg-yellow-600 text-white rounded-xl"
            >
              Pending
            </button>
          </div>
        </div>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b text-left">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Owner</th>
              <th className="py-3 px-4">Expiry</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Renew</th>
              <th className="py-3 px-4">Verification</th>
              <th className="py-3 px-4">Delete</th>
            </tr>
          </thead>

          <tbody>
            {displayedCerts.map((cert) => {
              const isExpired =
                new Date(cert.expiryDate) < today;

              return (
                <tr key={cert.id} className="border-b text-left">
                  <td className="py-3 px-4">{cert.name}</td>
                  <td className="py-3 px-4">{getOwnerName(cert.ownerId)}</td>
                  <td className="py-3 px-4">{cert.expiryDate}</td>

                  <td className="py-3 px-4">
                    {cert.renewalStatus === "pending" ? (
                      <span className="text-yellow-600">Pending</span>
                    ) : isExpired ? (
                      <span className="text-red-500">Expired</span>
                    ) : (
                      <span className="text-green-500">Active</span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    {renewingCertId === cert.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="date"
                          value={newExpiryDate}
                          onChange={(e) => setNewExpiryDate(e.target.value)}
                          className="border rounded px-2 py-1"
                        />

                        <button
                          onClick={() => {
                            if (!newExpiryDate) return;

                            renewCertification(cert.id, newExpiryDate);

                            setRenewingCertId(null);
                            setNewExpiryDate("");
                          }}
                          className="text-green-600 font-medium"
                        >
                          Save
                        </button>

                        <button
                          onClick={() => {
                            setRenewingCertId(null);
                            setNewExpiryDate("");
                          }}
                          className="text-red-500"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setRenewingCertId(cert.id)}
                        className="text-indigo-600 hover:underline"
                      >
                        Renew
                      </button>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    {cert.verificationStatus === "pending" && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => verifyCertificate(cert.id)}
                          className="text-green-600 hover:underline"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => rejectCertificate(cert.id)}
                          className="text-red-600 hover:underline"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {cert.verificationStatus === "verified" && (
                      <span className="text-green-600 font-semibold">
                        ✔ Verified
                      </span>
                    )}

                    {cert.verificationStatus === "rejected" && (
                      <span className="text-red-600 font-semibold">
                        ❌ Rejected
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() => deleteCertification(cert.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 🔁 RENEWAL REQUEST SECTION */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mt-12">
        <h2 className="text-xl font-semibold mb-6">
          Renewal Requests
        </h2>

        {pendingRequests.length === 0 && (
          <p className="text-gray-500">
            No renewal requests at the moment.
          </p>
        )}

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b text-left">
              <th className="py-3 px-4">Certification</th>
              <th className="py-3 px-4">Owner</th>
              <th className="py-3 px-4">Requested On</th>
              <th className="py-3 px-4">Approve</th>
              <th className="py-3 px-4">Reject</th>
            </tr>
          </thead>

          <tbody>
            {pendingRequests.map(cert => (
              <tr key={cert.id} className="border-b text-left">
                <td className="py-3 px-4">{cert.name}</td>
                <td className="py-3 px-4">{getOwnerName(cert.ownerId)}</td>
                <td className="py-3 px-4">{cert.renewalRequestDate?.slice(0,10)}</td>

                <td className="py-3 px-4">
                  {approvingRenewalId === cert.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={renewalExpiryDate}
                        onChange={(e) => setRenewalExpiryDate(e.target.value)}
                        className="border rounded px-2 py-1"
                      />

                      <button
                        onClick={() => {
                          if (!renewalExpiryDate) return;

                          approveRenewal(cert.id, renewalExpiryDate);

                          setApprovingRenewalId(null);
                          setRenewalExpiryDate("");
                        }}
                        className="text-green-600 font-medium"
                      >
                        Save
                      </button>

                      <button
                        onClick={() => {
                          setApprovingRenewalId(null);
                          setRenewalExpiryDate("");
                        }}
                        className="text-red-500"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setApprovingRenewalId(cert.id)}
                      className="text-green-600 hover:underline"
                    >
                      Approve
                    </button>
                  )}
                </td>

                <td className="py-3 px-4">
                  <button
                    onClick={() => rejectRenewal(cert.id)}
                    className="text-red-600 hover:underline"
                  >
                    Reject
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

function Card({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-3xl font-bold text-purple-600 mt-2">
        {value}
      </p>
    </div>
  );
}

export default AdminDashboard;

