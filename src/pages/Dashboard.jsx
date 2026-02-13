export default function Dashboard() {
  const username = localStorage.getItem("username");
  return (
    <><div>
      <h1>Hey {localStorage.getItem("username")} 👋</h1>
    </div><div style={styles.container}>
        <header style={styles.header}>
          <h2 style={styles.logo}>VisionNest</h2>
        </header>

        <main style={styles.main}>
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>Your Visions</h3>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Vision</th>
                  <th>Tracks</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Get Fit</td>
                  <td>Workout, Diet</td>
                  <td>40%</td>
                </tr>
                <tr>
                  <td>Learn Coding</td>
                  <td>React, DSA</td>
                  <td>20%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div></>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #2B1A4A, #FFE1D6)",
    color: "#2B1A4A",
  },
  header: {
    padding: "20px 40px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
  },
  logo: {
    color: "#fff",
    fontSize: "1.4rem",
  },
  main: {
    padding: "40px",
  },
  card: {
    background: "rgba(255,255,255,0.95)",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
  },
  sectionTitle: {
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};
