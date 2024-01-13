import { Controller, Params, Patch, Post, Req } from "@decorators/express";
import { Request } from "express";
import { File } from "formidable";
import { Upload } from "@vigilio/express-core";
import { Pipe } from "@vigilio/express-core/valibot";
import { Injectable } from "@decorators/di";
import { UploadsApiService } from "../services/uploads.api.service";
import { uploadsStorePipe } from "../pipes/uploads.store.pipe";
import { UploadsEntities, UploadsProperties } from "../libs";

@Injectable()
@Controller("/uploads")
export class UploadsApiController {
	constructor(private readonly uploadsApiService: UploadsApiService) {}
	@Pipe(uploadsStorePipe)
	@Upload()
	@Post("/:entity/:property")
	store(
		@Params("entity")
		entity: UploadsEntities,
		@Params("property") property: UploadsProperties,
		@Req() req: Request & { files: File[]; filesName?: string },
	) {
		const { files, filesName } = req;
		const result = this.uploadsApiService.store({
			files,
			name: filesName,
			property,
			entity,
		});
		return result;
	}

	@Upload()
	@Patch("/:entity/:property/:id")
	update(
		@Params("entity") entity: UploadsEntities,
		@Params("id") id: string,
		@Params("property") property: UploadsProperties,
		@Req() req: Request & { files: File[]; filesName?: string },
	) {
		const { files, filesName } = req;
		const result = this.uploadsApiService.update({
			files,
			name: filesName,
			id,
			property,
			entity,
		});
		return result;
	}
}
