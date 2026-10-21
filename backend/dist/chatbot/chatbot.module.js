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
exports.ChatbotModule = exports.ChatbotController = exports.ChatbotService = exports.ChatRateLimiter = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const knowledge_1 = require("./knowledge");
const engine_1 = require("./engine");
class AskDto {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500, { message: 'Please keep your question under 500 characters.' }),
    __metadata("design:type", String)
], AskDto.prototype, "question", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], AskDto.prototype, "entryId", void 0);
let ChatRateLimiter = class ChatRateLimiter {
    constructor() {
        this.hits = new Map();
        this.limit = 40;
        this.windowMs = 60_000;
    }
    check(key) {
        const now = Date.now();
        if (this.hits.size > 5000)
            this.hits.forEach((v, k) => v.reset < now && this.hits.delete(k));
        const cur = this.hits.get(key);
        if (!cur || cur.reset < now) {
            this.hits.set(key, { count: 1, reset: now + this.windowMs });
            return { allowed: true, retryAfter: 0 };
        }
        cur.count++;
        return { allowed: cur.count <= this.limit, retryAfter: Math.ceil((cur.reset - now) / 1000) };
    }
};
exports.ChatRateLimiter = ChatRateLimiter;
exports.ChatRateLimiter = ChatRateLimiter = __decorate([
    (0, common_1.Injectable)()
], ChatRateLimiter);
let ChatbotService = class ChatbotService {
    constructor() {
        this.log = new common_1.Logger('Chatbot');
    }
    toSuggestion(e) {
        return { id: e.id, label: e.chip, icon: e.icon };
    }
    starters() {
        return knowledge_1.STARTER_IDS.map(engine_1.getEntry).filter(Boolean).map((e) => this.toSuggestion(e));
    }
    unique(list, excludeId, max = 4) {
        const seen = new Set(excludeId ? [excludeId] : []);
        const out = [];
        for (const e of list) {
            if (!e || seen.has(e.id))
                continue;
            seen.add(e.id);
            out.push(this.toSuggestion(e));
            if (out.length >= max)
                break;
        }
        return out;
    }
    init() {
        return {
            ok: true,
            bot: { name: 'NetVerge Assistant', source: knowledge_1.DOCUMENT_NAME, company: knowledge_1.COMPANY },
            greeting: knowledge_1.GREETING,
            suggestions: this.starters(),
            contact: knowledge_1.CONTACT,
        };
    }
    ask(dto) {
        const question = (dto.question || '').replace(/\s+/g, ' ').trim();
        const base = { ok: true, timestamp: new Date().toISOString() };
        if (dto.entryId) {
            const e = (0, engine_1.getEntry)(dto.entryId);
            if (e)
                return this.answerFrom(base, e, 1, []);
        }
        if (!question) {
            throw new common_1.HttpException({ ok: false, code: 'EMPTY', message: 'Please type a question.' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const r = (0, engine_1.search)(question);
        switch (r.intent) {
            case 'greeting':
                return { ...base, matched: false, kind: 'greeting', answer: knowledge_1.GREETING, source: null, suggestions: this.starters() };
            case 'thanks':
                return { ...base, matched: false, kind: 'thanks', answer: "You're welcome! 😊 Feel free to ask anything else about NetVerge.", source: null, suggestions: this.starters().slice(0, 4) };
            case 'bye':
                return { ...base, matched: false, kind: 'bye', answer: 'Thank you for visiting NetVerge Technologies. Have a great day! 👋', source: null, suggestions: [] };
            case 'answer':
                if (r.entry)
                    return this.answerFrom(base, r.entry, r.confidence, r.alternates);
            default:
                this.log.debug(`No match for: "${question.slice(0, 120)}"`);
                return { ...base, matched: false, kind: 'fallback', answer: knowledge_1.FALLBACK, source: null, suggestions: this.starters().slice(0, 5) };
        }
    }
    answerFrom(base, e, confidence, alternates) {
        const related = [...alternates, ...e.related.map(engine_1.getEntry)];
        return {
            ...base,
            matched: true,
            kind: 'answer',
            entryId: e.id,
            title: e.title,
            confidence: Number(confidence.toFixed(2)),
            answer: e.answer,
            source: { document: knowledge_1.DOCUMENT_NAME, page: e.page },
            suggestions: this.unique(related, e.id, 4),
        };
    }
    stats() {
        return { entries: knowledge_1.KNOWLEDGE.length };
    }
};
exports.ChatbotService = ChatbotService;
exports.ChatbotService = ChatbotService = __decorate([
    (0, common_1.Injectable)()
], ChatbotService);
let ChatbotController = class ChatbotController {
    constructor(svc, limiter) {
        this.svc = svc;
        this.limiter = limiter;
        this.log = new common_1.Logger('ChatbotController');
    }
    ip(req) {
        const xf = req.headers['x-forwarded-for'];
        const first = (Array.isArray(xf) ? xf[0] : xf || '').split(',')[0].trim();
        return first || req.ip || req.socket?.remoteAddress || 'unknown';
    }
    init() {
        try {
            return this.svc.init();
        }
        catch (e) {
            this.log.error('init failed', e?.stack);
            throw new common_1.HttpException({ ok: false, code: 'INIT_FAILED', message: 'Chat is temporarily unavailable. Please try again.' }, common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
    ask(dto, req) {
        const rl = this.limiter.check(this.ip(req));
        if (!rl.allowed) {
            throw new common_1.HttpException({ ok: false, code: 'RATE_LIMITED', message: `You're sending messages too quickly. Please wait ${rl.retryAfter}s and try again.`, retryAfter: rl.retryAfter }, common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        try {
            return this.svc.ask(dto || {});
        }
        catch (e) {
            if (e instanceof common_1.HttpException)
                throw e;
            this.log.error('ask failed', e?.stack);
            throw new common_1.HttpException({ ok: false, code: 'INTERNAL', message: 'Sorry, something went wrong while finding your answer. Please try again.' }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ChatbotController = ChatbotController;
__decorate([
    (0, common_1.Get)('init'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChatbotController.prototype, "init", null);
__decorate([
    (0, common_1.Post)('ask'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AskDto, Object]),
    __metadata("design:returntype", void 0)
], ChatbotController.prototype, "ask", null);
exports.ChatbotController = ChatbotController = __decorate([
    (0, common_1.Controller)('chatbot'),
    __metadata("design:paramtypes", [ChatbotService, ChatRateLimiter])
], ChatbotController);
let ChatbotModule = class ChatbotModule {
};
exports.ChatbotModule = ChatbotModule;
exports.ChatbotModule = ChatbotModule = __decorate([
    (0, common_1.Module)({
        controllers: [ChatbotController],
        providers: [ChatbotService, ChatRateLimiter],
    })
], ChatbotModule);
//# sourceMappingURL=chatbot.module.js.map