const pool = require("../config/db");
const { encode, decode } = require("../services/crypt");
const { v4: uuid4 } = require("uuid");
const otpGeneretor = require("otp-generator");

function AddMinutesToDate(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

const newOTP = async (req, res) => {
  const { phone_number } = req.body;
  //Generate OTP
  const otp = otpGeneretor.generate(4, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  const now = new Date();
  const expiration_time = AddMinutesToDate(now, 3);

  const newOtp = await pool.query(
    `INSERT INTO otp (id,otp,expiration_time) VALUES ($1,$2,$3) returning id`,
    [uuid4(), otp, expiration_time]
  );

  const details = {
    timestamp: now,
    check: phone_number,
    success: true,
    message: "OTP sent to user",
    otp_id: newOtp.rows[0].id,
  };

  console.log(details);

  const encoded = await encode(JSON.stringify(details));
  return res.send({ Status: "Success", Details: encoded });
};

const dates = {
  convert: function (d) {
    return d.constructor === Date
      ? d
      : d.constructor === Array
      ? new Date(d[0], d[1], d[2])
      : d.constructor === Number
      ? new Date(d)
      : d.constructor === String
      ? new Date(d)
      : typeof d === "object"
      ? new Date(d.year, d.month, d.date)
      : NaN;
  },
  compare: function (a, b) {
    return isFinite((a = this.convert(a).valueOf())) &&
      isFinite((b = this.convert(b).valueOf()))
      ? (a > b) - (a < b)
      : NaN;
  },
  inRange: function (d, start, end) {
    return isFinite((d = this.convert(d).valueOf())) &&
      isFinite((start = this.convert(start).valueOf())) &&
      isFinite((end = this.convert(end).valueOf()))
      ? start <= d && d <= end
      : NaN;
  },
};

const verifyOTP = async (req, res) => {
  const { verification_key, otp, check } = req.body;
  var currentdate = new Date();
  let decoded;
  try {
    decoded = await decode(verification_key);
  } catch (error) {
    const response = { Status: "Failure", Details: "Bad request" };
    return res.status(400).json(response);
  }

  var obj = JSON.parse(decoded);
  const check_obj = obj.check;
  console.log(obj);
  if (check_obj != check) {
    const response = {
      Status: "Failure",
      Details: "Otp was not sent to this particular phone number",
    };
    return res.status(400).send(response);
  }

  const otpResult = await pool.query(`SELECT * FROM otp WHERE id = $1;`, [
    obj.otp_id,
  ]);
  const result = otpResult.rows[0];
  if (result != null) {
    //Check if OTP is already used or not
    if (result.verified != true) {
      //Check if OTP is expired or not
      if (dates.compare(result.expiration_time, currentdate) == 1) {
        //Check if OTP is equal to OTP in the DB
        if (otp === result.otp) {
          await pool.query(`UPDATE otp SET verified=$2 WHERE id=$1;`, [
            result.id,
            true,
          ]);
          const clientResult = await pool.query(
            `SELECT * FROM client WHERE client_phone_number = $1;`,
            [check]
          );
          if (clientResult.rows.length == 0) {
            const response = {
              Status: "Success",
              Details: "new",
              Check: check,
            };
            return res.status(200).send(response);
          } else {
            const response = {
              Status: "Success",
              Details: "old",
              Check: check,
              ClientName: clientResult.rows[0].client_first_name,
            };
            return res.status(200).send(response);
          }
        } else {
          const response = { Status: "Failure", Details: "OTP not mutched" };
          return res.status(400).send(response);
        }
      } else {
        const response = { Status: "Failure", Details: "OTP already expired" };
        return res.status(400).send(response);
      }
    } else {
      const response = { Status: "Failure", Details: "OTP already used" };
      return res.status(400).send(response);
    }
  } else {
    const response = { Status: "Failure", Details: "Bad request" };
    return res.status(400).send(response);
  }
};

//Barcha otplarni olish
const getAllOtp = async (req, res) => {
  try {
    const otps = await pool.query(`
    SELECT * FROM otp
    `);
    if (otps.rows.length > 0) res.json(otps.rows);
    else res.json({ message: "Any otp not found" });
  } catch (error) {
    res.status(400).send({ message: "Error is detected" });
  }
};

const getOtpById = async (req, res) => {
  try {
    const id = req.params.id;
    const otp = await pool.query(`SELECT * FROM otp WHERE id = $1`, [id]);
    if (otp.rows.length > 0) res.json(otp.rows);
    else res.json({ message: "At this id opt not found" });
  } catch (error) {
    res.status(400).json({ message: "Error is detected" });
  }
};

const updateOtp = async (req, res) => {
  try {
    const id = req.params.id;
    const { otp, expiration_time, verified } = req.body;

    const edtitingOtp = await pool.query(
      `UPDATE otp SET otp = $1, expiration_time = $2, verified = $3 WHERE id = $4`,
      [otp, expiration_time, verified, id]
    );
    res.json({ message: "Otp updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error is detected" });
  }
};

const deleteOTP = async (req, res) => {
  const { verification_key, check } = req.body;
  console.log(req.body);

  let decoded;

  try {
    decoded = await decode(verification_key);
  } catch (error) {
    console.error("Error decoding verification_key:", error);
    const response = { Status: "Failure", Details: "Bad Request" };
    return res.status(400).send(response);
  }
  var obj = JSON.parse(decoded);
  const check_obj = obj.check;

  if (check_obj != check) {
    const response = {
      Status: "Failure",
      Details: "OTP was not send to this particular phone number",
    };
    return res.status(400).send(response);
  }
  let params = { id: obj.otp_id };

  const deletedOTP = await pool.query(
    `DELETE FROM otp WHERE id=$1 RETURNING id`,
    [params]
  );
  if (deletedOTP.rows.length == 0) {
    return res.status(400).send("Invalid OTP");
  }
  return res.status(200).send(params);
};

module.exports = {
  getAllOtp,
  newOTP,
  getOtpById,
  updateOtp,
  deleteOTP,
  verifyOTP,
};
