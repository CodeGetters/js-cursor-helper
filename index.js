import crypto from "crypto";

function generateRandomHex(length) {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(length, (err, buffer) => {
      if (err) {
        return reject(`Failed to generate random bytes: ${err}`);
      }
      resolve(buffer.toString("hex"));
    });
  });
}
/**
 * 生成 devDeviceId
 * @returns {Promise<string>}
 */
async function generateDevDeviceID() {
  const randomPart = await generateRandomHex(16); // 生成32字符的十六进制
  return `${randomPart.slice(0, 8)}-${randomPart.slice(
    8,
    12
  )}-${randomPart.slice(12, 16)}-${randomPart.slice(16, 20)}-${randomPart.slice(
    20
  )}`; // 格式化为UUID
}

/**
 * 生成 machineId
 * @returns {Promise<string>}
 */
async function generateMachineID() {
  try {
    const randomPart = await generateRandomHex(32); // 生成64字符的十六进制
    return randomPart;
  } catch (error) {
    console.error(error);
  }
}

/**
 * 生成 macMachineId
 * @returns {Promise<string>}
 */
async function generateMacMachineID() {
  const randomPart = await generateRandomHex(32); // 生成64字符的十六进制
  return randomPart;
}

/**
 * 生成SQM ID
 * @returns {Promise<string>}
 */
async function generateSQMID() {
  const deviceID = await generateDevDeviceID();
  return `{${deviceID}}`; // 用大括号括起来
}

/**
 * 验证ID格式
 * @param {string} id - 要验证的ID
 * @param {string} idType - ID类型（machineID, macMachineID, deviceID, sqmID）
 * @returns {boolean}
 */
function validateID(id, idType) {
  switch (idType) {
    case "machineID":
    case "macMachineID":
      return id.length === 64 && /^[0-9a-fA-F]+$/.test(id); // 检查长度和十六进制格式
    case "deviceID":
      return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        id
      ); // 检查UUID格式
    case "sqmID":
      return (
        id.startsWith("{") &&
        id.endsWith("}") &&
        validateID(id.slice(1, -1), "deviceID")
      ); // 检查SQM ID格式
    default:
      return false;
  }
}

async function main() {
  try {
    // 并行执行所有生成操作
    const [macMachineId, machineId, devDeviceId, sqmID] = await Promise.all([
      generateMacMachineID(),
      generateMachineID(),
      generateDevDeviceID(),
      generateSQMID(),
    ]);

    // 验证并输出结果
    if (validateID(macMachineId, "macMachineID")) {
      console.log("macMachineId:", macMachineId);
    }

    if (validateID(machineId, "machineID")) {
      console.log("machineId:", machineId);
    }

    if (validateID(devDeviceId, "deviceID")) {
      console.log("devDeviceId:", devDeviceId);
    }

    if (validateID(sqmID, "sqmID")) {
      console.log("sqmID:", sqmID);
    }
  } catch (error) {
    console.error("Error generating IDs:", error);
  }
}

main();
