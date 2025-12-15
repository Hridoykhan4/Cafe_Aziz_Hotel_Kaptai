require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
let userCollection;
const asyncHandler = require("./asyncHandler");
const errorHandler = require("./errorHandler");
const nodemailer = require("nodemailer");

const emailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.CAFE_AZIZ_EMAIL,
    pass: process.env.CAFE_AZIZ_EMAIL_PASS,
  },
});

// MiddleWare
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://bistro-boss-restaurant-kaptai.web.app",
    ],
  })
);
app.use(cors());
app.use(express.json());

/* -----Custom Middlewares Start */
const verifyToken = (req, res, next) => {
  const authorizeHeader = req.headers?.authorization;

  if (!authorizeHeader || !authorizeHeader.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Unauthorized Access" });
  }

  const token = authorizeHeader.split("Bearer ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(401).send({ message: "Unauthorized Access" });
    req.decoded = decoded;
    next();
  });
};

const verifyValidEmail = (req, res, next) => {
  const email = req?.query?.email || req?.params?.email;
  if (email !== req.decoded?.email)
    return res.status(403).send({ message: "Forbidden Access" });
  next();
};

const verifyAdmin = async (req, res, next) => {
  const { email } = req?.decoded;
  const user = await userCollection.findOne({ email });
  if (user?.role !== "admin")
    return res.status(403).send({ message: "Forbidden Access" });
  next();
};
/* -----Custom Middlewares End */

