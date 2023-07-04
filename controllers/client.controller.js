const pool = require("../config/db");

const addClient = async (req, res) => {
  try {
    const {
      client_last_name,
      client_first_name,
      client_phone_number,
      client_info,
      client_photo,
    } = req.body;

    const newClient = await pool.query(
      `INSERT INTO client (client_last_name, client_first_name, client_phone_number, client_info, client_photo) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        client_last_name,
        client_first_name,
        client_phone_number,
        client_info,
        client_photo,
      ]
    );
    res.status(200).json(newClient.rows);
  } catch (error) {
    res.status(500).json("Serverda xatolik");
  }
};

const getClient = async (req, res) => {
  try {
    const client = await pool.query(`
      SELECT * FROM client
    `);
    console.log(client.rows);
    res.json(client.rows);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteClient = async (req, res) => {
  try {
    const id = req.params.id;
    const deleting = await pool.query(
      `
      DELETE FROM client WHERE id = $1
    `,
      [id]
    );
    console.log("Successfully deleted client");
    res.json({ message: "Successfully deleted client" });
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateClient = async (req, res) => {
  try {
    const {
      client_last_name,
      client_first_name,
      client_phone_number,
      client_info,
      client_photo,
    } = req.body;
    const id = req.params.id;

    const updating = await pool.query(
      `UPDATE client SET client_last_name = $1,
      client_first_name = $2,
      client_phone_number = $3,
      client_info = $4,
      client_photo = $5
      WHERE id = $6
      RETURNING *`,
      [
        client_last_name,
        client_first_name,
        client_phone_number,
        client_info,
        client_photo,
        id,
      ]
    );

    console.log("Client updated successfully");
    res.json({ message: "Client updated successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getClientById = async (req, res) => {
  try {
    const id = req.params.id;
    const client = await pool.query(
      `
        SELECT * FROM client WHERE id = $1
      `,
      [id]
    );
    res.json(client.rows);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  addClient,
  getClient,
  deleteClient,
  updateClient,
  getClientById,
};
