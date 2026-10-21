"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const schemas_1 = require("./schemas");
const crud_factory_1 = require("./crud.factory");
let CatalogModule = class CatalogModule {
};
exports.CatalogModule = CatalogModule;
exports.CatalogModule = CatalogModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: schemas_1.Service.name, schema: schemas_1.ServiceSchema },
                { name: schemas_1.TeamMember.name, schema: schemas_1.TeamMemberSchema },
                { name: schemas_1.Partner.name, schema: schemas_1.PartnerSchema },
                { name: schemas_1.Faq.name, schema: schemas_1.FaqSchema },
                { name: schemas_1.Testimonial.name, schema: schemas_1.TestimonialSchema },
            ]),
        ],
        controllers: [
            (0, crud_factory_1.createCrudController)('services', schemas_1.Service.name, { slugFrom: 'title' }),
            (0, crud_factory_1.createCrudController)('team', schemas_1.TeamMember.name),
            (0, crud_factory_1.createCrudController)('partners', schemas_1.Partner.name),
            (0, crud_factory_1.createCrudController)('faqs', schemas_1.Faq.name),
            (0, crud_factory_1.createCrudController)('testimonials', schemas_1.Testimonial.name),
        ],
        exports: [mongoose_1.MongooseModule],
    })
], CatalogModule);
//# sourceMappingURL=catalog.module.js.map