/* MongoDB Start */

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@bistro-begin.f9obfsm.mongodb.net/?retryWrites=true&w=majority&appName=bistro-begin`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const menuCollection = client.db("bistroDB").collection("menu");
    userCollection = client.db("bistroDB").collection("users");
    const reviewCollection = client.db("bistroDB").collection("reviews");
    const cartCollection = client.db("bistroDB").collection("carts");
    const paymentCollection = client.db("bistroDB").collection("payments");

    /* ______________------JWT------____________ */

    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "300d",
      });
      res.send({ token });
    });

    /* ______________------JWT------____________ */
    /**
     *-------------------------  User Related APIs start----------------
     */

    app.get("/users/admin", verifyToken, verifyValidEmail, async (req, res) => {
      const { email } = req.query;
      const user = await userCollection.findOne({ email });
      res.send({ admin: user?.role === "admin" });
    });

    app.get(
      "/users",
      verifyToken,
      verifyAdmin,
      asyncHandler(async (req, res) => {
        res.send(await userCollection.find().toArray());
      })
    );

    app.post(
      "/users",
      asyncHandler(async (req, res) => {
        const user = req.body;
        // Insert user if doesn't exist
        // Ways(1. email unique , 2. upsert 3. query)
        const query = { email: user.email };
        const isExist = await userCollection.findOne(query);
        if (isExist) {
          return res.send({ message: "User already exist", insertedId: null });
        }
        const result = await userCollection.insertOne(user);
        res.send(result);
      })
    );

    app.patch(
      "/users/admin/:id",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        res.send(
          await userCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { role: "admin" } }
          )
        );
      }
    );

    app.delete(
      "/users/:id",
      verifyToken,
      asyncHandler(async (req, res) => {
        res.send(
          await userCollection.deleteOne({ _id: new ObjectId(req.params.id) })
        );
      })
    );

    /**
     * -------------------------  User Related APIs end --------------
     */

    /* _______MENU START */

    app.get(
      "/menu",
      asyncHandler(async (req, res) => {
        // Pagination Params
        const page = parseInt(req.query?.page) || 1;
        const limit = parseInt(req.query?.limit) || 10;
        const skip = (page - 1) * limit;

        if (req?.query?.forManageItems === "true") {
          const total = await menuCollection.countDocuments();
          const items = await menuCollection
            .find()
            .skip(skip)
            .limit(limit)
            .toArray();
          return res.send({
            total,
            page,
            limit,
            items,
            totalPages: Math.ceil(total / limit) || 1,
          });
        }
        const allItems = await menuCollection.find().toArray();
        res.send({ items: allItems });
      })
    );

    app.get("/menu/:id", async (req, res) => {
      res.send(
        await menuCollection.findOne({ _id: new ObjectId(req.params.id) })
      );
    });

    app.post(
      "/menu",
      verifyToken,
      verifyValidEmail,
      verifyAdmin,
      asyncHandler(async (req, res) => {
        res.send(await menuCollection.insertOne(req.body));
      })
    );

    app.patch(
      "/menu/:id",
      verifyToken,
      verifyValidEmail,
      verifyAdmin,
      asyncHandler(async (req, res) => {
        const { _id, ...rest } = req.body;
        res.send(
          await menuCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: rest }
          )
        );
      })
    );

    app.delete("/menu/:id", verifyToken, verifyAdmin, async (req, res) => {
      await cartCollection.deleteMany({ menuId: req.params.id });
      res.send(
        await menuCollection.deleteOne({ _id: new ObjectId(req.params.id) })
      );
    });

    // app.post('')

    /* _______MENU END_________ */

    app.get(
      "/reviews",
      asyncHandler(async (req, res) => {
        res.send(await reviewCollection.find().toArray());
      })
    );

    /**
     * Cart Collection Start
     */
    app.post("/carts", verifyToken, async (req, res) => {
      const cartItem = req.body;
      const { menuId, email } = req?.body;

      const isExists = await cartCollection.findOne({ menuId, email });
      if (isExists)
        return res
          .status(400)
          .send({ message: "Item already in your cart", exists: true });

      const result = await cartCollection.insertOne(cartItem);
      res.send(result);
    });

    app.get(
      "/carts",
      verifyToken,
      asyncHandler(async (req, res) => {
        const email = req.query?.email;
        const query = { email };
        const result = await cartCollection.find(query).toArray();
        res.send(result);
      })
    );

    /* Delete an item */
    app.delete("/carts/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });
    /**
     * Cart Collection End
     */

    /* ____---Payment Start---______ */

    app.post("/orderedItems", verifyToken, async (req, res) => {
      if (!Array.isArray(req.body.ids) || req.body.ids.length === 0) {
        return res.status(400).send({ message: "Invalid request" });
      }

      const ids = req.body.ids.map((id) => new ObjectId(id));
      const result = await menuCollection.find({ _id: { $in: ids } }).toArray();
      res.send(result);
    });

    app.patch(
      "/order-status/:id",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        const { status } = req.body;
        res.send(
          await paymentCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { status } }
          )
        );
      }
    );

    app.get("/payments", verifyToken, async (req, res) => {
      const { email } = req?.query;
      let query = {};
      if (email) {
        query.email = email;
      }

      const result = await paymentCollection.find(query).toArray();
      // result.forEach(async (history) => {
      for (const history of result) {
        const menuIds = history?.menuItemIds?.map((id) => new ObjectId(id));
        const orderedCollections = await menuCollection
          .find({ _id: { $in: menuIds } })
          .toArray();
        history.orderedCollections = orderedCollections;
      }
      res.send(result);
    });

    app.post("/payment", verifyToken, async (req, res) => {
      try {
        const { email, transactionId, price, cartItemIds } = req.body;
        const payment = { ...req.body, createdAt: new Date() };

        const paymentInsertResult = await paymentCollection.insertOne(payment);

        const filter = {
          _id: { $in: cartItemIds.map((id) => new ObjectId(id)) },
        };
        const deleteResult = await cartCollection.deleteMany(filter);

        /* 
       const emailObj = {
         from: `"Cafe Aziz" <${process.env.CAFE_AZIZ_EMAIL}>`,
         to: email,
         subject: "Cafe Aziz - Order Confirmation",
         html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Thank you for your payment!</h2>
          <p>We have successfully received your payment for your recent order.</p>
          <hr />
          <p><strong>Transaction ID:</strong> ${transactionId}</p>
          <p><strong>Total Paid:</strong> $${price}</p>
          <hr />
          <p>If you face any issues, please reply to this email.</p>
          <p>Warm regards,<br/>Cafe Aziz Team</p>
        </div>
      `,
       }; */

        // 4️⃣ Send confirmation email
        /*  try {
         const emailInfo = await emailTransporter.sendMail(emailObj);
         console.log("Email sent successfully:", emailInfo.messageId);
       } catch (emailError) {
         console.error("Error sending email:", emailError);
       } */

        // 5️⃣ Respond to frontend
        res.send({
          success: true,
          message: "Payment processed successfully",
          paymentInsertResult,
          deleteResult,
        });
      } catch (err) {
        console.error("Payment processing error:", err);
        res.status(500).send({
          success: false,
          message: "Failed to process payment",
          error: err.message,
        });
      }
    });

    app.post("/create-payment-intent", verifyToken, async (req, res) => {
      const { price } = req?.body;
      const amountInCents = Math.round(price * 100);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: "usd",
        payment_method_types: ["card"],
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });

    app.get("/admin-stats", verifyToken, verifyAdmin, async (req, res) => {
      const [users, menuItems, orders, revenueAgg] = await Promise.all([
        userCollection.estimatedDocumentCount(),
        menuCollection.estimatedDocumentCount(),
        paymentCollection.estimatedDocumentCount(),
        paymentCollection
          .aggregate([
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: "$price" },
              },
            },
          ])
          .toArray(),
      ]);
      const revenue = revenueAgg[0]?.totalRevenue || 0;
      res.send({ users, menuItems, orders, revenue });
    });

    // used aggregate pipeline
    app.get("/order-stats", verifyToken, verifyAdmin, async (req, res) => {
      const result = await paymentCollection
        .aggregate([
          { $unwind: "$menuItemIds" },
          {
            $addFields: {
              menuItemIds: { $toObjectId: "$menuItemIds" },
            },
          },
          {
            $lookup: {
              from: "menu",
              localField: "menuItemIds",
              foreignField: "_id",
              as: "menuItem",
            },
          },
          { $unwind: "$menuItem" },

          // Now group by category
          {
            $group: {
              _id: "$menuItem.category",
              quantity: { $sum: 1 },
              revenue: { $sum: "$menuItem.price" },
            },
          },
          {
            $project: {
              _id: 0,
              category: "$_id",
              quantity: 1,
              revenue: 1,
            },
          },
        ])
        .toArray();

      res.send(result);
    });

    /* ____---Payment End---______ */

    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
  }
}
run().catch(console.dir);

/* MongoDB End */

app.get("/", (req, res) => {
  res.send("Bistro is being hyped");
});
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Bistro in firing`);
});
