"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertId = assertId;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
function assertId(id) {
    if (!(0, mongoose_1.isValidObjectId)(id))
        throw new common_1.BadRequestException('Invalid id');
}
//# sourceMappingURL=object-id.js.map