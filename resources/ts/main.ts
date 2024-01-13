import "vite/modulepreload-polyfill"; //https://vitejs.dev/guide/backend-integration
import "../css/index.css";
import "@vigilio/sweet/sweet.min.css";
import "aos/dist/aos.css";
import Alpine from "alpinejs";
import AOS from "aos";
import { lazy } from "preact/compat";
import render from "./libs/preact";
Alpine.start();
AOS.init();
/* web */
render(
	"App",
	lazy(() => import("./App")),
);
render(
    "Test",
    lazy(() => import("./Test"))
);

render(
    "ProductsLimitSlider",
    lazy(() => import("@/web/views/ProductsLimitSlider"))
);
// auth
render(
    "AuthRegister",
    lazy(() => import("@/auth/views/AuthRegister"))
);
render(
    "AuthLogin",
    lazy(() => import("@/auth/views/AuthLogin"))
);
