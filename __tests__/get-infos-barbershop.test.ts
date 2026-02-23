import { getInfosBarbershop } from "@/shared/actions/get-infos-barbershop";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    barbershop: {
      findFirst: jest.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";

describe("getInfosBarbershop", () => {
  afterEach(() => jest.clearAllMocks());

  it("returns barbershop when present", async () => {
    (prisma.barbershop.findFirst as jest.Mock).mockResolvedValueOnce({
      name: "My Shop",
      address: "Rua X",
      imageUrl: "https://img",
    });

    const res = await getInfosBarbershop();
    expect(res).toEqual({
      name: "My Shop",
      address: "Rua X",
      imageUrl: "https://img",
    });
    expect(prisma.barbershop.findFirst).toHaveBeenCalled();
  });

  it("returns null when not found", async () => {
    (prisma.barbershop.findFirst as jest.Mock).mockResolvedValueOnce(null);

    const res = await getInfosBarbershop();
    expect(res).toBeNull();
  });
});
