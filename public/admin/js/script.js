const getURL = () => new URL(window.location.href);

// Xóa param page mỗi khi đổi filter/sort/search để tránh “kẹt” trang cao
const clearPage = (url) => { url.searchParams.delete("page"); };

//---------------------------------------------------------------------
// Button status (lọc theo trạng thái)
{
  const buttons = document.querySelectorAll("[button-status]");
  if (buttons.length) {
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const url = getURL();
        const status = btn.getAttribute("button-status");
        if (status) {
          url.searchParams.set("status", status);
        } else {
          url.searchParams.delete("status");
        }
        clearPage(url);
        window.location.href = url.href;
      });
    });
  }
}

//---------------------------------------------------------------------
// Form Search (tìm theo tên)
{
  const form = document.querySelector("#form-search");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const url = getURL();
      const keyword = (e.target.elements.keyword?.value || "").trim();

      if (keyword) {
        url.searchParams.set("keyword", keyword);
      } else {
        url.searchParams.delete("keyword");
      }
      clearPage(url);
      window.location.href = url.href;
    });
  }
}

//---------------------------------------------------------------------
// Pagination
{
  const buttons = document.querySelectorAll("[button-pagination]");
  if (buttons.length) {
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const url = getURL();
        const page = btn.getAttribute("button-pagination");
        if (page) {
          url.searchParams.set("page", page);
          window.location.href = url.href;
        }
      });
    });
  }
}

//---------------------------------------------------------------------
// Checkbox Multi
{
  const host = document.querySelector("[checkbox-multi]");
  if (host) {
    const checkAll = host.querySelector("input[name='checkall']");
    const rowChecks = host.querySelectorAll("input[name='id']");

    if (checkAll) {
      checkAll.addEventListener("click", () => {
        rowChecks.forEach((chk) => (chk.checked = checkAll.checked));
      });
    }

    if (rowChecks.length) {
      rowChecks.forEach((chk) => {
        chk.addEventListener("click", () => {
          const allChecked = Array.from(rowChecks).every((c) => c.checked);
          if (checkAll) checkAll.checked = allChecked;
        });
      });
    }
  }
}

//---------------------------------------------------------------------
// Form Change Multi (đổi trạng thái hàng loạt / đổi vị trí / xóa)
{
  const form = document.querySelector("[form-change-multi]");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const host = document.querySelector("[checkbox-multi]");
      if (!host) return alert("Không tìm thấy danh sách để áp dụng.");

      const checked = host.querySelectorAll("input[name='id']:checked");
      const typechange = form.elements.type?.value;

      if (!typechange) return alert("Chọn thao tác cần áp dụng.");

      if (typechange === "delete-all") {
        const ok = confirm("Xóa các sản phẩm đã chọn?");
        if (!ok) return;
      }

      if (!checked.length) return alert("Chọn ít nhất 1 sản phẩm.");

      const ids = [];
      checked.forEach((chk) => {
        const id = chk.value;
        if (!id) return;
        if (typechange === "change-position") {
          const tr = chk.closest("tr");
          const posInput = tr?.querySelector("input[name='position']");
          const pos = posInput?.value?.trim();
          if (pos) ids.push(`${id}-${pos}`);
        } else {
          ids.push(id);
        }
      });

      if (!ids.length) return alert("Không có dữ liệu hợp lệ để gửi.");

      // Quan trọng: query input trong phạm vi form để tránh “bắt nhầm”
      const hiddenIds = form.querySelector("input[name='ids']");
      if (!hiddenIds) return alert("Thiếu input hidden 'ids' trong form.");

      hiddenIds.value = ids.join(",");
      // submit() native sẽ bỏ qua handler hiện tại → không loop
      form.submit();
    });
  }
}

//---------------------------------------------------------------------
// Khôi phục / Xóa vĩnh viễn trong thùng rác
{
  const form = document.querySelector("#form-trash-item");
  if (form) {
    const path = form.getAttribute("data-path") || "";
    const restoreBtns = document.querySelectorAll("[button-restore]");
    const delPermBtns = document.querySelectorAll("[button-delete-permanently]");

    restoreBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        if (!id || !path) return;
        form.action = `${path}/restore/${id}?_method=PATCH`;
        form.submit();
      });
    });

    delPermBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const ok = confirm("Sản phẩm sẽ bị xóa vĩnh viễn. Tiếp tục?");
        if (!ok) return;
        const id = btn.getAttribute("data-id");
        if (!id || !path) return;
        form.action = `${path}/delete/${id}?_method=PATCH`;
        form.submit();
      });
    });
  }
}

