import { useEffect, useState } from "react";
import axios from "axios";

export default function DeptResolved() {
  const department = localStorage.getItem("loggedInDepartment");
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/api/department/department-complaints?department=${department}`
      )
      .then((res) => {
        const resolved = (res.data.complaints || []).filter(
          (c) => c.status === "निस्तारित"
        );
        setComplaints(resolved);
      });
  }, [department]);

  return (
    <div style={page}>
      <h1 style={heading}>🟩 निस्तारित शिकायतें</h1>

      {complaints.length === 0 ? (
        <p style={empty}>कोई निस्तारित शिकायत उपलब्ध नहीं है</p>
      ) : (
        complaints.map((c) => (
          <div key={c.complaintId} style={card}>
            <p><b>शिकायत ID:</b> {c.complaintId}</p>
            <p><b>विवरण:</b> {c.complaintDetails}</p>

            <p>
              <b>स्थिति:</b>{" "}
              <span style={status}>निस्तारित</span>
            </p>

            <div style={remarkBox}>
              <b>अंतिम टिप्पणी:</b>
              <div style={{ marginTop: 4 }}>
                {c.remarksHistory?.slice(-1)[0]?.remark || "—"}
              </div>
            </div>
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
  border: "2px solid #198754",
  borderLeft: "8px solid #198754",
  padding: 20,
  borderRadius: 10,
  marginBottom: 18,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const status = {
  color: "#198754",
  fontWeight: 900,
};

const remarkBox = {
  marginTop: 10,
  background: "#e9f7ef",
  border: "1px solid #198754",
  padding: 10,
  borderRadius: 6,
  fontWeight: 600,
};
