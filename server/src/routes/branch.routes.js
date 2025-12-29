// server\src\routes\branch.routes.js
router.post("/", requireAuth, requireRole("ADMIN"), async (req, res) => {
  const branch = await prisma.branch.create({ data: req.body });
  res.json(branch);
});

router.get("/:degreeId", requireAuth, async (req, res) => {
  res.json(
    await prisma.branch.findMany({
      where: { degreeId: +req.params.degreeId },
    })
  );
});
