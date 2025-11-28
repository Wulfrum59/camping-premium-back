import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/UserRoutes.js";
import hebergementRoutes from "./routes/HebergementRoutes.js";
import reservationRoutes from "./routes/ReservationRoutes.js";
import paymentRoutes from "./routes/PaymentRoutes.js";
import authRoutes from "./routes/AuthRoutes.js";

// 
app.use("/api/payments", paymentRoutes);
app.use("/api/auth", authRoutes);


// Charger les variables d'environnement
dotenv.config();
const app = express();

// Middlewares
app.use(cors()); // Activer CORS
app.use(express.json()); // Parser le JSON

// Routes
app.get("/", (req, res) => res.send("API Camping Premium - ES Modules"));
app.use("/api/users", userRoutes);
app.use("/api/hebergements", hebergementRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/payments", paymentRoutes);

// Démarrer le serveur
app.listen(process.env.PORT, () =>
  console.log("🚀 API lancée sur le port " + process.env.PORT)
);
