"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugify = void 0;
exports.createCrudController = createCrudController;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const object_id_1 = require("../common/object-id");
const slugify = (v) => String(v || '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
exports.slugify = slugify;
function createCrudController(path, modelName, opts = {}) {
    let CrudController = class CrudController {
        constructor(model) {
            this.model = model;
        }
        list(page) {
            const q = { isActive: true };
            if (page && this.model.schema.path('pages')) {
                q.$or = [{ pages: page }, { pages: { $size: 0 } }, { pages: { $exists: false } }];
            }
            return this.model.find(q).sort({ order: 1, createdAt: 1 }).lean();
        }
        listAll() { return this.model.find().sort({ order: 1, createdAt: 1 }).lean(); }
        async reorder(body) {
            if (!Array.isArray(body?.ids))
                throw new common_1.BadRequestException('ids must be an array');
            body.ids.forEach(object_id_1.assertId);
            await Promise.all(body.ids.map((id, i) => this.model.updateOne({ _id: id }, { order: i })));
            return { ok: true };
        }
        async uniqueSlug(base, selfId) {
            const root = (0, exports.slugify)(base) || 'item';
            let slug = root, n = 2;
            while (await this.model.exists({ slug, ...(selfId ? { _id: { $ne: selfId } } : {}) }))
                slug = `${root}-${n++}`;
            return slug;
        }
        async bySlug(slug) {
            const doc = await this.model.findOne({ slug: String(slug).toLowerCase(), isActive: true }).lean();
            if (!doc)
                throw new common_1.NotFoundException();
            return doc;
        }
        async one(id) {
            (0, object_id_1.assertId)(id);
            const doc = await this.model.findById(id).lean();
            if (!doc)
                throw new common_1.NotFoundException();
            return doc;
        }
        async create(body) {
            for (const k of ['_id', '__v', 'createdAt', 'updatedAt'])
                delete body[k];
            if (opts.slugFrom)
                body.slug = await this.uniqueSlug(body.slug || body[opts.slugFrom]);
            return this.model.create(body);
        }
        async update(id, body) {
            (0, object_id_1.assertId)(id);
            for (const k of ['_id', '__v', 'createdAt', 'updatedAt'])
                delete body[k];
            if (opts.slugFrom) {
                if (body.slug)
                    body.slug = await this.uniqueSlug(body.slug, id);
                else if ('slug' in body || body[opts.slugFrom])
                    body.slug = await this.uniqueSlug(body[opts.slugFrom] || (await this.model.findById(id).lean())?.[opts.slugFrom], id);
            }
            const doc = await this.model.findByIdAndUpdate(id, body, { new: true });
            if (!doc)
                throw new common_1.NotFoundException();
            return doc;
        }
        async remove(id) {
            (0, object_id_1.assertId)(id);
            await this.model.findByIdAndDelete(id);
            return { ok: true };
        }
    };
    __decorate([
        (0, common_1.Get)(),
        __param(0, (0, common_1.Query)('page')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], CrudController.prototype, "list", null);
    __decorate([
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        (0, common_1.Get)('admin/all'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], CrudController.prototype, "listAll", null);
    __decorate([
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        (0, common_1.Patch)('admin/reorder'),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], CrudController.prototype, "reorder", null);
    __decorate([
        (0, common_1.Get)('slug/:slug'),
        __param(0, (0, common_1.Param)('slug')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], CrudController.prototype, "bySlug", null);
    __decorate([
        (0, common_1.Get)(':id'),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], CrudController.prototype, "one", null);
    __decorate([
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        (0, common_1.Post)(),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], CrudController.prototype, "create", null);
    __decorate([
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        (0, common_1.Put)(':id'),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], CrudController.prototype, "update", null);
    __decorate([
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        (0, common_1.Delete)(':id'),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], CrudController.prototype, "remove", null);
    CrudController = __decorate([
        (0, common_1.Controller)(path),
        __param(0, (0, mongoose_1.InjectModel)(modelName)),
        __metadata("design:paramtypes", [mongoose_2.Model])
    ], CrudController);
    return CrudController;
}
//# sourceMappingURL=crud.factory.js.map