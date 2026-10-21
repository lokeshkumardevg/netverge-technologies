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
exports.ContentModule = exports.ContentController = exports.ContentSchema = exports.Content = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let Content = class Content {
};
exports.Content = Content;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Content.prototype, "key", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], Content.prototype, "data", void 0);
exports.Content = Content = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Content);
exports.ContentSchema = mongoose_1.SchemaFactory.createForClass(Content);
let ContentController = class ContentController {
    constructor(model) {
        this.model = model;
    }
    async get(key) {
        const doc = await this.model.findOne({ key }).lean();
        return doc?.data ?? {};
    }
    async save(key, data) {
        const doc = await this.model.findOneAndUpdate({ key }, { key, data }, { upsert: true, new: true });
        return doc.data;
    }
};
exports.ContentController = ContentController;
__decorate([
    (0, common_1.Get)(':key'),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "get", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':key'),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "save", null);
exports.ContentController = ContentController = __decorate([
    (0, common_1.Controller)('content'),
    __param(0, (0, mongoose_1.InjectModel)(Content.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ContentController);
let ContentModule = class ContentModule {
};
exports.ContentModule = ContentModule;
exports.ContentModule = ContentModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: Content.name, schema: exports.ContentSchema }])],
        controllers: [ContentController],
        exports: [mongoose_1.MongooseModule],
    })
], ContentModule);
//# sourceMappingURL=content.module.js.map