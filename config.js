export const LOGO = "https://i.ibb.co/r2gL8YJB/1791014451654.jpg";
export const GLOBAL_VIDEOS = ["tfhffabMuFI","zMYsTCl2q3o","FmTajns0Fo0","1uGqc8tTBnY","_cIT2xoeaHQ","qJqTsfJavjk","IJSwl_AM_nQ","oaihc4uZ2lo","jlqbT4_1WTI","W7WHjzuyIS8","DrS61tEqpNo","q_uVG5Kyyxo","soMOZKqAIFM","SlTMOYHXHtc","w4ZA7Nc-QDI","pl_KCl6KVZQ","sojDQys8r04","jT4u_lX-1TE","obU8BL254rU","0uU92MGUe6E","rERxTpVtoWE","SHGHLXZeaRw","yy9ct3yb2zc","VsrqXAgsjck","kfvFmStvp_o","AUKNQEAdqM","PJRkG_Zjza4","xh-08nBPALA","_nZYNQdx1Is"];
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
