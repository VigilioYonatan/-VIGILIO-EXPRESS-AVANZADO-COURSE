import t from "./hooks/useTranslation";

function Test() {
	return (
		<div>
			Test
			{t("home:description", { name: "Vigilio" })}
		</div>
	);
}

export default Test;
