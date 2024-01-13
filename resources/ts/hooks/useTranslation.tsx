import { useTranslation } from "react-i18next";
import {
	type I18nextFunction,
	type Paths,
} from "@vigilio/express-core/i18next";
import home from "../../../public/locales/en/home.json";
import translation from "../../../public/locales/en/translation.json";
import validation from "../../../public/locales/en/validation.json";

interface Locales {
	home: Paths<typeof home>;
	translation: Paths<typeof translation>;
	validation: Paths<typeof validation>;
}

const t: I18nextFunction<Locales> = (key, options) => {
	const { t: useTranslate } = useTranslation();
	return useTranslate(key, options);
};
export const tvalibot: I18nextFunction<Locales> = (key, options) => {
	return JSON.stringify([key, options]);
};
export function tValibotForm(value: string) {
	let message: string | null = null;
	try {
		message = Array.isArray(JSON.parse(value))
			? // biome-ignore lint/suspicious/noExplicitAny: <explanation>
			  t(...(JSON.parse(value) as [any, any]))
			: value;
	} catch (error) {
		message = value;
	}
	return message;
}
export default t;
