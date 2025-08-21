document.addEventListener("DOMContentLoaded", () => {
  //========================
  // GỬI QUYỀN (build payload từ bảng)
  //========================
  const tablePermission = document.querySelector("[table-permission]");
  const buttonSubmit = document.querySelector("[button-submit]");
  const formChangePermission = document.querySelector("#form-change-permission");

  if (tablePermission && buttonSubmit && formChangePermission) {
    buttonSubmit.addEventListener("click", () => {
      const rows = tablePermission.querySelectorAll("[data-name]");
      if (!rows.length) {
        alert("Không tìm thấy hàng permission nào.");
        return;
      }

      // 1) Hàng 'id' phải tồn tại và có input id
      const idRow = tablePermission.querySelector('[data-name="id"]');
      if (!idRow) {
        alert('Thiếu hàng [data-name="id"] trong bảng.');
        return;
      }

      const idInputs = idRow.querySelectorAll("input");
      if (!idInputs.length) {
        alert("Hàng id không có input nào.");
        return;
      }

      // 2) Khởi tạo mảng permission theo số cột (một phần tử cho mỗi tài khoản/cột)
      const payload = Array.from(idInputs).map((inp) => ({
        id: inp.value,
        permission: [],
      }));

      // 3) Duyệt các hàng còn lại (tên quyền) và tick theo cột
      rows.forEach((row) => {
        const name = row.getAttribute("data-name");
        if (!name || name === "id") return; // bỏ qua hàng id

        const inputs = row.querySelectorAll("input");
        if (!inputs.length) {
          console.warn(`[roles] Hàng "${name}" không có input.`);
          return;
        }

        // Cảnh báo nếu số input không khớp số cột
        if (inputs.length !== payload.length) {
          console.warn(
            `[roles] Hàng "${name}" có ${inputs.length} ô, nhưng id có ${payload.length} cột.`
          );
        }

        inputs.forEach((inp, colIndex) => {
          if (colIndex < payload.length && inp.checked) {
            payload[colIndex].permission.push(name);
          }
        });
      });

      // 4) Đặt vào input hidden và submit
      const inputPermission = formChangePermission.querySelector(
        "input[name='permissions']"
      );
      if (!inputPermission) {
        alert("Thiếu input hidden name='permission' trong form.");
        return;
      }

      inputPermission.value = JSON.stringify(payload);
      formChangePermission.submit();
    });
  }

  //========================
  // ĐỔ MẶC ĐỊNH CÁC Ô ĐÃ CHECK
  //========================
  const dataRecordsEl = document.querySelector("[data-records]");
  if (dataRecordsEl && tablePermission) {
    let records = [];
    try {
      const raw = dataRecordsEl.getAttribute("data-records") || "[]";
      records = JSON.parse(raw);
    } catch (e) {
      console.error("[roles] Lỗi parse JSON data-records:", e);
      return;
    }
    if (!Array.isArray(records)) {
      console.warn("[roles] data-records không phải array:", records);
      return;
    }

    // Map hàng theo data-name để query nhanh
    const rowMap = new Map(
      Array.from(tablePermission.querySelectorAll("[data-name]")).map((el) => [
        el.getAttribute("data-name"),
        el,
      ])
    );

    // records: [{ id: '...', permission: ['roles-view', ...] }, ...]
    records.forEach((record, colIndex) => {
      const perms = Array.isArray(record?.permission) ? record.permission : [];
      perms.forEach((permName) => {
        const key = String(permName).trim();
        const rowEl =
          rowMap.get(key) ||
          tablePermission.querySelector(
            `[data-name="${window.CSS?.escape ? CSS.escape(key) : key}"]`
          );
        if (!rowEl) {
          console.warn(`[roles] Không thấy hàng data-name="${key}"`);
          return;
        }
        const inputs = rowEl.querySelectorAll("input");
        if (colIndex < inputs.length) {
          inputs[colIndex].checked = true;
        } else {
          console.warn(
            `[roles] Cột ${colIndex} vượt quá số input của hàng "${key}" (có ${inputs.length}).`
          );
        }
      });
    });
  }
});