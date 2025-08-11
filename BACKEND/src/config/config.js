export const cookieOptions = {
httpOnly: true,
  secure: true,         // ✅ required for cross-site
  sameSite: 'None',     // ✅ allows cross-site cookie sharing
  maxAge: 7 * 24 * 60 * 60 * 1000
};