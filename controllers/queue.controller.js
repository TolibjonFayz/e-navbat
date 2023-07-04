const pool = require("../config/db");

const getAllQueues = async (req, res) => {
  try {
    const queues = await pool.query(`SELECT * FROM queue`);
    if (queues.rows.length > 0) res.json(queues.rows);
    else res.json({ message: "Any queues not found" });
  } catch (error) {
    res.status(400).json({ message: "Error is detected" });
  }
};

const addQueue = async (req, res) => {
  try {
    const { spec_service_id, client_id, queue_date_time, queue_number } =
      req.body;

    const addingQueue = pool.query(
      `INSERT INTO queue (spec_service_id, client_id, queue_date_time, queue_number) VALUES ($1, $2, $3, $4)`,
      [spec_service_id, client_id, queue_date_time, queue_number]
    );
    res.json({ message: "Queue added successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error is detected" });
  }
};

const getQueueById = async (req, res) => {
  try {
    const id = req.params.id;
    const queue = await pool.query(`SELECT * FROM queue WHERE id =  $1`, [id]);
    if (queue.rows.length > 0) res.json(queue.rows[0]);
    else res.json({ message: "Queue not found at this id" });
  } catch (error) {
    res.status(400).json({ message: "Error is detected" });
  }
};

const editQueue = async (req, res) => {
  try {
    const id = req.params.id;
    const { spec_service_id, client_id, queue_date_time, queue_number } =
      req.body;

    const editingQueue = await pool.query(
      `UPDATE queue SET spec_service_id = $1, client_id = $2, queue_date_time = $3, queue_number = $4 WHERE id = $5`,
      [spec_service_id, client_id, queue_date_time, queue_number, id]
    );

    res.json({ message: "Queue edited successfully" });
  } catch (error) {
    res.status(404).json({ message: "Error is detected" });
  }
};

const deleteQueue = async (req, res) => {
  try {
    const id = req.params.id;
    const deletingQueue = await pool.query(`DELETE FROM queue WHERE id = $1`, [
      id,
    ]);
    res.json({ message: "Queue successfully deleted" });
  } catch (error) {
    res.status(404).json({ message: "Error is detected" });
  }
};

module.exports = {
  getAllQueues,
  addQueue,
  getQueueById,
  editQueue,
  deleteQueue,
};
