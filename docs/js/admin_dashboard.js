// Admin dashboard JS

(function () {
  const API_BASE = ""; // same-origin

  const loginPanel = document.getElementById("login-panel");
  const dashboard = document.getElementById("dashboard");
  const loginBtn = document.getElementById("login-btn");
  const loginError = document.getElementById("login-error");
  const logoutBtn = document.getElementById("logout-btn");

  const bannerFileInput = document.getElementById("banner-file");
  const uploadBannerBtn = document.getElementById("upload-banner-btn");
  const bannersList = document.getElementById("banners-list");

  const participantsTbody = document.getElementById("participants-tbody");
  const exportCsvBtn = document.getElementById("export-csv-btn");

  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabs = document.querySelectorAll(".tab-content");

  let token = sessionStorage.getItem("jwt_token") || null;

  function show(el) { el.classList.remove("hidden"); }
  function hide(el) { el.classList.add("hidden"); }

  function setActiveTab(name) {
    tabs.forEach((tab) => {
      if (tab.id === `tab-${name}`) show(tab); else hide(tab);
    });
    tabButtons.forEach((btn) => {
      if (btn.dataset.tab === name) {
        btn.classList.remove("bg-gray-300","text-gray-800");
        btn.classList.add("bg-blue-600","text-white");
      } else {
        btn.classList.add("bg-gray-300","text-gray-800");
        btn.classList.remove("bg-blue-600","text-white");
      }
    });
  }

  async function api(path, options = {}) {
    const headers = options.headers || {};
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || res.statusText);
    return data;
  }

  async function handleLogin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    try {
      const { token: tkn } = await api("/api/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      token = tkn;
      sessionStorage.setItem("jwt_token", token);
      loginPanel.remove();
      show(dashboard);
      await loadBanners();
      await loadParticipants();
    } catch (err) {
      loginError.textContent = err.message;
      show(loginError);
    }
  }

  async function loadBanners() {
    bannersList.innerHTML = "Loading...";
    try {
      const { banners } = await api("/api/banners");
      bannersList.innerHTML = "";
      banners.forEach((url) => {
        const wrapper = document.createElement("div");
        wrapper.className = "relative group";
        const img = document.createElement("img");
        img.src = url;
        img.className = "w-full h-32 object-cover rounded";
        wrapper.appendChild(img);
        const delBtn = document.createElement("button");
        delBtn.textContent = "✕";
        delBtn.className = "absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 hidden group-hover:block";
        delBtn.onclick = async () => {
          if (!confirm("Delete this banner?")) return;
          const id = url.split("/").pop();
          await api(`/api/banners/${id}`, { method: "DELETE" });
          await loadBanners();
        };
        wrapper.appendChild(delBtn);
        bannersList.appendChild(wrapper);
      });
    } catch (err) {
      bannersList.textContent = err.message;
    }
  }

  async function uploadBanner() {
    const file = bannerFileInput.files[0];
    if (!file) return alert("Choose an image first.");
    uploadBannerBtn.disabled = true;
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result.split(",")[1];
        await api("/api/banners", {
          method: "POST",
          body: JSON.stringify({ filename: file.name, dataBase64: base64 }),
        });
        bannerFileInput.value = "";
        await loadBanners();
      };
      reader.readAsDataURL(file);
    } catch (err) {
      alert(err.message);
    } finally {
      uploadBannerBtn.disabled = false;
    }
  }

  async function loadParticipants() {
    participantsTbody.innerHTML = "Loading...";
    try {
      const { participants } = await api("/api/participants");
      participantsTbody.innerHTML = "";
      participants.forEach((p) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td class="border px-4 py-2">${p.name}</td><td class="border px-4 py-2">${p.email||""}</td><td class="border px-4 py-2">${p.message||""}</td><td class="border px-4 py-2">${new Date(p.timestamp).toLocaleString()}</td>`;
        participantsTbody.appendChild(tr);
      });
    } catch (err) {
      participantsTbody.innerHTML = `<tr><td colspan="4" class="p-4 text-red-500">${err.message}</td></tr>`;
    }
  }

  function exportCSV() {
    const rows = Array.from(participantsTbody.children).map((tr) =>
      Array.from(tr.children).map((td) => td.textContent.replace(/"/g, '""'))
    );
    const header = ["Name", "Email", "Message", "Timestamp"];
    const csv = [header, ...rows].map((row) => row.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `participants_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function logout() {
    sessionStorage.removeItem("jwt_token");
    location.reload();
  }

  // Event bindings
  loginBtn?.addEventListener("click", handleLogin);
  uploadBannerBtn?.addEventListener("click", uploadBanner);
  exportCsvBtn?.addEventListener("click", exportCSV);
  logoutBtn?.addEventListener("click", logout);
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => setActiveTab(btn.dataset.tab));
  });

  // Auto-login if token exists
  if (token) {
    hide(loginPanel);
    show(dashboard);
    setActiveTab("banners");
    loadBanners();
    loadParticipants();
  }
})();