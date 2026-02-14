import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase";

export default function VisionDetail() {
  const { id } = useParams();
  const [vision, setVision] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [images, setImages] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchVision();
    fetchTasks();
  }, []);

  /* ---------------- FETCH VISION ---------------- */

  const fetchVision = async () => {
    const { data } = await supabase
      .from("visions")
      .select("*")
      .eq("id", id)
      .single();

    setVision(data);
  };

  /* ---------------- FETCH TASKS ---------------- */

  const fetchTasks = async () => {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("vision_id", id)
      .order("created_at", { ascending: true });

    setTasks(data || []);

    data?.forEach((task) => fetchImages(task.id));
  };

  /* ---------------- FETCH IMAGES ---------------- */

  const fetchImages = async (taskId) => {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user) {
    console.log("❌ No user while fetching images");
    return;
  }

  console.log("📂 Listing images in:", `${user.id}/${taskId}`);

  const { data, error } = await supabase.storage
    .from("task-images")
    .list(`${user.id}/${taskId}`);

  if (error) {
    console.log("❌ List error:", error.message);
    return;
  }

  console.log("📸 Files found:", data);

  if (!data || data.length === 0) {
    console.log("⚠ No images found");
    return;
  }

  const urls = data.map((file) => {
    const { data: publicUrlData } = supabase.storage
      .from("task-images")
      .getPublicUrl(`${user.id}/${taskId}/${file.name}`);

    return publicUrlData.publicUrl;
  });

  console.log("🌍 Public URLs:", urls);

  setImages((prev) => ({ ...prev, [taskId]: urls }));
};


  /* ---------------- ADD TASK ---------------- */

  const addTask = async () => {
    if (!newTask.trim()) return;

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    const { data } = await supabase
      .from("tasks")
      .insert({
        title: newTask,
        vision_id: id,
        user_id: user.id,
        completed: false,
      })
      .select()
      .single();

    setTasks((prev) => [...prev, data]);
    setNewTask("");
  };

  /* ---------------- DELETE TASK ---------------- */

  const deleteTask = async (taskId) => {
    await supabase.from("tasks").delete().eq("id", taskId);
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  /* ---------------- TOGGLE TASK (Optimistic) ---------------- */

  const toggleTask = async (taskId, currentStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, completed: !currentStatus }
          : task
      )
    );

    const { error } = await supabase
      .from("tasks")
      .update({ completed: !currentStatus })
      .eq("id", taskId);

    if (error) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, completed: currentStatus }
            : task
        )
      );
    }
  };

  /* ---------------- UPLOAD IMAGE ---------------- */

  const uploadImage = async (e, taskId) => {
  const file = e.target.files[0];
  if (!file) {
    console.log("❌ No file selected");
    return;
  }

  const { data: userData, error: userError } =
    await supabase.auth.getUser();

  if (userError) {
    console.log("❌ User fetch error:", userError);
    return;
  }

  const user = userData?.user;

  if (!user) {
    console.log("❌ No logged in user");
    return;
  }

  console.log("👤 Uploading as user:", user.id);
  console.log("📁 File selected:", file.name);

  const filePath = `${user.id}/${taskId}/${Date.now()}-${file.name}`;

  console.log("📂 Upload path:", filePath);

  const { data, error } = await supabase.storage
    .from("task-images")
    .upload(filePath, file);

  if (error) {
    console.log("❌ Upload error:", error.message);
    return;
  }

  console.log("✅ Upload success:", data);

  await fetchImages(taskId);
};


  /* ---------------- LIMIT TO 7 ---------------- */

  const visibleTasks = tasks.slice(0, 7);
  const completedCount = visibleTasks.filter((t) => t.completed).length;
  const progress =
    visibleTasks.length > 0
      ? Math.round((completedCount / visibleTasks.length) * 100)
      : 0;

  if (!vision) return <p style={{ padding: 40 }}>Loading...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{vision.title}</h2>
        <p style={styles.description}>{vision.description}</p>

        {/* Progress */}
        <div style={styles.progressWrapper}>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${progress}%`,
              }}
            />
          </div>
          <p style={styles.progressText}>{progress}% Completed</p>
        </div>

        {/* Add Task */}
        <div style={styles.addWrapper}>
          <input
            type="text"
            placeholder="Add new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            style={styles.input}
          />
          <button style={styles.addButton} onClick={addTask}>
            + Add
          </button>
        </div>

        {/* Tasks */}
        {visibleTasks.map((task) => (
          <div key={task.id} style={styles.taskBlock}>
            <div style={styles.taskRow}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() =>
                  toggleTask(task.id, task.completed)
                }
              />

              <input
                type="text"
                value={task.title}
                readOnly
                style={{
                  ...styles.taskInput,
                  textDecoration: task.completed
                    ? "line-through"
                    : "none",
                  opacity: task.completed ? 0.6 : 1,
                }}
              />

              <button
                style={styles.deleteButton}
                onClick={() => deleteTask(task.id)}
              >
                ✕
              </button>
            </div>

            {/* Upload + View */}
            {task.completed && (
              <div style={styles.uploadSection}>
                <label style={styles.uploadButton}>
                  Upload Image
                  <input
                    type="file"
                    hidden
                    onChange={(e) => uploadImage(e, task.id)}
                  />
                </label>

                {images[task.id]?.length > 0 && (
                  <button
                    style={styles.viewButton}
                    onClick={() => {
                      setSelectedImages(images[task.id]);
                      setShowModal(true);
                    }}
                  >
                    View Images ({images[task.id].length})
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        {tasks.length > 7 && (
          <p style={styles.note}>
            Showing first 7 tasks for focus 🎯
          </p>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          style={styles.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div
            style={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Uploaded Images</h3>

            <div style={styles.modalGrid}>
              {selectedImages.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  style={styles.modalImage}
                  onClick={() => setPreviewImage(url)}
                />
              ))}
            </div>

            <button
              style={styles.closeButton}
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* FULLSCREEN PREVIEW */}
{previewImage && (
  <div
    style={styles.previewOverlay}
    onClick={() => setPreviewImage(null)}
  >
    <img
      src={previewImage}
      style={styles.previewImage}
      onClick={(e) => e.stopPropagation()}
    />
    <button
      style={styles.previewClose}
      onClick={() => setPreviewImage(null)}
    >
      ✕
    </button>
  </div>
)}

    </div>
  );
}


/* ---------------- STYLES ---------------- */

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #FFE1D6, #E9E3FF)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  card: {
    width: "600px",
    background: "rgba(255,255,255,0.95)",
    borderRadius: "24px",
    padding: "40px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
  },
  title: {
    color: "#2B1A4A",
    marginBottom: 10,
  },
  description: {
    color: "#555",
    marginBottom: 20,
  },
  progressWrapper: {
    marginBottom: 25,
  },
  progressBar: {
    height: 10,
    background: "#eee",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "#2B1A4A",
    transition: "width 0.3s ease",
  },
  progressText: {
    marginTop: 8,
    fontSize: 14,
    color: "#2B1A4A",
  },
  addWrapper: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    border: "1px solid #ddd",
  },
  addButton: {
    padding: "12px 20px",
    borderRadius: 999,
    border: "none",
    background: "#2B1A4A",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
  taskBlock: {
    marginBottom: 15,
  },
  taskRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  taskInput: {
    flex: 1,
    border: "none",
    background: "#f5f5f5",
    padding: 10,
    borderRadius: 12,
  },
  deleteButton: {
    background: "#ff4d4f",
    border: "none",
    color: "#fff",
    borderRadius: 8,
    padding: "6px 10px",
    cursor: "pointer",
  },
  uploadSection: {
    marginTop: 10,
    marginLeft: 30,
  },
  uploadButton: {
    background: "#2B1A4A",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
  },
  imageGrid: {
    marginTop: 10,
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  image: {
    width: 80,
    height: 80,
    objectFit: "cover",
    borderRadius: 10,
  },
  note: {
    marginTop: 15,
    fontSize: 13,
    color: "#666",
  },
  viewButton: {
  marginLeft: 10,
  background: "#4b2c6f",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "6px 12px",
  cursor: "pointer",
  fontSize: 12,
},

modalOverlay: {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
},

modalContent: {
  background: "#fff",
  padding: 20,
  borderRadius: 16,
  width: "600px",
  maxHeight: "80vh",
  overflowY: "auto",
},

modalGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
  gap: 10,
  marginTop: 15,
},

modalImage: {
  width: "100%",
  borderRadius: 10,
  cursor: "pointer",
},

closeButton: {
  marginTop: 15,
  padding: "8px 16px",
  borderRadius: 8,
  border: "none",
  background: "#ff4d4f",
  color: "#fff",
  cursor: "pointer",
},

previewOverlay: {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.95)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 3000,
},

previewImage: {
  maxWidth: "90%",
  maxHeight: "90%",
  borderRadius: 16,
  boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
},

previewClose: {
  position: "absolute",
  top: 30,
  right: 40,
  background: "rgba(255,255,255,0.2)",
  border: "none",
  color: "#fff",
  fontSize: 24,
  padding: "6px 14px",
  borderRadius: 8,
  cursor: "pointer",
},

};
