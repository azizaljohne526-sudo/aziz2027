(function () {

  const ACTIVE_KEY = 'aziz2027_activation';
  const EXPIRY_KEY = 'aziz2027_activation_expiry';
  const ACTIVATION_DAYS = 365;

  const VERIFY_URL =
    'https://zvdxvvkvdlfbsdhxfvtq.supabase.co/functions/v1/smooth-processor';

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

  function isActivated() {
    const active = localStorage.getItem(ACTIVE_KEY);
    const expiry = Number(localStorage.getItem(EXPIRY_KEY));

    if (active !== '1') {
      return false;
    }

    if (!expiry || Date.now() >= expiry) {
      localStorage.removeItem(ACTIVE_KEY);
      localStorage.removeItem(EXPIRY_KEY);
      return false;
    }

    return true;
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

          <p style="text-align:center">
            هذا الجهاز يحتاج تفعيل لمدة سنة كاملة (365 يوم).
          </p>

          <p>رقم الجهاز</p>

          <input
            id="akDevice"
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

          <button
            id="copyDevice"
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

          <input
            id="akCode"
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

          <button
            id="activateBtn"
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

            تفعيل لمدة سنة
          </button>

          <p
            id="akMessage"
            style="text-align:center;margin-top:15px">
          </p>

        </div>
      </div>
    `;

    document.getElementById('copyDevice').onclick = function () {
      navigator.clipboard.writeText(device);
    };

    document.getElementById('activateBtn').onclick = async function () {

      const code =
        document
          .getElementById('akCode')
          .value
          .trim()
          .toUpperCase();

      const message =
        document.getElementById('akMessage');

      const button =
        document.getElementById('activateBtn');

      if (!code) {
        message.textContent = 'أدخل كود التفعيل';
        return;
      }

      button.disabled = true;
      message.textContent = 'جاري التحقق...';

      try {

        const response = await fetch(VERIFY_URL, {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            device: device,
            code: code
          })
        });

        const result = await response.json();

        if (response.ok && result.ok === true) {

          const expiry =
            Date.now() +
            ACTIVATION_DAYS *
            24 *
            60 *
            60 *
            1000;

          localStorage.setItem(ACTIVE_KEY, '1');
          localStorage.setItem(
            EXPIRY_KEY,
            String(expiry)
          );

          message.textContent =
            'تم التفعيل لمدة سنة كاملة (365 يوم)';

          setTimeout(function () {
            location.reload();
          }, 700);

        } else {

          message.textContent =
            'كود التفعيل غير صحيح';

        }

      } catch (error) {

        message.textContent =
          'تعذر الاتصال بخادم التفعيل، تأكد من الإنترنت';

      } finally {

        button.disabled = false;

      }
    };
  }

  /*
    إذا كان التفعيل موجودًا وصالحًا:
    يدخل البرنامج عادي.

    إذا انتهت الـ365 يوم:
    يرجع إلى شاشة التفعيل.
  */

  if (!isActivated()) {

    if (document.readyState === 'loading') {

      document.addEventListener(
        'DOMContentLoaded',
        showActivation
      );

    } else {

      showActivation();

    }
  }
function showRemainingDays() {
  const expiry = Number(localStorage.getItem(EXPIRY_KEY));
  if (!expiry || !isActivated()) return;

  const days = Math.max(0, Math.ceil((expiry - Date.now()) / (24 * 60 * 60 * 1000)));

  const box = document.createElement('div');
  box.id = 'akRemainingDays';
  box.textContent = 'الاشتراك: باقي ' + days + ' يوم';
  box.style.cssText =
    'position:fixed;bottom:10px;left:10px;z-index:99999;' +
    'background:#0d2118;color:#58d68d;border:1px solid #28543e;' +
    'padding:8px 12px;border-radius:10px;font-family:Arial,sans-serif;font-weight:bold;';

  document.body.appendChild(box);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', showRemainingDays);
} else {
  showRemainingDays();
}
})();
