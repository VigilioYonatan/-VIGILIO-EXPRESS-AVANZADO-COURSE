import i18next, { t as tra } from "i18next";
import i18nextHttpBackend from "i18next-http-backend";
import i18nextHttpMiddleware from "i18next-http-middleware";
import enviroments from "~/config/enviroments.config";
import {
	type I18nextFunction,
	type Paths,
} from "@vigilio/express-core/i18next";
import home from "../../public/locales/en/home.json";
import translation from "../../public/locales/en/translation.json";
import validation from "../../public/locales/en/validation.json";

i18next
	.use(i18nextHttpBackend)
	.use(i18nextHttpMiddleware.LanguageDetector)
	.init({
		debug: false,
		backend: {
			loadPath: `${enviroments.VITE_URL}/locales/{{lng}}/{{ns}}.json`,
		},
		lng: "es",
		fallbackLng: "es",
		interpolation: { escapeValue: false },
		ns: ["home", "translation", "validation"],
	});
export interface Locales {
	home: Paths<typeof home>;
	translation: Paths<typeof translation>;
	validation: Paths<typeof validation>;
}
export const t: I18nextFunction<Locales> = (key, options) => {
	return tra(key, options);
};
export const tvalibot: I18nextFunction<Locales> = (key, options) => {
	return JSON.stringify([key, options]);
};
export default i18next;
