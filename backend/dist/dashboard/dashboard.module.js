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
exports.DashboardModule = exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const catalog_module_1 = require("../catalog/catalog.module");
const messages_module_1 = require("../messages/messages.module");
const schemas_1 = require("../catalog/schemas");
let DashboardController = class DashboardController {
    constructor(messages, services, team, partners, faqs, testimonials) {
        this.messages = messages;
        this.services = services;
        this.team = team;
        this.partners = partners;
        this.faqs = faqs;
        this.testimonials = testimonials;
    }
    async stats() {
        const [totalMessages, unreadMessages, services, team, partners, faqs, testimonials, recent] = await Promise.all([
            this.messages.countDocuments(),
            this.messages.countDocuments({ isRead: false }),
            this.services.countDocuments(),
            this.team.countDocuments(),
            this.partners.countDocuments(),
            this.faqs.countDocuments(),
            this.testimonials.countDocuments(),
            this.messages.find().sort({ createdAt: -1 }).limit(5).lean(),
        ]);
        return { totalMessages, unreadMessages, services, team, partners, faqs, testimonials, recent };
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "stats", null);
exports.DashboardController = DashboardController = __decorate([
    (0, common_1.Controller)('dashboard'),
    __param(0, (0, mongoose_1.InjectModel)(messages_module_1.Message.name)),
    __param(1, (0, mongoose_1.InjectModel)(schemas_1.Service.name)),
    __param(2, (0, mongoose_1.InjectModel)(schemas_1.TeamMember.name)),
    __param(3, (0, mongoose_1.InjectModel)(schemas_1.Partner.name)),
    __param(4, (0, mongoose_1.InjectModel)(schemas_1.Faq.name)),
    __param(5, (0, mongoose_1.InjectModel)(schemas_1.Testimonial.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], DashboardController);
let DashboardModule = class DashboardModule {
};
exports.DashboardModule = DashboardModule;
exports.DashboardModule = DashboardModule = __decorate([
    (0, common_1.Module)({ imports: [catalog_module_1.CatalogModule, messages_module_1.MessagesModule], controllers: [DashboardController] })
], DashboardModule);
//# sourceMappingURL=dashboard.module.js.map