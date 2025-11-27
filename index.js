import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import hebergementRoutes from "./routes/hebergementRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import paymentRoutes from "./routes/PaymentRoutes.js";
import authRoutes from "./routes/AuthRoutes.js";

// 
app.use("/api/payments", paymentRoutes);
app.use("/api/auth", authRoutes);


// Charger les variables d'environnement
dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

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
