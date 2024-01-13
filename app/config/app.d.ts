import { I18nextFunction } from "@vigilio/express-core/i18next";
import { Locales } from "~/libs/i18next";

declare global {
    namespace Express {
        interface Request {
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            t: I18nextFunction<Locales> | any;
            errorMessage: string;
        }
    }
}
