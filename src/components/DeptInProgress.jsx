import { useEffect, useState } from "react";
import axios from "axios";
import { FaFileAlt } from "react-icons/fa";

export default function DeptInProgress() {
  const department = localStorage.getItem("loggedInDepartment");
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/api/department/department-complaints?department=${department}`
      )
      .then((res) => {
        setComplaints(
          (res.data.complaints || []).filter(
            (c) => c.status === "प्रक्रिया में"
          )
        );
      });
  }, [department]);

  return (
    <div style={page}>
      <h1 style={heading}>🟨 प्रक्रिया में शिकायतें</h1>

      {complaints.length === 0 ? (
        <p style={empty}>कोई शिकायत प्रक्रिया में नहीं है</p>
      ) : (
        complaints.map((c) => (
          <div key={c.complaintId} style={card}>
            <p><b>शिकायत ID:</b> {c.complaintId}</p>
            <p><b>विवरण:</b> {c.complaintDetails}</p>

            <p>
              <b>स्थिति:</b>{" "}
              <span style={status}>प्रक्रिया में</span>
            </p>

            <p>
              <b>Latest Remark:</b>{" "}
              <span style={{ fontWeight: 600 }}>
                {c.remarksHistory?.slice(-1)[0]?.remark || "—"}
              </span>
            </p>

            {c.documents?.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <b>संलग्न दस्तावेज़:</b>
                {c.documents.map((d, i) => (
                  <div key={i} style={docRow}>
                    <FaFileAlt color="#0d6efd" />
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noreferrer"
                      style={docLink}
                    >
                      दस्तावेज़ {i + 1}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

/* ===================== STYLES ===================== */

const page = {
  minHeight: "100vh",
  padding: "30px",
  background: "#f4f6f9",
  color: "#000",
};

const heading = {
  textAlign: "center",
  fontWeight: 900,
  fontSize: "1.8rem",
  marginBottom: 30,
};

const empty = {
  textAlign: "center",
  fontWeight: 700,
  fontSize: "1rem",
};

const card = {
  background: "#ffffff",
  border: "2px solid #ffc107",
  borderLeft: "8px solid #ffc107",
  padding: 20,
  borderRadius: 10,
  marginBottom: 18,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const status = {
  color: "#ffc107",
  fontWeight: 900,
};

const docRow = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginTop: 6,
};

const docLink = {
  color: "#0d6efd",
  fontWeight: 700,
  textDecoration: "underline",
};
