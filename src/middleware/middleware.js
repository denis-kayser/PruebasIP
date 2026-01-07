// middlewares/logAndCheckIP.js

import { pool } from "../config/conexion.js";


function normalizeIP(ip) {
  if (!ip) return null;
  if (ip.startsWith('::ffff:')) return ip.split('::ffff:')[1];
  return ip;
}

function getBrowser(ua = '') {
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Edg')) return 'Edge';
  return 'Desconocido';
}

function getOS(ua = '') {
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac OS')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  return 'Desconocido';
}

function getDevice(ua = '') {
  if (/mobile/i.test(ua)) return 'Móvil';
  if (/tablet/i.test(ua)) return 'Tablet';
  return 'Desktop';
}

export const logAndCheckIP = async (req, res, next) => {
  try {
    const ua = req.headers['user-agent'] || '';
    const ip = normalizeIP(req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress);

    // --- Chequeo de IP permitida ---
    const [allowed] = await pool.query(
      'SELECT * FROM WhiteListIPs WHERE NumberIP = ?',
      [ip]
    );

    if (allowed.length === 0) {
      return res.status(403).json({ message: 'Acceso denegado desde esta IP' });
    }

    // --- Inserta log en la DB ---
    const query = `CALL sp_InsertAccessLog(?, ?, ?, ?, ?, ?, ?, ?)`;



    const [result] = await pool.query(query, [
      allowed[0].WLIPID,
      req.originalUrl,
      req.method,
      getBrowser(ua),
      getOS(ua),
      getDevice(ua),
      ua,
      JSON.stringify(req.body || null)
    ]);


    const response = result[0][0].result;

    if (!response.ok) {
      throw new Error(response.message);
    }

    next();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error inesperado'
    console.log({ message });

    return res.status(500).json({
      ok: false,
      message,
      data: null
    });

  }
};
