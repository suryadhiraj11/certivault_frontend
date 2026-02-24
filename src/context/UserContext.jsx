import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [users, setUsers] = useState(
    JSON.parse(localStorage.getItem("users")) || []
  );

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );

  const [certifications, setCertifications] = useState(
    JSON.parse(localStorage.getItem("certifications")) || []
  );

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("certifications", JSON.stringify(certifications));
  }, [certifications]);

  // ================= AUTH =================

  const signup = (name, email, password, role) => {
    const existing = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (existing) return { error: "User already exists" };

    const newUser = {
      id: Date.now(),
      name,
      email: email.toLowerCase(),
      password,
      role: role || "user",
      profilePic: null,
      disabled: false,
    };

    setUsers([...users, newUser]);
    setCurrentUser(newUser);

    return { success: true };
  };

  const login = (email, password) => {
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    if (!user) return { error: "Invalid credentials" };

    if (user.disabled)
      return { error: "Account disabled by admin" };

    setCurrentUser(user);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // ================= CERTIFICATIONS =================

  const addCertification = (cert) => {
    const newCert = {
      ...cert,
      id: Date.now(),
      certificateId:
        "CERT-" + Date.now() + "-" + Math.floor(Math.random() * 1000),

      // 🔥 IMPORTANT
      verificationStatus: "pending",
      verifiedBy: null,
      verifiedAt: null,

      renewalStatus: "none",
      renewalHistory: [],
      renewalRequestDate: null,

      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
    };

    setCertifications([...certifications, newCert]);
  };

  const deleteCertification = (certId) => {
    const updated = certifications.filter(
      (cert) => cert.id !== certId
    );
    setCertifications(updated);
  };

  const renewCertification = (certId, newExpiryDate) => {
    const updated = certifications.map((cert) => {
      if (cert.id !== certId) return cert;

      return {
        ...cert,
        expiryDate: newExpiryDate,
        renewalStatus: "none",
        renewalRequestDate: null,
      };
    });

    setCertifications(updated);
  };

  // ================= VERIFICATION =================

  const verifyCertificate = (certId) => {
    const updated = certifications.map((cert) => {
      if (cert.id !== certId) return cert;

      return {
        ...cert,
        verificationStatus: "verified",
        verifiedBy: currentUser.id,
        verifiedAt: new Date().toISOString(),
      };
    });

    setCertifications(updated);
  };

  const rejectCertificate = (certId) => {
    const updated = certifications.map((cert) => {
      if (cert.id !== certId) return cert;

      return {
        ...cert,
        verificationStatus: "rejected",
      };
    });

    setCertifications(updated);
  };

  // ================= RENEWAL =================

  const requestRenewal = (certId) => {
    const updated = certifications.map((cert) =>
      cert.id === certId
        ? {
            ...cert,
            renewalStatus: "pending",
            renewalRequestDate: new Date().toISOString(),
          }
        : cert
    );

    setCertifications(updated);
  };

  const approveRenewal = (certId, newExpiryDate) => {
    const updated = certifications.map((cert) => {
      if (cert.id !== certId) return cert;

      return {
        ...cert,
        expiryDate: newExpiryDate,
        renewalStatus: "approved",
        renewalHistory: [
          ...cert.renewalHistory,
          {
            approvedOn: new Date().toISOString(),
            previousExpiry: cert.expiryDate,
            newExpiry: newExpiryDate,
          },
        ],
      };
    });

    setCertifications(updated);
  };

  const rejectRenewal = (certId) => {
    const updated = certifications.map((cert) =>
      cert.id === certId
        ? { ...cert, renewalStatus: "rejected" }
        : cert
    );

    setCertifications(updated);
  };

  // ================= PROFILE =================

  const updateProfile = (updatedData) => {
    const updatedUsers = users.map((u) =>
      u.id === currentUser.id
        ? { ...u, ...updatedData }
        : u
    );

    setUsers(updatedUsers);
    setCurrentUser({ ...currentUser, ...updatedData });
  };

  const changePassword = (newPassword) => {
    const updatedUsers = users.map((u) =>
      u.id === currentUser.id
        ? { ...u, password: newPassword }
        : u
    );

    setUsers(updatedUsers);
  };

  return (
    <UserContext.Provider
      value={{
        users,
        setUsers,
        currentUser,
        certifications,
        setCertifications,
        signup,
        login,
        logout,
        addCertification,
        deleteCertification,
        renewCertification,
        verifyCertificate,
        rejectCertificate,
        requestRenewal,
        approveRenewal,
        rejectRenewal,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}