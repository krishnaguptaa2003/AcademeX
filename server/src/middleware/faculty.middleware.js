// server\src\middleware\faculty.middleware.js
import prisma from "../prisma.js";

export const loadFaculty = async (req, res, next) => {
  if (req.user.role !== "FACULTY") {
    return res.status(403).json({ message: "Faculty access only" });
  }

  const faculty = await prisma.faculty.findUnique({
    where: { userId: req.user.id },
  });

  if (!faculty) {
    return res.status(403).json({ message: "Faculty profile not found" });
  }

  req.faculty = faculty;
  next();
};

export const requireFacultyLevel = (levels) => {
  return (req, res, next) => {
    if (!levels.includes(req.faculty.level)) {
      return res.status(403).json({
        message: "Insufficient faculty privilege",
      });
    }
    next();
  };
};
