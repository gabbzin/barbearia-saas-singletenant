jest.mock("@/lib/prisma", () => ({
  prisma: {
    barber: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

import {
  getBarberById,
  getBarbers,
} from "@/features/barber/services/barbers.repository";
import { prisma } from "@/lib/prisma";

describe("barbers.repository", () => {
  afterEach(() => jest.clearAllMocks());

  it("getBarbers calls prisma.findMany and returns result", async () => {
    const mock = [{ id: "1", user: { name: "A" } }];
    (prisma.barber.findMany as jest.Mock).mockResolvedValueOnce(mock);
    const res = await getBarbers();
    expect(prisma.barber.findMany).toHaveBeenCalled();
    expect(res).toEqual(mock);
  });

  it("getBarberById calls prisma.findUnique with id", async () => {
    const mock = { id: "1", user: { name: "A" } };
    (prisma.barber.findUnique as jest.Mock).mockResolvedValueOnce(mock);
    const res = await getBarberById("1");
    expect(prisma.barber.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "1" } }),
    );
    expect(res).toEqual(mock);
  });
});
