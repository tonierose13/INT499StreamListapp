import { useState } from "react";

function makeId() {
  return crypto?.randomUUID?.() ?? String(Date.now() + Math.random());
}

export default function StreamListPage() {
  const [titleInput, setTitleInput] = useState("");
  const [items, setItems] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();

    const trimmed = titleInput.trim();
    if (!trimmed) {
      console.warn("StreamList input is empty.");
      return;
    }

    const newItem = { id: makeId(), text: trimmed, completed: false };
    setItems((prev) => [newItem, ...prev]);
    console.log(`StreamList input: ${trimmed}`);
    setTitleInput(""); // clear input after submit
  }

  function handleDelete(id) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function handleToggleComplete(id) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }

  function handleStartEdit(id) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, isEditing: true, editText: item.text }
          : item
      )
    );
  }

  function handleEditChange(id, value) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, editText: value } : item))
    );
  }

  function handleCancelEdit(id) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isEditing: false, editText: "" } : item
      )
    );
  }

  function handleSaveEdit(id) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const trimmed = (item.editText ?? "").trim();
        if (!trimmed) return item; // don't save empty
        return { ...item, text: trimmed, isEditing: false, editText: "" };
      })
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>StreamList</h1>

      {/* Add Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
          placeholder="Add a movie or show..."
          aria-label="Movie or show title"
          style={styles.input}
        />

        <button type="submit" style={styles.addBtn}>
          <span className="material-icons" aria-hidden="true" style={styles.icon}>
            add
          </span>
          Add
        </button>
      </form>

      {/* List */}
      <div style={{ marginTop: 18 }}>
        {items.length === 0 ? (
          <p style={styles.empty}>Your list is empty. Add your first title above.</p>
        ) : (
          <ul style={styles.list}>
            {items.map((item) => (
              <li key={item.id} style={styles.card}>
                {/* Complete toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleComplete(item.id)}
                  aria-label={item.completed ? "Mark not complete" : "Mark complete"}
                  title={item.completed ? "Undo complete" : "Complete"}
                  style={{
                    ...styles.iconBtn,
                    borderColor: item.completed ? "#34d399" : "#ffffff",
                  }}
                >
                  <span
                    className="material-icons"
                    aria-hidden="true"
                    style={{
                      ...styles.icon,
                      color: item.completed ? "#34d399" : "#ffffff",
                    }}
                  >
                    {item.completed ? "check_circle" : "radio_button_unchecked"}
                  </span>
                </button>

                {/* Text / Edit */}
                <div style={{ flex: 1 }}>
                  {item.isEditing ? (
                    <input
                      value={item.editText ?? ""}
                      onChange={(e) => handleEditChange(item.id, e.target.value)}
                      aria-label="Edit title"
                      style={styles.editInput}
                    />
                  ) : (
                    <span
                      style={{
                        ...styles.itemText,
                        textDecoration: item.completed ? "line-through" : "none",
                        opacity: item.completed ? 0.65 : 1,
                      }}
                    >
                      {item.text}
                    </span>
                  )}
                </div>

                {/* Actions */}
                {item.isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(item.id)}
                      aria-label="Save"
                      title="Save"
                      style={{ ...styles.iconBtn, borderColor: "#34d399" }}
                    >
                      <span
                        className="material-icons"
                        aria-hidden="true"
                        style={{ ...styles.icon, color: "#34d399" }}
                      >
                        save
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCancelEdit(item.id)}
                      aria-label="Cancel"
                      title="Cancel"
                      style={{ ...styles.iconBtn, borderColor: "#fbbf24" }}
                    >
                      <span
                        className="material-icons"
                        aria-hidden="true"
                        style={{ ...styles.icon, color: "#fbbf24" }}
                      >
                        close
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleStartEdit(item.id)}
                      aria-label="Edit"
                      title="Edit"
                      style={{ ...styles.iconBtn, borderColor: "#60a5fa" }}
                    >
                      <span
                        className="material-icons"
                        aria-hidden="true"
                        style={{ ...styles.icon, color: "#60a5fa" }}
                      >
                        edit
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      aria-label="Delete"
                      title="Delete"
                      style={{ ...styles.iconBtn, borderColor: "#f87171" }}
                    >
                      <span
                        className="material-icons"
                        aria-hidden="true"
                        style={{ ...styles.icon, color: "#f87171" }}
                      >
                        delete
                      </span>
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: 960,
    margin: "0 auto",
    padding: 16,
  },
  title: {
    marginBottom: 12,
    color: "#ffffff",
  },
  form: {
    display: "flex",
    gap: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(0,0,0,0.25)",
    color: "#ffffff",
    outline: "none",
  },
  addBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.35)",
    background: "rgba(255,255,255,0.08)",
    color: "#ffffff",
    cursor: "pointer",
  },
  iconBtn: {
    background: "rgba(0,0,0,0.15)",
    border: "2px solid #ffffff",
    cursor: "pointer",
    padding: 8,
    borderRadius: 12,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 42,
    minHeight: 42,
  },
  icon: {
    fontSize: 22,
    color: "#ffffff",
  },
  list: {
    listStyle: "none",
    padding: 0,
    display: "grid",
    gap: 12,
  },
  card: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.20)",
    background: "rgba(0,0,0,0.18)",
  },
  itemText: {
    color: "#ffffff",
    fontSize: 18,
  },
  editInput: {
    width: "100%",
    padding: 10,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.35)",
    background: "rgba(0,0,0,0.25)",
    color: "#ffffff",
    outline: "none",
  },
  empty: {
    color: "rgba(255,255,255,0.75)",
  },
};
