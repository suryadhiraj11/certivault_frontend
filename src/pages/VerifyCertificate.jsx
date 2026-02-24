import { useParams } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function VerifyCertificate() {
  const { certificateId } = useParams();
  const { certifications } = useContext(UserContext);

  const cert = certifications.find(
    (c) => c.certificateId === certificateId
  );

  if (!cert) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl">Certificate Not Found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10 bg-green-50">

      <h1 className="text-3xl font-bold mb-6">
        Certificate Status
      </h1>

      <div className="bg-white p-6 rounded-xl shadow">
        <p><strong>Name:</strong> {cert.name}</p>
        <p><strong>Issuer:</strong> {cert.issuer}</p>
        <p><strong>Expiry:</strong> {cert.expiryDate}</p>
        <p><strong>Certificate ID:</strong> {cert.certificateId}</p>

        <div className="mt-4">
          {cert.verificationStatus === "verified" && (
            <span className="text-green-600 font-bold">
              ✔ Verified by Admin
            </span>
          )}

          {cert.verificationStatus === "pending" && (
            <span className="text-yellow-600 font-bold">
              ⏳ Pending Verification
            </span>
          )}

          {cert.verificationStatus === "rejected" && (
            <span className="text-red-600 font-bold">
              ❌ Rejected
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyCertificate;