import fs from "fs";

const getIsWSL = (): boolean => {
  if (fs.existsSync("/proc/version")) {
    const procVersion = fs.readFileSync("/proc/version", "utf8");
    return procVersion.toLowerCase().includes("microsoft");
  }
  return false;
};

export default getIsWSL;
