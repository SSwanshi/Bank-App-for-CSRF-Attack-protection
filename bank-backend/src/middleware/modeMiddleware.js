import { SECURITY_MODE } from "../server.js";

export const checkMode = (req, res, next) => {
  req.securityMode = SECURITY_MODE;
  next();
};