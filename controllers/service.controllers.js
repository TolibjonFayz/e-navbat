const pool = require("../config/db");

const getAllServices = async (req, res) => {
  try {
    const services = await pool.query(`SELECT * FROM service`);
    if (services.rows.length > 0) res.json(services.rows);
    else res.json({ message: "Any service not found" });
  } catch (error) {
    res.status(404).send("Error is detected");
  }
};

const addService = async (req, res) => {
  try {
    const { service_name, service_price } = req.body;
    const addingService = await pool.query(
      `INSERT INTO service (service_name, service_price) VALUES ($1,$2)`,
      [service_name, service_price]
    );
    res.json({ message: "Service successfully added" });
  } catch (error) {
    res.status(400).json({ message: "Error is detected" });
  }
};

const getServiceById = async (req, res) => {
  try {
    const id = req.params.id;
    const service = await pool.query(`SELECT * FROM service WHERE id = $1`, [
      id,
    ]);
    res.json(service.rows[0]);
  } catch (error) {
    res.json({ message: "Error is detected" });
  }
};

const editService = async (req, res) => {
  try {
    const id = req.params.id;
    const { service_name, service_price } = req.body;

    const editingService = await pool.query(
      `UPDATE service SET service_name = $1, service_price = $2 WHERE id = $3`,
      [service_name, service_price, id]
    );
    res.json({ message: "Service successfully edited" });
  } catch (error) {
    res.json({ message: "Error is detected" });
  }
};

const deleteService = async (req, res) => {
  try {
    const id = req.params.id;
    const deleting = await pool.query(`DELETE FROM service WHERE id = $1`, [
      id,
    ]);
    if (deleting.rowCount == 1)
      res.json({ message: "Service successfully deleted" });
    else res.json({ message: "Service not found at this id" });
  } catch (error) {
    console.log(error);
    res.json({ message: "Error is detected" });
  }
};

module.exports = {
  getAllServices,
  addService,
  getServiceById,
  editService,
  deleteService,
};
