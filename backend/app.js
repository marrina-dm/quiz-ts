const express = require('express');
const cors = require('cors');
const testRoutes = require('./routes/test.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();
const port = process.env.PORT || 3000

app.use(express.json());
app.use(cors());

app.use("/api", authRoutes);
app.use("/api/tests", testRoutes);

app.listen(port, () =>
    console.log(`Server started`)
)