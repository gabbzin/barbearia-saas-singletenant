import { builder } from "./builder";

import "./types/barbershop";
import "./types/user";
import "./types/service";
import "./types/barber";
import "./types/booking";

export const schema = builder.toSchema();
