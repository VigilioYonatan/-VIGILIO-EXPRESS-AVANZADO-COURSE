import { Controller, Get, Params, Query, Req, Res } from "@decorators/express";
import { Request, Response } from "express";
import { WebService } from "../services/web.service";
import { Injectable } from "@decorators/di";
@Injectable()
@Controller("/")
export class WebController {
    constructor(private readonly webService: WebService) {}
    @Get("/")
    async home(@Res() res: Response) {
        const result = await this.webService.home();
        return res.render("web/home", result);
    }
    @Get("/about")
    about(@Res() res: Response) {
        return res.render("web/about", { title: "about" });
    }

    @Get("/change-language/:lang")
    changeLanguage(
        @Req() req: Request,
        @Res() res: Response,
        @Params("lang") lang: string
    ) {
        const rutaAnterior = req.get("Referer") as string;
        if (!["es", "en"].includes(lang)) {
            return res.redirect(rutaAnterior);
        }
        const closeSession = 24 * 60 * 60 * 1000 * 30; // 30 dias
        res.cookie("i18next", lang, { httpOnly: false, maxAge: closeSession });
        return res.redirect(rutaAnterior);
    }

    @Get("/products/:slug")
    async showProduct(@Params("slug") slug: string, @Res() res: Response) {
        const result = await this.webService.showProduct(slug);

        return res.render("web/products", result);
    }

    @Get("/404")
    page404(
        @Res() res: Response,
        @Query("errorMessage") errorMessage: string | null = null
    ) {
        res.status(404);
        return res.render("web/404", { errorMessage });
    }
}
