(function () {

  const SECRET = 'ABU-KHALID-AZIZ2027-PERMANENT';
  const ACTIVE_KEY = 'aziz2027_activation';

  function makeCode(device) {
    device = String(device || '').trim().toUpperCase();

    let hash = 2166136261;
    const text = device + '|' + SECRET;

    for (let i = 0; i < text.length; i++) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }

    const part = (hash >>> 0)
      .toString(16)
      .toUpperCase()
      .padStart(8, '0');

    return 'AK-' + part;
  }

  function getDeviceId() {
    let id = localStorage.getItem('aziz2027_device_id');

    if (!id) {
      const random =
        Date.now().toString(36) +
        Math.random().toString(36).slice(2);

      id = 'AKD-' + random.toUpperCase();
      localStorage.setItem('aziz2027_device_id', id);
    }

    return id;
  }

  function showActivation() {
    const device = getDeviceId();

    document.body.innerHTML = `
      <div style="
        min-height:100vh;
        background:#07140f;
        color:#fff;
        display:flex;
        justify-content:center;
        align-items:center;
        direction:rtl;
        font-family:Arial,sans-serif;
        padding:20px;
        box-sizing:border-box">

        <div style="
          width:100%;
          max-width:500px;
          background:#0d2118;
          border:1px solid #28543e;
          border-radius:18px;
          padding:25px;
          box-sizing:border-box">

          <h2 style="text-align:center;color:#58d68d">
            🐑 تفعيل حلال أبو خالد
          </h2>

          <p>رقم الجهاز</p>

          <input id="akDevice"
            value="${device}"
            readonly
            style="
              width:100%;
              box-sizing:border-box;
              padding:14px;
              border-radius:10px;
              border:1px solid #39614e;
              background:#07140f;
              color:#fff;
              text-align:center;
              direction:ltr;
              font-size:17px">

          <button id="copyDevice"
            style="
              width:100%;
              padding:14px;
              margin-top:10px;
              border:0;
              border-radius:10px;
              background:#2fa052;
              color:#fff;
              font-size:17px">
            نسخ رقم الجهاز
          </button>

          <p>كود التفعيل</p>

          <input id="akCode"
            autocomplete="off"
            style="
              width:100%;
              box-sizing:border-box;
              padding:14px;
              border-radius:10px;
              border:1px solid #39614e;
              background:#07140f;
              color:#fff;
              text-align:center;
              direction:ltr;
              font-size:17px">

          <button id="activateBtn"
            style="
              width:100%;
              padding:14px;
              margin-top:12px;
              border:0;
              border-radius:10px;
              background:#2fa052;
              color:#fff;
              font-size:17px;
              font-weight:bold">
            تفعيل البرنامج
          </button>

          <p id="akMessage"
            style="text-align:center;margin-top:15px"></p>

        </div>
      </div>
    `;

    document.getElementById('copyDevice').onclick = function () {
      navigator.clipboard.writeText(device);
    };

    document.getElementById('activateBtn').onclick = function () {
      const entered =
        document.getElementById('akCode').value.trim().toUpperCase();

      if (entered === makeCode(device)) {
        localStorage.setItem(ACTIVE_KEY, '1');

        document.getElementById('akMessage').textContent =
          'تم التفعيل';

        setTimeout(function () {
          location.reload();
        }, 700);

      } else {
        document.getElementById('akMessage').textContent =
          'كود التفعيل غير صحيح';
      }
    };
  }

  if (localStorage.getItem(ACTIVE_KEY) !== '1') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showActivation);
    } else {
      showActivation();
    }
  }

})();
