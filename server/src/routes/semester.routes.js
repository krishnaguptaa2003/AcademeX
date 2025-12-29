router.post("/", requireAuth, requireRole("ADMIN"), async (req, res) => {
  const semester = await prisma.semester.create({ data: req.body });
  res.json(semester);
});

router.get("/:courseId", requireAuth, async (req, res) => {
  res.json(
    await prisma.semester.findMany({
      where: { courseId: +req.params.courseId },
    })
  );
});
