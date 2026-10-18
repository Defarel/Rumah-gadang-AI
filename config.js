export const LOGO = "https://i.ibb.co/r2gL8YJB/1791014451654.jpg";
export const GLOBAL_VIDEOS = [];
export const ADMIN_EMAILS = ["admin@rumahgadang-ai.my.id"];

export function isAdmin(e){
  if(!e) return false;
  return ADMIN_EMAILS.includes(e.toLowerCase().trim());
}
export function getId(u){
  if(!u) return null;
  u=u.trim();
  let m=u.match(/(?:v=|youtu\.be\/|shorts\/)([^?&\/]{11})/);
  if(m) return m[1];
  if(/^[A-Za-z0-9_-]{11}$/.test(u)) return u;
  return null;
}
