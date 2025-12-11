import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/UserRoutes.js"; // une seule fois
import hebergementRoutes from "./routes/HebergementRoutes.js";
import reservationRoutes from "./routes/ReservationRoutes.js";
import paymentRoutes from "./routes/PaymentRoutes.js";
import authRoutes from "./routes/AuthRoutes.js";

// Charger les variables d'environnement
dotenv.config();

// Initialiser Express
const app = express();

// Middlewares
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("API Camping Premium - ES Modules"));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/hebergements", hebergementRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/payments", paymentRoutes);

// Démarrer le serveur
app.listen(process.env.PORT, () => {
  console.log("🚀 API lancée sur le port " + process.env.PORT);
});
