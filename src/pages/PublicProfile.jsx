import { useParams } from "react-router-dom";
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

function PublicProfile() {
  const { userId } = useParams();
  const { users, certifications } =
    useContext(UserContext);

  const [selectedCert, setSelectedCert] = useState(null);

  const user = users.find(
    (u) => u.id == userId
  );

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1>User not found</h1>
      </div>
    );

  const userCerts = certifications.filter(
    (cert) =>
      cert.ownerId == userId &&
      cert.visibility === "public"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-10">
      <div className="max-w-4xl mx-auto">

        {/* PROFILE HEADER */}
        <div className="bg-white p-8 rounded-3xl shadow-lg flex items-center gap-6">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
            {user.profilePic ? (
              <img
                src={user.profilePic}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-2xl font-bold">
                {user.name[0]}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              {user.name}
            </h1>
            <p className="text-gray-500">
              {user.role}
            </p>
          </div>
        </div>

        {/* PUBLIC CERTIFICATIONS */}
        <div className="mt-10 space-y-6">
          {userCerts.length === 0 && (
            <p>No public certifications.</p>
          )}

          {userCerts.map((cert, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-md cursor-pointer hover:shadow-lg transition"
              onClick={() => setSelectedCert(cert)}
            >
              <h2 className="text-lg font-semibold">
                {cert.name}
              </h2>
              <p className="text-gray-500">
                Issued by {cert.issuer}
              </p>
              <p className="text-sm text-gray-400">
                Expiry: {cert.expiryDate}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                👍 {cert.likes?.length || 0} Likes
              </p>
            </div>
          ))}
        </div>

      </div>

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

          {cert.likes && cert.likes.length > 0 && (
            <div>
              <label className="text-sm text-gray-500 font-medium">Social Engagement</label>
              <div className="flex gap-6 mt-2 text-sm text-gray-600">
                <span>👍 {cert.likes?.length || 0} likes</span>
                <span>💬 {cert.comments?.length || 0} comments</span>
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
          className="mt-6 w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:scale-105 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default PublicProfile;