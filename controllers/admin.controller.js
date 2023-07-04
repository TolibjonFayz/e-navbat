const pool = require("../config/db");

const addAdmin = async (req, res) => {
  try {
    const {
      admin_name,
      admin_phone_number,
      admin_hashed_password,
      admin_is_active,
      admin_is_creator,
    } = req.body;

    const newAdmin = await pool.query(
      `
      INSERT INTO admin (admin_name, admin_phone_number, admin_hashed_password, admin_is_active, admin_is_creator) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        admin_name,
        admin_phone_number,
        admin_hashed_password,
        admin_is_active,
        admin_is_creator,
      ]
    );
    res.status(200).json({
      message: "New admin added successfully",
      newAdmin: newAdmin.rows,
    });
  } catch (error) {
    res.status(400).json({ message: "Error in server" });
  }
};

const getAllAdmin = async (req, res) => {
  try {
    const admins = await pool.query(
      `
      SELECT * FROM admin
      `
    );
    if (admins.rows.length > 0) res.json(admins.rows);
    else res.json({ message: "Any admin not found" });
  } catch (error) {
    res.status(400).json({ message: "Error in server" });
  }
};

const editAdmin = async (req, res) => {
  try {
    const {
      admin_name,
      admin_phone_number,
      admin_hashed_password,
      admin_is_active,
      admin_is_creator,
    } = req.body;
    const id = req.params.id;

    const editingAdmin = await pool.query(
      `UPDATE admin SET admin_name = $1,
      admin_phone_number = $2,
      admin_hashed_password = $3,
      admin_is_active = $4,
      admin_is_creator = $5
      WHERE id = $6
      RETURNING *`,
      [
        admin_name,
        admin_phone_number,
        admin_hashed_password,
        admin_is_active,
        admin_is_creator,
        id,
      ]
    );
    res.json({ message: "Admin successfully updated" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error in server" });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const deletingAdmin = await pool.query(
      `
      DELETE FROM admin WHERE id = $1
      `,
      [id]
    );
    if (deletingAdmin.rowCount)
      res.json({ message: "Admin successfully deleted" });
    else res.json({ mesage: "No found admin at this id" });
  } catch (error) {
    res.status(400).json({ message: "Error in server" });
  }
};

const getAdminById = async (req, res) => {
  try {
    const id = req.params.id;
    const admin = await pool.query(
      `
    SELECT * FROM admin WHERE id = $1
    `,
      [id]
    );
    if (admin.rows.length > 0) res.json(admin.rows);
    else res.json({ message: "Admin not found at this id" });
  } catch (error) {
    res.status(400).json({ message: "Error in server" });
  }
};

module.exports = {
  addAdmin,
  getAllAdmin,
  editAdmin,
  deleteAdmin,
  getAdminById,
};
