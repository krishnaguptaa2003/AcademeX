// src\utils\response.js
export function success(res, data, message = "OK") {
  return res.json({ success: true, message, data });
}

export function error(res, message, status = 400) {
  return res.status(status).json({ success: false, message });
}
