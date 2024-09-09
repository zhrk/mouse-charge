const { WebUSB } = require("usb");

// RazerBatteryTaskbar

const RazerVendorId = 0x1532;
const TransactionId = 0x1f;

function GetMessage() {
  // Function that creates and returns the message to be sent to the device
  let msg = Buffer.from([
    0x00,
    TransactionId,
    0x00,
    0x00,
    0x00,
    0x02,
    0x07,
    0x80,
  ]);
  let crc = 0;

  for (let i = 2; i < msg.length; i++) {
    crc = crc ^ msg[i];
  }

  // the next 80 bytes would be storing the data to be sent, but for getting the battery no data is sent
  msg = Buffer.concat([msg, Buffer.alloc(80)]);

  // the last 2 bytes would be the crc and a zero byte
  msg = Buffer.concat([msg, Buffer.from([crc, 0])]);

  return msg;
}
async function GetMouse() {
  const customWebUSB = new WebUSB({
    // This function can return a promise which allows a UI to be displayed if required
    devicesFound: (devices) =>
      devices.find((device) => device.vendorId == RazerVendorId),
  });

  // Returns device based on injected 'devicesFound' function
  const device = await customWebUSB.requestDevice({
    filters: [{}],
  });

  if (device) {
    return device;
  } else {
    throw new Error("No Razer device found on system");
  }
}
async function getCharge() {
  try {
    const mouse = await GetMouse();

    const msg = GetMessage();

    await mouse.open();

    if (mouse.configuration === null) {
      await mouse.selectConfiguration(1);
    }

    await mouse.claimInterface(
      mouse.configuration.interfaces[0].interfaceNumber
    );

    const request = await mouse.controlTransferOut(
      {
        requestType: "class",
        recipient: "interface",
        request: 0x09,
        value: 0x300,
        index: 0x00,
      },
      msg
    );

    await new Promise((res) => setTimeout(res, 500));

    const reply = await mouse.controlTransferIn(
      {
        requestType: "class",
        recipient: "interface",
        request: 0x01,
        value: 0x300,
        index: 0x00,
      },
      90
    );

    return ((reply.data.getUint8(9) / 255) * 100).toFixed(1);
  } catch (error) {
    console.error(error);
  }
}

module.exports = getCharge;