//---------------------------------------------------------------------
// Show alert tự ẩn
{
  const alertBox = document.querySelector("[show-alert]");
  if (alertBox) {
    const ms = parseInt(alertBox.getAttribute("data-time") || "3000", 10);
    const closeBtn = alertBox.querySelector("[close-alert]");

    const hide = () => alertBox.classList.add("alert-hidden");

    setTimeout(hide, isNaN(ms) ? 3000 : ms);
    if (closeBtn) closeBtn.addEventListener("click", hide);
  }
}

//---------------------------------------------------------------------
// Upload image + preview
{
  const wrapper = document.querySelector("[upload-image]");
  if (wrapper) {
    const input = wrapper.querySelector("[upload-image-input]");
    const preview = wrapper.querySelector("[upload-image-preview]");
    const closeBtn = wrapper.querySelector("[close-button]");
    let objectURL = null;

    const clearPreview = () => {
      if (input) input.value = "";
      if (preview) {
        preview.src = "";
        preview.classList.add("hidden");
      }
      if (closeBtn) closeBtn.classList.add("hidden");
      if (objectURL) {
        URL.revokeObjectURL(objectURL);
        objectURL = null;
      }
    };

    if (input && preview && closeBtn) {
      input.addEventListener("change", (e) => {
        const file = e.target.files?.[0];
        if (file) {
          if (objectURL) URL.revokeObjectURL(objectURL);
          objectURL = URL.createObjectURL(file);
          preview.src = objectURL;
          preview.classList.remove("hidden");
          closeBtn.classList.remove("hidden");
        } else {
          clearPreview();
        }
      });

      // Quan trọng: bind 1 lần (không đặt trong handler change)
      closeBtn.addEventListener("click", clearPreview);
    }
  }
}

//----------------------------------------------------------------------
// Sort (sắp xếp)
{
  const root = document.querySelector("[sort]");
  if (root) {
    const select = root.querySelector("[sort-select]");
    const clear = root.querySelector("[sort-clear]");

    if (select) {
      select.addEventListener("change", (e) => {
        const url = getURL();
        const val = e.target.value || "";
        const [key, dir] = val.split("-");
        if (key && dir) {
          url.searchParams.set("sortKey", key);
          url.searchParams.set("sortValue", dir);
        } else {
          url.searchParams.delete("sortKey");
          url.searchParams.delete("sortValue");
        }
        clearPage(url);
        window.location.href = url.href;
      });

      // Set selected option từ URL hiện tại
      const url = getURL();
      const key = url.searchParams.get("sortKey");
      const val = url.searchParams.get("sortValue");
      if (key && val) {
        const option = select.querySelector(`option[value='${key}-${val}']`);
        if (option) option.selected = true;
      }
    }

    if (clear) {
      clear.addEventListener("click", () => {
        const url = getURL();
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");
        clearPage(url);
        window.location.href = url.href;
      });
    }
  }
}

//----------------------------------------------------------------------
// Xóa 1 nhóm quyền
{
  const form = document.querySelector("#form-delete-permission");
  if (form) {
    const path = form.getAttribute("data-path") || "";
    const btn = document.querySelector("[button-delete-permission]");
    if (btn && path) {
      btn.addEventListener("click", () => {
        const ok = confirm("Xóa nhóm quyền?");
        if (!ok) return;
        const id = btn.getAttribute("data-id");
        if (!id) return;
        form.action = `${path}/${id}?_method=DELETE`;
        form.submit();
      });
    }
  }
}

//----------------------------------------------------------------------
// Xóa 1 danh mục sản phẩm
{
  const form = document.querySelector("#form-delete-category");
  if (form) {
    const path = form.getAttribute("data-path") || "";
    const buttons = document.querySelectorAll("[button-delete-category]");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const ok = confirm("Bạn có chắc chắn muốn xóa danh mục này không?");
        if (!ok) return;
        const id = btn.getAttribute("data-id");
        if (!id || !path) return;
        form.action = `${path}/${id}?_method=DELETE`;
        form.submit();
      });
    });
  }
}