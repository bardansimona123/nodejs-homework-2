const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const authMiddleware = async (req, res, next) => {
   try {
       const { authorization = "" } = req.headers;
       const [bearer, token] = authorization.split(" ");

       if (bearer !== "Bearer" || !token) {
           return res.status(401).json({ message: "Not authorized" });
       }

       const { id } = jwt.verify(token, process.env.JWT_SECRET);
       const user = await User.findById(id);

       if (!user) {
           return res.status(401).json({ message: "Not authorized" });
       }

       req.user = user;
       next();
   } catch {
       res.status(401).json({ message: "Not authorized" });
   }
};

module.exports = authMiddleware;
