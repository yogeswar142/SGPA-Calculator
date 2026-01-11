import fs from "fs";
import JavaScriptObfuscator from "javascript-obfuscator";

const files = fs.readdirSync("dist/assets");

files.forEach(file => {
  if (file.endsWith(".js")) {
    const path = `dist/assets/${file}`;
    const code = fs.readFileSync(path, "utf8");

    const obfuscated = JavaScriptObfuscator.obfuscate(code, {
      compact: true,
      controlFlowFlattening: true,
      stringArray: true,
      rotateStringArray: true,
      stringArrayEncoding: ["rc4"],
      deadCodeInjection: true
    });

    fs.writeFileSync(path, obfuscated.getObfuscatedCode());
  }
});
